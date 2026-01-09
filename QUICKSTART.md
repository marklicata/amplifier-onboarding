# Amplifier Onboarding - Quick Start Guide

Get the Amplifier Onboarding application running on your local machine in 5 minutes.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **Python** 3.9 or higher ([Download](https://www.python.org/downloads/))
- **npm** (comes with Node.js)
- **pip** (comes with Python)
- **Anthropic API Key** ([Get one free](https://console.anthropic.com/))

### Check Your Versions

```bash
node --version    # Should be v18.0.0 or higher
python --version  # Should be 3.9.0 or higher
npm --version     # Should be 8.0.0 or higher
pip --version     # Should be 20.0.0 or higher
```

## Step 1: Clone the Repository

```bash
# Clone the repo
git clone https://github.com/your-org/amplifier-onboarding.git

# Navigate to the directory
cd amplifier-onboarding
```

## Step 2: Install Node.js Dependencies

```bash
npm install
```

This installs:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- react-markdown
- Other development dependencies

**Expected time**: 1-2 minutes

## Step 3: Install Python Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- `python-dotenv` - Environment variable management
- `amplifier-core` - Amplifier kernel (if available)
- `amplifier-foundation` - Pre-built modules and bundles (if available)
- `anthropic` - Anthropic SDK for Claude API

**Expected time**: 30-60 seconds

### Troubleshooting Python Installation

If you encounter errors:

**On Windows:**
```bash
# Use Python 3 explicitly
python -m pip install -r requirements.txt

# Or create a virtual environment first
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

**On macOS/Linux:**
```bash
# Use Python 3 explicitly
python3 -m pip install -r requirements.txt

# Or create a virtual environment first
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Package not found errors:**

If `amplifier-core` or `amplifier-foundation` packages are not available on PyPI, you may need to:
1. Install them from a private package index
2. Install from source
3. Contact the Amplifier team for access

The application will still run in "fallback mode" without these packages, using pre-programmed responses instead of real AI.

## Step 4: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file and add your API key:

```bash
# Required: Your Anthropic API key
ANTHROPIC_API_KEY=sk-ant-api03-...your-key-here...

# Optional: Alternative providers (leave commented if not using)
# OPENAI_API_KEY=sk-...your-openai-key...
# AZURE_OPENAI_API_KEY=your-azure-key
# AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
```

### Getting an Anthropic API Key

1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the key (it starts with `sk-ant-api03-`)
6. Paste it into your `.env` file

**Note**: Anthropic offers free trial credits for new users.

## Step 5: Start the Development Server

```bash
npm run dev
```

You should see output like:

```
   ▲ Next.js 14.2.0
   - Local:        http://localhost:3000
   - Environments: .env

 ✓ Ready in 2.3s
```

## Step 6: Open in Your Browser

Visit: **http://localhost:3000**

You should see the Amplifier Onboarding landing page.

## Step 7: Test the Chat

1. Look for the **"Got Questions?"** button in the header
2. Click it to open the chat modal
3. Type a message like "What is Amplifier?"
4. Press Enter or click Send

If everything is configured correctly:
- The chat will display a loading indicator
- After 2-5 seconds, you'll see an AI-generated response
- The response will be formatted in markdown

### Fallback Mode

If you see a simple, pre-programmed response instead of a detailed AI response, you're in fallback mode. This means:
- Python dependencies aren't installed correctly, OR
- Your API key is missing or invalid, OR
- There's a configuration issue

Check the terminal logs for error messages.

## Step 8: Try the Playground

1. Navigate to **http://localhost:3000/playground** or click the "Playground" link in the header
2. Browse the available bundles organized by tier:
   - **Beginner**: Basic Bundle (simple AI conversations)
   - **Intermediate**: Documentation Bundle, Developer Bundle
   - **Advanced**: Code Reviewer Bundle, Presentation Creator Bundle
3. Click on a bundle card to view its details
4. Review the bundle's YAML configuration (collapsible)
5. Choose a suggested prompt or write your own
6. Click "Execute Bundle" to run it
7. Watch real-time streaming execution with status updates
8. View formatted results with markdown and syntax highlighting

### Bundle: Basic Bundle

The simplest bundle to try:
1. Click on "Basic Bundle" card
2. Choose a suggested prompt like "Explain quantum computing in simple terms"
3. Click "Execute Bundle"
4. See the AI respond in real-time with streaming output

### Bundle: Developer Bundle

A more powerful bundle:
1. Click on "Developer Bundle" card
2. Try a prompt like "Read package.json and explain the project dependencies"
3. Click "Execute Bundle"
4. See the AI use filesystem and analysis tools to examine your project

### Bundle: Code Reviewer Bundle

For code quality analysis:
1. Click on "Code Reviewer Bundle" card
2. Try "Review this codebase for security vulnerabilities"
3. Uses Claude Opus for deep analysis
4. Get comprehensive code review feedback

## Verification Checklist

- [ ] Node.js and npm are installed
- [ ] Python 3.9+ is installed
- [ ] `npm install` completed without errors
- [ ] `pip install -r requirements.txt` completed without errors
- [ ] `.env` file exists with valid `ANTHROPIC_API_KEY`
- [ ] `npm run dev` starts without errors
- [ ] http://localhost:3000 loads the landing page
- [ ] Chat button appears in the header
- [ ] Chat responds to messages (fallback or AI mode)
- [ ] Playground page loads at `/playground`
- [ ] Playground bundles can be browsed and executed
- [ ] Bundle YAML configurations are viewable
- [ ] Streaming execution works with real-time updates

## Common Issues & Solutions

### Issue: Port 3000 Already in Use

```bash
# Find and kill the process using port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Or use a different port:
npm run dev -- -p 3002
```

### Issue: "Module not found" Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Python cache
find . -type d -name "__pycache__" -exec rm -r {} +
pip install -r requirements.txt --force-reinstall
```

### Issue: TypeScript Errors

```bash
# Check for errors
npx tsc --noEmit

# Most TypeScript errors won't prevent dev server from running
# Next.js will show them in the browser during development
```

### Issue: Chat Returns "Error" Message

Check the terminal logs where `npm run dev` is running. You should see error details like:

```
Error executing Python script: ...
```

Common causes:
- Missing or invalid API key in `.env`
- Python script path issues
- Timeout (30 seconds) exceeded
- API rate limiting

### Issue: API Key Not Working

Verify your API key:
1. Check it starts with `sk-ant-api03-`
2. No extra spaces or quotes around it in `.env`
3. File is named `.env` not `.env.txt`
4. Restart the dev server after changing `.env`

Test the key directly:

```bash
# On macOS/Linux:
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-sonnet-20240229","max_tokens":1024,"messages":[{"role":"user","content":"Hello"}]}'

# On Windows (PowerShell):
$headers = @{
    "x-api-key" = $env:ANTHROPIC_API_KEY
    "anthropic-version" = "2023-06-01"
    "content-type" = "application/json"
}
$body = '{"model":"claude-3-sonnet-20240229","max_tokens":1024,"messages":[{"role":"user","content":"Hello"}]}'
Invoke-WebRequest -Uri "https://api.anthropic.com/v1/messages" -Method POST -Headers $headers -Body $body
```

If this fails, your API key is invalid.

### Issue: Playground Bundles Fail to Execute

Check for these common issues:

1. **Missing Python Dependencies**:
   ```bash
   # Verify amplifier-foundation is installed
   pip list | grep amplifier-foundation

   # Reinstall if needed
   pip install -r requirements.txt
   ```

2. **Bundle Files Missing**:
   - Verify `lib/bundles/` directory exists with YAML files
   - Should contain: 01-basic-bundle.yaml through 05-presentation-creator-bundle.yaml
   - These files should be in the repository

3. **Python Script Errors**:
   - Check terminal logs for detailed error messages
   - The scripts are at `lib/run-bundle.py` and `lib/run-bundle-stream.py`
   - Test manually:
     ```bash
     cd lib
     echo '{"bundleId":"01-basic-bundle","bundlePath":"01-basic-bundle.yaml","prompt":"Hello"}' | python run-bundle.py
     ```

4. **Timeout Issues**:
   - First-time execution may take 30-60 seconds as modules are downloaded
   - Subsequent executions should be faster (2-5 seconds)
   - If consistently timing out, check your network connection
   - Timeout is set to 60 seconds for bundle execution

## Next Steps

### Explore the Application

1. **Landing Page** (`/elevator-pitch`): Learn about Amplifier's value proposition
2. **Playground** (`/playground`): Explore and execute customizable Amplifier bundles
   - Browse bundles by tier (beginner, intermediate, advanced)
   - View live YAML configurations for each bundle
   - Try suggested prompts or write your own
   - Experience real-time streaming execution
   - See formatted AI results with markdown and syntax highlighting
3. **Chat**: Ask questions about Amplifier and see it in action
4. **System Overview** (`/system-overview`): Understand the architecture

### Development

1. **Make Changes**: Edit files in `app/`, `components/`, or `lib/`
2. **Hot Reload**: Changes appear automatically in browser
3. **View Logs**: Check terminal for server-side logs
4. **Debug**: Use browser DevTools for frontend debugging

### Build for Production

```bash
# Create optimized production build
npm run build

# Test production build locally
npm run start

# Visit http://localhost:3000
```

### Learn More

- Read the full [README.md](./README.md) for architecture details
- Review [SETUP.md](./SETUP.md) for chat-specific configuration
- Check [.planning/PHASE_1_MVP.md](./.planning/PHASE_1_MVP.md) for roadmap

## Development Tips

### File Watching

Next.js watches these files for changes:
- `app/**/*` - Pages and API routes
- `components/**/*` - React components
- `styles/**/*` - Stylesheets
- `lib/**/*` - Python scripts (requires server restart)

**Note**: Changes to Python files require a manual restart of `npm run dev`.

### Environment Variables

- Changes to `.env` require server restart
- Use `.env.local` for local overrides (not committed to git)
- Never commit `.env` with real API keys

### Debugging Python Scripts

Test Python scripts directly:

```bash
# Test chat script
cd lib
python amplifier-chat.py "What is Amplifier?" "test-session-123"

# Expected output: JSON response with AI message

# Test bundle execution script
cd lib
echo '{"bundleId":"01-basic-bundle","bundlePath":"01-basic-bundle.yaml","prompt":"Explain AI"}' | python run-bundle.py

# Expected output: JSON response with bundle execution result

# Test streaming bundle execution
echo '{"bundleId":"01-basic-bundle","bundlePath":"01-basic-bundle.yaml","prompt":"Explain AI"}' | python run-bundle-stream.py

# Expected output: SSE-formatted streaming response
```

### Viewing Logs

**Frontend logs**: Browser DevTools Console (F12)
**Backend logs**: Terminal where `npm run dev` is running
**Python logs**: Also in terminal (stderr)

## Getting Help

- **Documentation**: See [README.md](./README.md)
- **Issues**: Check existing GitHub Issues or create a new one
- **API Docs**: https://docs.anthropic.com/claude/reference/
- **Next.js Docs**: https://nextjs.org/docs

## Summary

You now have:
- A running Next.js development server on port 3000
- Python backend integration with Amplifier
- AI-powered chat using Claude
- Interactive playground with 5 customizable Amplifier bundles
- Real-time streaming execution with SSE
- A complete local development environment

**Total setup time**: ~5 minutes
**You're ready to start developing and exploring!**

**Key features to try:**
- `/elevator-pitch` - Learn about Amplifier
- `/playground` - Execute customizable AI bundles with real-time streaming
- Chat button - Ask questions about Amplifier
- `/system-overview` - Understand the architecture

---

**Need help?** Open an issue or check the terminal logs for error messages.
