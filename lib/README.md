# Amplifier Chat Integration

This directory contains the Amplifier chat integration that powers the "Got Questions?" feature.

## Architecture

```
Frontend (ChatWindow)
  ↓ HTTP POST /api/chat
Next.js API Route (src/app/api/chat/route.ts)
  ↓ spawns Python subprocess
Python Script (src/lib/amplifier-chat.py)
  ↓ uses Amplifier Core directly
Amplifier Response
```

## Files

- **amplifier-chat.py** - Standalone Python script that:
  - Creates/manages Amplifier sessions using `amplifier-core`
  - Configures mount plan with providers, orchestrators, and tools
  - Includes context about Amplifier to answer questions
  - Falls back to intelligent responses if Amplifier unavailable
  - Returns JSON responses

- **API Route** (../app/api/chat/route.ts) - Next.js endpoint that:
  - Receives chat messages from frontend
  - Spawns Python script with message as argument
  - Returns parsed JSON response

- **requirements.txt** - Python dependencies needed for the chat

## How It Works

1. User types question in ChatWindow
2. Frontend sends POST to `/api/chat` with message
3. API route spawns Python script: `python amplifier-chat.py "message" "session_id"`
4. Python script:
   - Initializes real Amplifier session using `AmplifierSession`
   - Configures mount plan with required modules
   - Adds context about Amplifier itself
   - Executes the prompt through Amplifier
   - Returns JSON with response
5. API route sends response back to frontend
6. ChatWindow displays the answer

## Setup

### 1. Install Python Dependencies

```bash
cd src
pip install -r requirements.txt
```

### 2. Configure Provider

The script uses the Anthropic provider by default. Add your API key to `src/.env`:

```bash
# src/.env
ANTHROPIC_API_KEY=your-api-key-here
```

The script will automatically load this file. Or configure a different provider in the mount config (see `_get_mount_config()` in amplifier-chat.py).

### 3. Initialize Amplifier (Optional)

If you want to customize the configuration:

```bash
amplifier init
```

## Mount Configuration

The script uses this configuration:

```python
{
    "session": {
        "orchestrator": "loop-basic",
        "context": "context-simple"
    },
    "providers": [
        {"module": "provider-anthropic"}
    ],
    "tools": [
        {"module": "tool-filesystem"},
        {"module": "tool-bash"}
    ]
}
```

You can customize this in the `_get_mount_config()` method.

## Fallback Behavior

If Amplifier Core is not installed or initialization fails, the script falls back to intelligent responses based on:
- Pattern matching common questions
- Built-in knowledge about Amplifier
- Helpful suggestions and navigation

## Usage

The chat is integrated into all pages via the Header's "Got Questions?" button.

## Customizing Responses

### Add Context
Edit the `system_context` in the `chat()` method to change what Amplifier knows about itself.

### Add Fallback Responses
Edit `_fallback_response()` to add more pattern-matched responses.

### Change Configuration
Edit `_get_mount_config()` to use different modules, providers, or tools.
