# Quick Test Commands Reference

Copy-paste these commands to quickly run tests.

## Setup

```bash
# Install dependencies
pip install pytest pytest-asyncio httpx pyjwt pyyaml
npm install

# Verify setup
python lib/amplifier/python/validate-deps.py
```

## Unit Tests

```bash
# Run all unit tests
cd lib\amplifier\python
pytest test_api_client.py -v

# Run specific test class
pytest test_api_client.py::TestJWTTokenManagement -v

# Run without pytest
python test_api_client.py
```

## Integration Tests

```bash
# Enable and run integration tests
cd lib\amplifier\python
set AMPLIFIER_API_INTEGRATION_TESTS=1
pytest test_api_client.py -v
```

## CLI Tests

```bash
# Basic chat test
python lib/amplifier/python/amplifier-chat.py "What is Amplifier?"

# Context test
python lib/amplifier/python/amplifier-chat.py "My name is Alice"
python lib/amplifier/python/amplifier-chat.py "What is my name?"

# Performance test
powershell "Measure-Command { python lib/amplifier/python/amplifier-chat.py 'Hello' }"
```

## Frontend Tests

```bash
# Start dev server
npm run dev

# Then open browser to: http://localhost:3000
```

## Health Checks

```bash
# Check API health
curl https://localhost:8765/health

# Or in browser: https://localhost:8765/docs

# Check dependencies
python lib/amplifier/python/validate-deps.py
```

## JWT Token

```bash
# View token
type %USERPROFILE%\.amplifier\nexus-user-token.txt

# Decode token
python -c "import jwt; token = open('C:/Users/malicata/.amplifier/nexus-user-token.txt').read().strip(); print(jwt.decode(token, 'development-secret-key-change-in-production', algorithms=['HS256']))"

# Delete and regenerate
del %USERPROFILE%\.amplifier\nexus-user-token.txt
python lib/amplifier/python/amplifier-chat.py "test"
```

## Config Management

```bash
# List configs
python -c "import asyncio; from amplifier_api_client import AmplifierAPIClient; asyncio.run((lambda: asyncio.create_task(AmplifierAPIClient().list_user_configs()))())"

# Create config from JSON
python -c "import asyncio; from amplifier_api_client import AmplifierAPIClient; client = AmplifierAPIClient(); asyncio.run(client.create_config_from_json('01-chat-bundle.json'))"
```

## Bundle Conversion

```bash
# Convert all bundles
cd lib\amplifier\python
python convert_bundles.py

# Verify JSON
dir ..\bundles\*.json
```

## Error Testing

```bash
# Test with API down (change .env temporarily)
# AMPLIFIER_API_URL=https://localhost:9999
python lib/amplifier/python/amplifier-chat.py "test"

# Test with invalid key
# AMPLIFIER_API_KEY=invalid
python lib/amplifier/python/amplifier-chat.py "test"

# Test with API disabled
# AMPLIFIER_USE_API=false
python lib/amplifier/python/amplifier-chat.py "test"
```

## Git Status

```bash
# See what changed
git status
git diff

# See new files
git ls-files --others --exclude-standard
```

## Run All Tests (Quick Check)

```bash
# 1. Validate dependencies
python lib/amplifier/python/validate-deps.py

# 2. Run unit tests
cd lib\amplifier\python
pytest test_api_client.py -v -k "not TestIntegration"
cd ..\..\..

# 3. Test CLI
python lib/amplifier/python/amplifier-chat.py "Hello"

# 4. Start frontend (manual test)
npm run dev
```

## Common Issues

### npm not found
```bash
# Install Node.js from: https://nodejs.org/
# Restart terminal after installation
```

### API not responding
```bash
# Check if API is running
curl https://localhost:8765/health

# Check .env has correct URL
type .env | findstr AMPLIFIER_API_URL
```

### Import errors
```bash
# Install missing packages
pip install httpx pyjwt pyyaml pytest pytest-asyncio
```

### JWT errors
```bash
# Delete and regenerate token
del %USERPROFILE%\.amplifier\nexus-user-token.txt
python lib/amplifier/python/amplifier-chat.py "test"
```
