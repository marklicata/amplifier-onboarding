# Amplifier Chat Setup

The chat works in two modes:

## Current Mode: Fallback (Working Now ✅)

The chat uses intelligent fallback responses. Works out of the box!

## Enabling Full AI Mode

To get real AI-powered responses:

### 1. Install Python packages

```bash
cd src
pip install -r requirements.txt
```

This installs:
- `amplifier-core` - Core library
- `amplifier-foundation` - Default modules (loop-basic, context-simple, etc.)
- `anthropic` - Provider for Claude
- `python-dotenv` - Load .env files

### 2. Make sure API key is in .env

```bash
# src/.env
ANTHROPIC_API_KEY=your-key-here
```

### 3. Restart and test

```bash
npm run dev
```

Click "Got Questions?" and ask anything!

## That's It!

No CLI needed. The Python libraries are all you need.

Once installed:
- Modules are auto-discovered from `amplifier-foundation`
- API key is loaded from `.env`
- Amplifier session starts automatically

## Troubleshooting

**"Module not found" errors**
```bash
pip list | grep amplifier
```
Should show `amplifier-core` and `amplifier-foundation`

**Still using fallback**
Check terminal logs when sending a message. You'll see either:
- "using_amplifier": true (AI mode)
- "using_amplifier": false (Fallback mode)

**Want to use different provider?**
Edit `requirements.txt` and `_get_mount_config()` in `amplifier-chat.py`
