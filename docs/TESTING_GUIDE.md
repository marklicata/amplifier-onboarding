# Amplifier API Migration - Testing Guide

This guide provides step-by-step instructions for testing the migration from direct library imports to REST API calls.

## Prerequisites

### 1. Install Missing Dependencies

```bash
# Install npm (if missing)
# Download from: https://nodejs.org/

# Install Python test dependencies
pip install pytest pytest-asyncio httpx pyjwt pyyaml

# Install Node.js dependencies
cd C:\Users\malicata\source\amplifier-onboarding
npm install
```

### 2. Verify Environment Setup

```bash
# Check all dependencies
python lib/amplifier/python/validate-deps.py
```

Expected output should show all dependencies as `[OK]` except npm (if not installed yet).

### 3. Start Amplifier API Service

The API service must be running for integration tests:

```bash
# Check if API is running
curl https://localhost:8765/health

# Or visit in browser:
# https://localhost:8765/docs (Swagger UI)
```

If not running, start the amplifier-api service according to its documentation.

---

## Test Suite Overview

### Test Levels
1. **Unit Tests** - Test individual components (mock API)
2. **Integration Tests** - Test against real API service
3. **CLI Tests** - Test command-line interface
4. **Frontend Tests** - Test via Next.js application
5. **Error Scenario Tests** - Test error handling
6. **Performance Tests** - Compare old vs new implementation

---

## Step-by-Step Testing

### Step 1: Verify Bundle Conversion

**Purpose:** Ensure all YAML bundles were correctly converted to JSON.

```bash
cd C:\Users\malicata\source\amplifier-onboarding

# Check that JSON files exist
dir lib\amplifier\bundles\*.json

# Verify JSON structure of chat bundle
python -c "import json; print(json.dumps(json.load(open('lib/amplifier/bundles/01-chat-bundle.json')), indent=2))"
```

**Expected Results:**
- 9 JSON files should exist (00-08)
- JSON should be valid and contain: name, description, session, providers, context

**✓ Pass Criteria:** All 9 JSON files exist and are valid JSON.

---

### Step 2: Run Unit Tests

**Purpose:** Test API client components in isolation (no API service needed).

```bash
cd C:\Users\malicata\source\amplifier-onboarding\lib\amplifier\python

# Run all unit tests
pytest test_api_client.py -v

# Or run without pytest
python test_api_client.py
```

**Expected Results:**
- All unit tests should pass (marked with `PASSED`)
- Integration tests will be skipped (marked with `SKIPPED`)

**✓ Pass Criteria:** All unit tests pass, 0 failures.

**Example Output:**
```
test_api_client.py::TestJWTTokenManagement::test_generate_jwt_token PASSED
test_api_client.py::TestJWTTokenManagement::test_jwt_token_contains_user_id PASSED
test_api_client.py::TestConfigManagement::test_list_user_configs_success PASSED
...
========== 15 passed, 1 skipped in 2.34s ==========
```

---

### Step 3: Run Integration Tests (API Service Required)

**Purpose:** Test against the actual API service.

```bash
cd C:\Users\malicata\source\amplifier-onboarding\lib\amplifier\python

# Enable integration tests
set AMPLIFIER_API_INTEGRATION_TESTS=1

# Run all tests including integration
pytest test_api_client.py -v

# Or run just integration tests
pytest test_api_client.py -v -k "TestIntegration"
```

**Expected Results:**
- Integration test should create config, session, and send message
- Should receive a response from Claude

**✓ Pass Criteria:** Integration test passes with valid response.

**Note:** If this fails, check:
- API service is running at https://localhost:8765
- API credentials in .env are correct
- JWT token was created in `~\.amplifier\nexus-user-token.txt`

---

### Step 4: Test Chat via CLI

**Purpose:** Test the chat script directly from command line.

```bash
cd C:\Users\malicata\source\amplifier-onboarding

# Test with API enabled (default)
python lib/amplifier/python/amplifier-chat.py "What is Amplifier?"
```

**Expected Results:**
```json
{
  "response": "Amplifier is...",
  "timestamp": "2026-02-11T...",
  "session_id": "..."
}
```

**✓ Pass Criteria:**
- Valid JSON response received
- Response contains: response, timestamp, session_id
- No error field present

**Check Logs:**
Look at stderr output for diagnostic info:
```
Amplifier API client loaded
Looking up chat-bundle config...
Found existing config: config-xyz
Creating new session...
Created session: session-abc
Sending message to Amplifier API: What is Amplifier?
```

---

### Step 5: Test Session Continuity

**Purpose:** Verify that the session maintains context across multiple messages.

```bash
cd C:\Users\malicata\source\amplifier-onboarding

# First message
python lib/amplifier/python/amplifier-chat.py "My name is John"

# Second message (should remember the name)
python lib/amplifier/python/amplifier-chat.py "What is my name?"
```

**Expected Results:**
- Both messages should use the SAME session_id
- Second response should remember context from first message

**✓ Pass Criteria:** Session ID is consistent, context is maintained.

**Note:** Currently, each script invocation creates a new chat instance. Session persistence would require the Next.js API route to maintain the session.

---

### Step 6: Test JWT Token Generation

**Purpose:** Verify JWT token is created and valid.

```bash
# Check if token file exists
dir %USERPROFILE%\.amplifier\nexus-user-token.txt

# View token (should exist after first API call)
type %USERPROFILE%\.amplifier\nexus-user-token.txt

# Decode and verify token
python -c "import jwt; token = open('C:/Users/malicata/.amplifier/nexus-user-token.txt').read().strip(); print(jwt.decode(token, 'development-secret-key-change-in-production', algorithms=['HS256']))"
```

**Expected Results:**
```python
{
  'sub': 'default-user',  # user_id
  'iat': 1707689760,      # issued at
  'exp': 1710281760       # expires (30 days later)
}
```

**✓ Pass Criteria:** Token file exists, contains valid JWT with user_id.

---

### Step 7: Test via Next.js Frontend

**Purpose:** Test the full end-to-end flow through the web interface.

```bash
cd C:\Users\malicata\source\amplifier-onboarding

# Start Next.js development server
npm run dev
```

Then in a browser:

1. **Open:** http://localhost:3000
2. **Navigate to:** Chat interface
3. **Send message:** "What is Amplifier?"
4. **Verify:**
   - Response is displayed
   - Formatting is correct
   - No error messages
5. **Send follow-up:** "Tell me more"
6. **Verify:**
   - Response maintains context
   - Conversation history visible

**✓ Pass Criteria:**
- Messages send successfully
- Responses display correctly
- No console errors
- Context is maintained

**Check Browser Console (F12):**
- No JavaScript errors
- API calls to `/api/chat` succeed (200 status)

**Check Terminal (Next.js logs):**
- Python subprocess spawned
- No error messages
- Chat responses logged

---

### Step 8: Test Error Scenarios

**Purpose:** Verify graceful error handling.

#### 8.1 API Service Down

```bash
# Stop the amplifier-api service (or use wrong URL)
# Edit .env temporarily:
# AMPLIFIER_API_URL=https://localhost:9999

python lib/amplifier/python/amplifier-chat.py "test"
```

**Expected Results:**
```json
{
  "error": "API error: ...",
  "timestamp": "..."
}
```

**✓ Pass Criteria:** Graceful error message, no crash.

#### 8.2 Invalid API Key

```bash
# Edit .env temporarily:
# AMPLIFIER_API_KEY=invalid-key

python lib/amplifier/python/amplifier-chat.py "test"
```

**Expected Results:**
```json
{
  "error": "Authentication error: ...",
  "timestamp": "..."
}
```

**✓ Pass Criteria:** Authentication error returned, no crash.

#### 8.3 Malformed Bundle

```bash
# Create invalid JSON bundle
echo "{ invalid json }" > lib/amplifier/bundles/test-invalid.json

# Try to create config from it (modify test_api_client.py)
pytest test_api_client.py::TestConfigManagement::test_create_config_from_json_success -v
```

**✓ Pass Criteria:** Appropriate error raised, no crash.

---

### Step 9: Test Feature Flag (Rollback)

**Purpose:** Verify the feature flag allows rollback to library-based implementation.

```bash
# Edit .env:
# AMPLIFIER_USE_API=false

python lib/amplifier/python/amplifier-chat.py "test"
```

**Expected Results:**
```json
{
  "error": "Amplifier API client not available or disabled",
  "timestamp": "..."
}
```

**Note:** The old library-based code was completely replaced. The feature flag now just disables the API client. To truly rollback, you'd need to restore the previous version of amplifier-chat.py from git.

**✓ Pass Criteria:** Script respects the feature flag.

---

### Step 10: Performance Comparison

**Purpose:** Compare performance between library and API approaches.

#### 10.1 Measure API Version

```bash
# Enable API mode
# AMPLIFIER_USE_API=true in .env

# Time first message (includes config lookup + session creation)
powershell "Measure-Command { python lib/amplifier/python/amplifier-chat.py 'Hello' }"

# Time second message (reuses session)
powershell "Measure-Command { python lib/amplifier/python/amplifier-chat.py 'How are you?' }"
```

**Expected Results:**
- First message: ~1-3 seconds (config + session + message)
- Second message: ~0.5-1.5 seconds (message only)

**Note:** Each CLI invocation creates a new Python process, so session reuse doesn't apply. True session reuse happens at the Next.js API route level.

#### 10.2 Record Baseline

Document the results:
- First message latency: ___ ms
- Subsequent message latency: ___ ms
- API response time: ___ ms
- Total end-to-end time: ___ ms

**✓ Pass Criteria:** Performance is comparable to or better than library-based approach.

---

### Step 11: Test Config Management

**Purpose:** Verify config lookup and creation logic.

```bash
cd C:\Users\malicata\source\amplifier-onboarding\lib\amplifier\python

# Test config lookup
python -c "
import asyncio
from amplifier_api_client import AmplifierAPIClient

async def test():
    client = AmplifierAPIClient()

    # List all configs
    configs = await client.list_user_configs()
    print(f'Found {len(configs)} configs')
    for cfg in configs:
        print(f'  - {cfg.get(\"name\")} (id: {cfg.get(\"id\")})')

    # Look up chat-bundle
    config_id = await client.get_config_by_name('chat-bundle')
    print(f'chat-bundle config_id: {config_id}')

    await client.close()

asyncio.run(test())
"
```

**Expected Results:**
- Lists all configs for the authenticated user
- Finds chat-bundle config if it was created
- Returns None if config doesn't exist

**✓ Pass Criteria:** Config operations work correctly.

---

### Step 12: Test Streaming (Future)

**Purpose:** Test streaming responses (if implemented).

**Note:** The current implementation has `stream_message()` method but amplifier-chat.py doesn't use it yet.

To test streaming in the future:

```python
import asyncio
from amplifier_api_client import AmplifierAPIClient

async def test_streaming():
    client = AmplifierAPIClient()

    # Get config and session
    config_id = await client.get_config_by_name('chat-bundle')
    session_id = await client.create_session(config_id)

    # Stream response
    print("Streaming response:")
    async for chunk in client.stream_message(session_id, "Tell me about Amplifier"):
        print(chunk, end='', flush=True)

    await client.close()

asyncio.run(test_streaming())
```

**✓ Pass Criteria:** Chunks received in real-time, complete response assembled.

---

## Test Checklist Summary

Use this checklist to track testing progress:

- [ ] **Step 1:** Bundle conversion verified (9 JSON files exist)
- [ ] **Step 2:** Unit tests pass (15+ tests)
- [ ] **Step 3:** Integration tests pass (API service running)
- [ ] **Step 4:** Chat via CLI works (valid JSON response)
- [ ] **Step 5:** Session continuity works (context maintained)
- [ ] **Step 6:** JWT token generated and valid
- [ ] **Step 7:** Frontend chat works (Next.js)
- [ ] **Step 8:** Error scenarios handled gracefully
  - [ ] API service down
  - [ ] Invalid credentials
  - [ ] Malformed data
- [ ] **Step 9:** Feature flag works (rollback capability)
- [ ] **Step 10:** Performance acceptable (similar to baseline)
- [ ] **Step 11:** Config management works (list/get/create)
- [ ] **Step 12:** Streaming works (future implementation)

---

## Troubleshooting

### Issue: JWT token errors

**Solution:**
```bash
# Delete token and regenerate
del %USERPROFILE%\.amplifier\nexus-user-token.txt
python lib/amplifier/python/amplifier-chat.py "test"
```

### Issue: SSL certificate errors

**Solution:** The client has `verify=False` for localhost. For production, you'll need valid certificates.

### Issue: Config not found

**Solution:**
```python
# Manually create config
python -c "
import asyncio
from amplifier_api_client import AmplifierAPIClient

async def create():
    client = AmplifierAPIClient()
    config_id = await client.create_config_from_json('01-chat-bundle.json')
    print(f'Created config: {config_id}')
    await client.close()

asyncio.run(create())
"
```

### Issue: Session errors

**Solution:** Check API logs for detailed error messages. Sessions may expire or become invalid.

### Issue: npm not found

**Solution:** Install Node.js from https://nodejs.org/ which includes npm.

---

## Test Data

### Sample Test Messages

Use these messages to test different scenarios:

1. **Basic question:** "What is Amplifier?"
2. **Context test:** "My name is Alice" → "What is my name?"
3. **Code question:** "Show me a Python example"
4. **Long response:** "Explain how Amplifier works in detail"
5. **Follow-up:** "Tell me more" (after any response)

---

## Test Results Template

Document your test results:

```
Test Date: _____________
Tester: _____________
Environment: Development / Staging / Production

Bundle Conversion: PASS / FAIL
Unit Tests: ___ passed, ___ failed
Integration Tests: PASS / FAIL
CLI Tests: PASS / FAIL
Frontend Tests: PASS / FAIL
Error Handling: PASS / FAIL
Performance: PASS / FAIL (avg latency: ___ ms)

Issues Found:
1. ___________________
2. ___________________

Notes:
___________________
```

---

## Next Steps After Testing

Once all tests pass:

1. **Staging Deployment:**
   - Deploy to staging environment
   - Run full test suite again
   - Monitor for 24 hours

2. **Production Preparation:**
   - Get production API credentials
   - Update environment variables
   - Create rollback plan

3. **Gradual Rollout:**
   - 10% of traffic → Monitor → 50% → Monitor → 100%
   - Keep feature flag ready for quick rollback

4. **Monitoring:**
   - Set up alerts for error rates
   - Monitor latency metrics
   - Track session success rates

---

## Additional Resources

- **API Documentation:** https://localhost:8765/docs
- **Migration Plan:** API_MIGRATION_PLAN.md
- **Implementation Summary:** MIGRATION_SUMMARY.md
- **Test Suite:** lib/amplifier/python/test_api_client.py
