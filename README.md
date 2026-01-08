# Amplifier Onboarding

A modern web application for onboarding new users to Amplifier - an AI-powered development assistant platform that enables developers to build sophisticated AI workflows using declarative configuration.

## Overview

Amplifier Onboarding is a Next.js-based web application that introduces users to the Amplifier ecosystem through:

- **Marketing Landing Pages**: Comprehensive elevator pitch and value proposition
- **Interactive Playground**: Browse and execute real amplifier-foundation examples in your browser
- **Interactive Chat**: Real-time AI-powered chat using Amplifier Core and Foundation
- **System Architecture Visualization**: Clear overview of how Amplifier components work together

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3
- **Markdown**: react-markdown with GitHub-flavored markdown support

### Backend
- **Runtime**: Python 3.9+ (executed via Node.js child processes)
- **AI Framework**: Amplifier Core & Foundation
- **AI Provider**: Anthropic (Claude)
- **API Routes**: Next.js API routes (Node.js)

### Development
- **Package Manager**: npm
- **Type Checking**: TypeScript 5
- **Linting**: ESLint (Next.js config)
- **CSS Processing**: PostCSS with Autoprefixer

## Project Structure

```
amplifier-onboarding/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── chat/                 # Chat endpoints
│   │   │   ├── route.ts          # Main chat API
│   │   │   └── warmup/route.ts   # Session warmup
│   │   └── playground/           # Playground endpoints
│   │       ├── examples/         # Example metadata
│   │       ├── execute/          # Basic execution
│   │       └── execute-stream/   # Streaming execution (SSE)
│   ├── elevator-pitch/           # Landing page
│   ├── playground/               # Playground page
│   ├── system-overview/          # Architecture page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
│
├── components/                   # React components
│   ├── playground/              # Playground components
│   │   ├── ExampleBrowser.tsx   # Example list/filter
│   │   ├── ExampleViewer.tsx    # Example details
│   │   └── StreamingExecutionPanel.tsx  # Streaming execution results
│   ├── Header.tsx               # Navigation header
│   ├── Footer.tsx               # Site footer
│   ├── Layout.tsx               # Layout wrapper
│   └── ChatWindow.tsx           # Chat modal
│
├── lib/                          # Backend Python scripts
│   ├── amplifier-chat.py        # Chat execution
│   ├── amplifier-warmup.py      # Session warmup
│   ├── run-example.py           # Playground execution
│   └── playground_files/        # Playground bundles
│       └── bundle.yaml          # Foundation bundle
│
├── styles/                       # Global styles
│   └── globals.css              # Tailwind + CSS variables
│
├── .env.example                 # Environment template
├── package.json                 # Node dependencies
├── requirements.txt             # Python dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind config
└── next.config.js               # Next.js config
```

## Key Features

### Current Implementation

- **Landing Page**: Comprehensive value proposition and product overview
- **Interactive Playground**: Browse and execute 20+ real amplifier-foundation examples
  - Example browser with filtering by tier, category, and difficulty
  - Multiple view modes: Everyone, Developers, and Experts
  - **Streaming execution** with real-time SSE (Server-Sent Events)
  - Advanced options: temperature control, logging hooks, debugging hooks
  - Live execution of examples using Amplifier Foundation
  - Real-time results with markdown formatting and syntax highlighting
  - Examples across 4 tiers: Quick Start, Foundation Concepts, Building Applications, Real-World
- **Interactive Chat**: AI-powered chat using Amplifier Foundation bundles
- **Session Warmup**: Pre-initialized sessions for reduced latency
- **System Overview**: Visual architecture documentation
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Markdown Support**: Rich formatting for chat and playground responses

### Planned Features

- **Provider Selection**: Choose between Anthropic, OpenAI, and Azure providers
- **GitHub Synchronization**: Automatic updates when amplifier-foundation examples change
- **Code Customization**: Monaco editor integration for editing example code (Expert mode)
- **Comparison Mode**: Run same example with different providers side-by-side
- **User Authentication**: GitHub OAuth integration (optional)
- **Execution History**: Save and review past executions
- **Export & Share**: Download examples as Python files, share execution results

## Architecture

### Current Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────────────────┐
│  Next.js (Port 3000)    │
│  ┌──────────────────┐   │
│  │  React Frontend  │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │   API Routes     │   │
│  │  (Node.js)       │   │
│  └────┬─────────────┘   │
└───────┼─────────────────┘
        │ Child Process
        ▼
┌─────────────────────────┐
│   Python Scripts        │
│  ┌──────────────────┐   │
│  │ Amplifier Core   │   │
│  └────┬─────────────┘   │
│       │                 │
│  ┌────▼─────────────┐   │
│  │ Amplifier        │   │
│  │ Foundation       │   │
│  └────┬─────────────┘   │
└───────┼─────────────────┘
        │ API Call
        ▼
┌─────────────────────────┐
│   Anthropic API         │
│   (Claude)              │
└─────────────────────────┘
```

### Future Architecture Considerations

- Separate Python backend (FastAPI) in Azure Container App for better scalability
- PostgreSQL database for user sessions and execution history
- Session pooling for pre-warmed sessions
- Redis caching for frequently accessed examples
- Load balancing for high-traffic scenarios

## Environment Variables

Create a `.env` or `.env.local` file in the root directory:

```bash
# Required: Anthropic API key for Claude models
ANTHROPIC_API_KEY=your-anthropic-api-key-here
ANTHROPIC_BASE_URL=your-base-url-here
# Optional: Alternative AI providers
# OPENAI_API_KEY=your-openai-api-key-here
# AZURE_OPENAI_API_KEY=your-azure-key-here
# AZURE_OPENAI_ENDPOINT=your-azure-endpoint-here
```

Get your Anthropic API key from: https://console.anthropic.com/

## Getting Started

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

Quick setup:

```bash
# Install dependencies
npm install
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Start development server
npm run dev
```

Visit http://localhost:3000

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Development Workflow

### Branch Structure
- **main**: Production-ready code
- **feature/***: Feature branches for development
- Current: `feature/phase-1-implementation`

### Making Changes

1. Create a feature branch from `main`
2. Make your changes following TypeScript and React best practices
3. Test locally with `npm run dev`
4. Build and verify with `npm run build`
5. Submit a pull request

### Code Style

- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Styling**: Tailwind utility classes (avoid inline styles)
- **Formatting**: Follow existing patterns in codebase

## Chat Implementation Details

The chat system uses a hybrid approach:

1. **Frontend** (`components/ChatWindow.tsx`):
   - React component with message state management
   - Markdown rendering for AI responses
   - Error handling with user-friendly messages

2. **API Route** (`app/api/chat/route.ts`):
   - POST endpoint accepting message and sessionId
   - Executes Python script via Node.js child_process
   - 30-second timeout with 1MB buffer
   - Returns JSON response

3. **Python Backend** (`lib/amplifier-chat.py`):
   - Loads Amplifier Foundation bundle
   - Creates async session with specified provider
   - Executes user message through Amplifier Core
   - Returns structured JSON response

### Fallback Mode

If Python dependencies are not installed, the chat operates in fallback mode with pre-programmed responses. This ensures the application remains functional during setup or if API keys are unavailable.

## Playground Implementation Details

The playground allows users to explore and execute amplifier-foundation examples:

1. **Frontend** (`app/playground/page.tsx`):
   - Example browser with filtering and search
   - Multi-mode viewer (Simple, Explorer, Developer, Expert)
   - Execution panel for results
   - Real-time execution status

2. **Components** (`components/playground/`):
   - `ExampleBrowser.tsx`: Browse, filter, and search examples
   - `ExampleViewer.tsx`: Display example details with mode switching
   - `ExecutionPanel.tsx`: Show execution results and status

3. **API Routes**:
   - `app/api/playground/examples/route.ts`: Returns all example metadata
   - `app/api/playground/examples/[id]/route.ts`: Returns specific example details
   - `app/api/playground/execute/route.ts`: Executes examples with inputs

4. **Python Backend** (`lib/run-example.py`):
   - Loads and executes amplifier-foundation examples
   - Manages session pooling for performance
   - Supports custom inputs per example
   - Returns structured output with metadata and error handling
   - Currently supports: Hello World, Custom Configuration, Meeting Notes

### Using run-example.py

The `run-example.py` script can be used directly for testing or integration:

```bash
# Execute an example with JSON input via stdin
cd lib
echo '{"exampleId":"01_hello_world","inputs":{},"mode":"normie"}' | python run-example.py

# Or pass JSON as command-line argument for manual testing
python run-example.py '{"exampleId":"01_hello_world","inputs":{"prompt":"Write a function to calculate fibonacci"},"mode":"developer"}'
```

**Input format:**
```json
{
  "exampleId": "01_hello_world",
  "inputs": {
    "prompt": "Custom prompt here (optional)"
  },
  "mode": "normie|explorer|developer|expert"
}
```

**Output format:**
```json
{
  "output": "AI-generated response text",
  "metadata": {
    "example_id": "01_hello_world",
    "mode": "normie",
    "...": "additional metadata"
  }
}
```

**Error format:**
```json
{
  "error": "Error description",
  "details": "Detailed error message",
  "traceback": "Python traceback (if applicable)"
}
```

**Supported examples:**
- `01_hello_world` - Basic Amplifier execution with customizable prompts
- `02_custom_configuration` - Demonstrates tool composition and configuration
- `10_meeting_notes` - Extracts structured action items from meeting notes

**View modes:**
- `normie` - Simple, high-level view for beginners
- `explorer` - More detailed explanations for learning
- `developer` - Code-level details for implementation
- `expert` - Full technical details and internals

## Deployment

### Current Deployment Target

- **Platform**: Azure Static Web Apps (transitioning to Container Apps)
- **Frontend**: Next.js build
- **Backend**: Python scripts bundled with frontend (temporary)

### Future Deployment (Phase 1)

- **Frontend**: Azure Static Web Apps or Container App
- **Backend**: Separate Azure Container App (Python FastAPI)
- **Database**: Azure Database for PostgreSQL
- **CDN**: Azure Front Door (optional)

## Troubleshooting

### Chat Not Working

1. Check that Python dependencies are installed: `pip list | grep amplifier`
2. Verify `.env` file exists with valid `ANTHROPIC_API_KEY`
3. Check browser console for JavaScript errors
4. Check terminal logs for Python errors

### Build Failures

1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `npm ci`
3. Verify Node.js version: `node --version` (should be 18+)
4. Check TypeScript errors: `npx tsc --noEmit`

### Python Import Errors

```bash
# Reinstall Python dependencies
pip install -r requirements.txt --force-reinstall

# Verify installation
pip list | grep amplifier
```

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Test thoroughly
5. Submit a pull request

## Roadmap

### Current Focus
- Expand playground examples (currently 3, target 20+)
- Add WebSocket streaming for real-time execution logs
- Improve example viewer with code editing capabilities
- Add user authentication for saved sessions
- Expand mobile responsive design

### Future Plans
- Recipe builder for custom workflows
- Execution history and analytics
- Community-contributed examples
- Advanced debugging tools
- Performance optimizations

## Documentation

- [Quick Start Guide](./QUICKSTART.md) - Get started in 5 minutes
- [Setup Guide](./SETUP.md) - Chat-specific setup instructions (if exists)
- [Playground Documentation](./app/playground/PLAYGROUND_PLAN.md) - Playground architecture and design

## License

[Your License Here]

## Support

- **Issues**: [GitHub Issues](https://github.com/your-org/amplifier-onboarding/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/amplifier-onboarding/discussions)
- **Documentation**: [Amplifier Docs](https://docs.amplifier.dev) (when available)

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Anthropic Claude](https://www.anthropic.com/) - AI provider
- [Amplifier Core](https://github.com/your-org/amplifier-core) - AI framework

---

**Status**: Active Development
**Version**: 0.2.0
**Last Updated**: 2026-01-07
