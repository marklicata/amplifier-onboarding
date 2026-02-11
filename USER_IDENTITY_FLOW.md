# User Identity Flow - Complete Guide

## Overview

The user identity now flows through the entire stack to ensure each user has their own configs and sessions.

## The Flow

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐      ┌──────────────┐
│   Browser   │─────▶│  Next.js API │─────▶│ Python Chat │─────▶│ Amplifier API│
│  (Frontend) │      │    Route     │      │   Script    │      │   Service    │
└─────────────┘      └──────────────┘      └─────────────┘      └──────────────┘
     │                      │                     │                     │
  user_id              user_id               user_id               JWT with
  (localStorage)       (request body)        (CLI arg)             user_id claim
```

## 1. Frontend (Browser)

**Location:** `lib/telemetry/identity.ts`

The identity is stored in localStorage:
- `amp_anonymous_id` - Persistent browser ID (used if not logged in)
- `amp_user_id` - Authenticated user ID (GitHub OAuth - future feature)

**Current Status:**
- ✅ Anonymous ID automatically generated
- ⚠️ GitHub OAuth not implemented yet (uses anonymous_id)

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

✅ **Updated** to accept `userId` and pass to Python:

```typescript
const { message, sessionId, userId } = body;
const command = `python "${scriptPath}" "${message}" "${sessionId}" "${userId}"`;
```

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
- ✅ API route accepts `userId` parameter
- ✅ API route passes to Python script
- ✅ Python script accepts `user_id` CLI argument
- ✅ Python script creates client with `user_id`
- ✅ API client generates JWT with `user_id`

### Frontend (⚠️ Needs Update)
- ⚠️ Chat component must pass `userId` in request body

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

### 1. Test with Hardcoded User ID

```bash
# Test directly with Python
python lib/amplifier/python/amplifier-chat.py "Hello" "" "test-user-123"

# Should see in logs:
# Amplifier API client loaded for user: test-user-123
```

### 2. Test Different Users Get Different Configs

```bash
# User 1
python lib/amplifier/python/amplifier-chat.py "Hello" "" "user-1"

# User 2 (should create separate config)
python lib/amplifier/python/amplifier-chat.py "Hello" "" "user-2"
```

Each user should get their own config in the API.

### 3. Verify in Frontend

Once updated:
1. Open browser console (F12)
2. Check `localStorage.getItem('amp_anonymous_id')`
3. Send a chat message
4. Check Network tab - request body should include `userId`

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
