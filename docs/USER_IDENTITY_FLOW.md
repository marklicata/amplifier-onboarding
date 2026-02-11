# User Identity Flow - Complete Guide

## Overview

The user identity now flows through the entire stack to ensure each user has their own configs and sessions. When deployed to Azure with EasyAuth enabled, the system automatically captures the authenticated Microsoft user identity.

## The Flow

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐      ┌──────────────┐
│   Browser   │─────▶│  Next.js API │─────▶│ Python Chat │─────▶│ Amplifier API│
│  (Frontend) │      │    Route     │      │   Script    │      │   Service    │
└─────────────┘      └──────────────┘      └─────────────┘      └──────────────┘
     │                      │                     │                     │
  user_id              user_id               user_id               JWT with
  (localStorage)       Azure EasyAuth        (CLI arg)             user_id claim
                       or request body
```

### Identity Sources (Priority Order)

1. **Azure EasyAuth Headers** (Production) - `x-ms-client-principal-id`
2. **Client-provided userId** (Development/Fallback) - `body.userId`
3. **Anonymous** (Default) - `"anonymous"`

## 0. Azure EasyAuth (Production Only)

**Location:** Azure Container Apps configuration

When deployed to Azure with EasyAuth enabled:
- Users must sign in with their Microsoft account before accessing the app
- Azure automatically injects authentication headers into every request:
  - `x-ms-client-principal-id` - Unique Microsoft user ID ✅ **Used as userId**
  - `x-ms-client-principal-name` - User's email/UPN
  - `x-ms-client-principal-idp` - Identity provider (e.g., "aad")
  - `x-ms-client-principal` - Base64-encoded full user claims

**Behavior:**
- ✅ Automatically captures Microsoft account user ID
- ✅ Works without any frontend changes
- ✅ Falls back to client-provided userId if headers not present (local dev)

## 1. Frontend (Browser)

**Location:** `lib/telemetry/identity.ts`

The identity is stored in localStorage:
- `amp_anonymous_id` - Persistent browser ID (used if not logged in)
- `amp_user_id` - Authenticated user ID (GitHub OAuth - future feature)

**Current Status:**
- ✅ Anonymous ID automatically generated
- ✅ Azure EasyAuth captures Microsoft user ID (production)
- ⚠️ GitHub OAuth not implemented yet (uses anonymous_id in local dev)

## 2. Sending Chat Requests

### Before (Incorrect):
```typescript
// Old way - no user identity
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    message: userMessage
  })
});
```

### After (Correct):
```typescript
import { getOrCreateIdentity } from '@/lib/telemetry/identity';

// Get user identity
const identity = getOrCreateIdentity();

// Send with user_id
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: userMessage,
    userId: identity.user_id || identity.anonymous_id  // Use authenticated or anonymous
  })
});
```

## 3. API Route (Next.js)

**Location:** `app/api/chat/route.ts`

✅ **Updated** to extract user ID from Azure EasyAuth headers with fallback:

```typescript
// Extract Microsoft user ID from Azure EasyAuth headers (if present)
const msUserId = request.headers.get('x-ms-client-principal-id');
const msUserEmail = request.headers.get('x-ms-client-principal-name');

// Priority: Azure EasyAuth headers > body.userId > 'anonymous'
const userId = msUserId || body.userId || 'anonymous';

// Pass to Python script
const command = `python "${scriptPath}" "${message}" "${sessionId}" "${userId}"`;
```

**Behavior:**
- In production with EasyAuth: Uses Microsoft account user ID
- In local dev: Uses client-provided userId from request body
- Fallback: Uses 'anonymous' if neither is available

## 4. Python Script

**Location:** `lib/amplifier/python/amplifier-chat.py`

✅ **Updated** to accept user_id parameter:

```python
user_id = sys.argv[3] if len(sys.argv) > 3 else "anonymous"
chat = AmplifierChat(user_id=user_id)
```

## 5. API Client

**Location:** `lib/amplifier/python/amplifier_api_client.py`

Creates JWT token with user_id:

```python
client = AmplifierAPIClient(user_id=user_id)
token = client.generate_jwt_token()  # Includes user_id in 'sub' claim
```

## 6. Amplifier API

Receives JWT token and extracts user_id:
- Filters configs by user_id
- Filters sessions by user_id
- Each user has isolated data

---

## Implementation Checklist

### Backend (✅ Complete)
- ✅ API route extracts Microsoft user ID from Azure EasyAuth headers
- ✅ API route falls back to `body.userId` for local dev
- ✅ API route passes to Python script
- ✅ Python script accepts `user_id` CLI argument
- ✅ Python script creates client with `user_id`
- ✅ API client generates JWT with `user_id`

### Azure Production (✅ Complete)
- ✅ Azure EasyAuth enabled and configured
- ✅ Microsoft account authentication required
- ✅ User identity automatically captured from headers
- ✅ Each Microsoft user gets isolated Amplifier configs/sessions

### Frontend (⚠️ Optional Enhancement)
- ⚠️ Chat component can pass `userId` in request body for local dev
- ℹ️ Not required in production - Azure EasyAuth handles it automatically

---

## Frontend Update Required

You need to update your chat component to include the user identity.

### Find Your Chat Component

Look for files that call `/api/chat`:

```bash
# Search for chat API calls
grep -r "api/chat" app/ components/
```

### Update the Fetch Call

In your chat component (likely `components/Chat.tsx` or similar):

```typescript
// Add this import at the top
import { getOrCreateIdentity } from '@/lib/telemetry/identity';

// In your chat submit function:
const handleSubmit = async (message: string) => {
  // Get user identity
  const identity = getOrCreateIdentity();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        userId: identity.user_id || identity.anonymous_id
      })
    });

    const data = await response.json();
    // Handle response...
  } catch (error) {
    // Handle error...
  }
};
```

---

## Testing the Flow

### 1. Verify Azure EasyAuth Integration (Production)

Access the debug endpoint:
```
https://your-app.azurecontainerapps.io/api/debug/headers
```

Should return:
```json
{
  "authenticated": true,
  "azureAuthHeaders": {
    "principalId": "abc123-def456-...",
    "principalName": "user@company.com"
  }
}
```

### 2. Test Chat with Azure Authentication

In production:
1. Sign in with your Microsoft account
2. Send a chat message
3. Check server logs - should see:
   ```
   Authenticated via Azure EasyAuth - userId: abc123-def..., email: user@company.com
   ```

### 3. Test Local Development (Without Azure)

```bash
# Test directly with Python
python lib/amplifier/python/amplifier-chat.py "Hello" "" "test-user-123"

# Should see in logs:
# Amplifier API client loaded for user: test-user-123
```

### 4. Test Different Users Get Different Configs

```bash
# User 1
python lib/amplifier/python/amplifier-chat.py "Hello" "" "user-1"

# User 2 (should create separate config)
python lib/amplifier/python/amplifier-chat.py "Hello" "" "user-2"
```

Each user should get their own config in the API.

---

## Future: GitHub OAuth

When GitHub OAuth is implemented:

1. User logs in with GitHub → Get GitHub user_id
2. Call `linkUserIdentity(github_user_id)` from `identity.ts`
3. `amp_user_id` stored in localStorage
4. All subsequent requests use GitHub user_id instead of anonymous_id
5. User's data is tied to their GitHub account

---

## Troubleshooting

### "Config error: Failed to list configs"

**Cause:** API can't be reached

**Fix:**
```bash
# Check API is running
curl http://localhost:8765/health

# From Docker
docker-compose exec amplifier-onboarding curl http://host.docker.internal:8765/health
```

### "All users seeing same data"

**Cause:** Frontend not passing userId

**Fix:** Update chat component to include userId in request body

### "JWT token has wrong user_id"

**Cause:** Python script receiving wrong user_id

**Debug:**
```python
# Add logging to amplifier-chat.py
print(f"DEBUG: user_id = {user_id}", file=sys.stderr)
```

---

## Summary

✅ **Backend is ready** - Accepts and uses user_id
⚠️ **Frontend needs update** - Must pass userId in request

The auth flow ensures:
- Each user has their own configs
- Each user has their own sessions
- Data is isolated by user_id
- Works with anonymous users (until GitHub OAuth added)
