# Amplifier Onboarding

A modern web application for onboarding new users to Amplifier - an AI-powered development assistant platform that enables developers to build sophisticated AI workflows using declarative configuration.

## Overview

Amplifier Onboarding is a Next.js-based web application that introduces users to the Amplifier ecosystem through:

- **Marketing Landing Pages**: Comprehensive elevator pitch and value proposition
- **Interactive Playground**: Browse and execute customizable Amplifier bundles with real-time streaming
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

### Telemetry & Analytics
- **Analytics Platform**: Azure Application Insights
- **Development Tools**: JSONL event logger with export capabilities
- **Privacy**: DNT support, consent checking, PII sanitization

## Project Structure

```
amplifier-onboarding/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── chat/                 # Chat endpoints
│   │   │   ├── route.ts          # Main chat API
│   │   │   └── warmup/route.ts   # Session warmup
│   │   └── playground/           # Playground endpoints
│   │       ├── bundle-yaml/      # Bundle YAML retrieval
│   │       ├── execute-bundle/   # Bundle execution
│   │       └── execute-bundle-stream/ # Streaming bundle execution (SSE)
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
│   ├── run-bundle.py            # Bundle execution
│   ├── run-bundle-stream.py     # Streaming bundle execution
│   ├── validate-deps.py         # Dependency validation script
│   ├── bundle-metadata.json     # Bundle descriptions
│   └── bundles/                 # Amplifier bundle configurations
│       ├── 00-basic-bundle.yaml              # Basic AI agent
│       ├── 01-chat-bundle.yaml               # Chat bundle (dual purpose)
│       ├── 02-documentation-bundle.yaml      # Documentation creator
│       ├── 03-developer-bundle.yaml          # Full-stack developer
│       ├── 04-code-reviewer-bundle.yaml      # Code reviewer
│       └── 05-presentation-creator-bundle.yaml # Presentation creator
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
- **Interactive Playground**: Browse and execute customizable Amplifier bundles
  - 6 pre-configured bundles showcasing different AI agent capabilities
  - Bundle browser with tier-based organization (beginner, intermediate, advanced)
  - **Real-time streaming execution** with SSE (Server-Sent Events)
  - Live YAML configuration viewer for each bundle
  - Suggested prompts for each bundle to get started quickly
  - Real-time results with markdown formatting and syntax highlighting
  - Bundles include: Basic AI, Chat AI, Documentation Creator, Developer Assistant, Code Reviewer, Presentation Creator
- **Interactive Chat**: AI-powered chat using Amplifier Foundation bundles
- **Session Warmup**: Pre-initialized sessions for reduced latency
- **System Overview**: Visual architecture documentation
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Markdown Support**: Rich formatting for chat and playground responses
- **Telemetry & Analytics**: Comprehensive user behavior tracking
  - Universal click tracking on interactive elements
  - Playground execution tracking (bundles, recipes, timing, success rates)
  - Chat interaction tracking
  - Privacy-first design with opt-out support
  - Development logger for immediate testing feedback

### Planned Features

- **Custom Bundle Editor**: Monaco editor integration for creating and editing bundle YAML configurations
- **Provider Selection**: Choose between Anthropic, OpenAI, and Azure providers within bundles
- **GitHub Synchronization**: Automatic updates when amplifier-foundation bundles change
- **Comparison Mode**: Run same prompt with different bundles side-by-side
- **User Authentication**: GitHub OAuth integration (optional)
- **Execution History**: Save and review past bundle executions
- **Export & Share**: Download bundles as YAML files, share execution results
- **Community Bundles**: User-contributed bundle library

## Architecture

### Current Architecture

The application now uses a hybrid architecture with both direct library access (for bundles/recipes) and REST API calls (for chat):

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
│  │ API Client       │───────┐
│  │ (Chat)           │       │ HTTPS
│  └──────────────────┘       │
│  ┌──────────────────┐       ▼
│  │ Amplifier Core   │   ┌─────────────────────┐
│  │ (Bundles/        │   │  Amplifier API      │
│  │  Recipes)        │   │  Service            │
│  └────┬─────────────┘   └──────┬──────────────┘
│       │                         │
│  ┌────▼─────────────┐          │
│  │ Amplifier        │          │
│  │ Foundation       │          │
│  └────┬─────────────┘          │
└───────┼────────────────────────┘
        │ API Call
        ▼
┌─────────────────────────┐
│   Anthropic API         │
│   (Claude)              │
└─────────────────────────┘
```

**Chat Flow:** Frontend → Next.js API → Python → **Amplifier API Service** → Claude
**Bundle/Recipe Flow:** Frontend → Next.js API → Python → Amplifier Libraries → Claude

### API Migration

The chat functionality has been migrated to use the Amplifier REST API service instead of direct library imports. This provides:

- **Centralized config management** - Configs stored in API, filtered by user
- **Long-lived sessions** - Sessions persist across multiple messages
- **JWT-based authentication** - User-level auth with automatic filtering
- **Environment variable substitution** - API keys injected from environment
- **Session reuse** - Frontend maintains session_id for conversation continuity

For details, see:
- [User Identity Flow](./USER_IDENTITY_FLOW.md) - How user authentication works
- [Docker Optimization Guide](./DOCKER_OPTIMIZATION_GUIDE.md) - Build performance tips

### Future Architecture Considerations

- Separate Python backend (FastAPI) in Azure Container App for better scalability
- PostgreSQL database for user sessions and execution history
- Session pooling for pre-warmed sessions
- Redis caching for frequently accessed examples
- Load balancing for high-traffic scenarios

## Environment Variables

Create a `.env` file in the root directory (see `.env.example` for template):

```bash
# Anthropic API key (required for bundles/recipes and config creation)
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Amplifier API Configuration (for chat)
AMPLIFIER_USE_API=true
AMPLIFIER_API_URL=http://localhost:8765  # or production URL
AMPLIFIER_API_KEY=your-amplifier-api-key
AMPLIFIER_APP_ID=your-app-id
AMPLIFIER_API_TIMEOUT=60000

# Optional: Alternative AI providers
# OPENAI_API_KEY=your-openai-api-key-here
# AZURE_OPENAI_API_KEY=your-azure-key-here
# AZURE_OPENAI_ENDPOINT=your-azure-endpoint-here

# Telemetry (optional)
NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING=your-connection-string
```

**Note:** The `ANTHROPIC_API_KEY` is used both for direct bundle/recipe execution AND is injected into configs when created via the API (using `${ANTHROPIC_API_KEY}` substitution in bundle JSON files).

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
- Current: `feature/revised-playground-page`

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

3. **Python Backend** (`lib/amplifier/python/amplifier-chat.py`):
   - Loads Amplifier Foundation bundle
   - Creates async session with specified provider
   - Executes user message through Amplifier Core
   - Returns structured JSON response

### Fallback Mode

If Python dependencies are not installed, the chat operates in fallback mode with pre-programmed responses. This ensures the application remains functional during setup or if API keys are unavailable.

## Playground Implementation Details

The playground allows users to explore and execute customizable Amplifier bundles:

1. **Frontend** (`app/playground/page.tsx`):
   - Bundle browser with tier-based organization
   - Live YAML configuration viewer
   - Suggested prompts for quick start
   - Real-time streaming execution panel
   - Collapsible YAML viewer for better UX

2. **API Routes**:
   - `app/api/playground/bundle-yaml/route.ts`: Returns bundle YAML content
   - `app/api/playground/execute-bundle/route.ts`: Executes bundles with prompts (non-streaming)
   - `app/api/playground/execute-bundle-stream/route.ts`: Executes bundles with real-time SSE streaming

3. **Python Backend**:
   - `lib/amplifier/python/run-bundle.py`: Loads and executes Amplifier bundles
   - `lib/amplifier/python/run-bundle-stream.py`: Streaming version with real-time output
   - Reads bundle configurations from `lib/amplifier/bundles/*.yaml`
   - Returns structured JSON output with results and metadata

4. **Bundle Metadata** (`lib/amplifier/bundle-metadata.json`):
   - Describes each available bundle
   - Includes: name, description, features, suggested prompts, tier
   - Used by frontend to render bundle cards and information

### Available Bundles

1. **Basic Bundle** (`00-basic-bundle.yaml`) - Beginner
   - Minimal AI agent with Claude Sonnet 4.5
   - No special tools, perfect for simple conversations
   - Use case: General Q&A, simple tasks

2. **Chat Bundle** (`01-chat-bundle.yaml`) - Beginner
   - Similar to Basic Bundle but with grounding context files
   - Powers the site-wide "Got Questions?" chat feature
   - Also available in playground for exploration
   - Use case: Learning about Amplifier, asking questions

3. **Documentation Bundle** (`02-documentation-bundle.yaml`) - Intermediate
   - Filesystem access + web search capabilities
   - Creates READMEs, API docs, user guides
   - Use case: Technical writing, documentation generation

4. **Developer Bundle** (`03-developer-bundle.yaml`) - Intermediate
   - Filesystem, bash, web search, grep tools
   - Full-stack development capabilities
   - Use case: Code creation, debugging, testing

5. **Code Reviewer Bundle** (`04-code-reviewer-bundle.yaml`) - Advanced
   - Claude Opus 4.5 for deep analysis
   - Read-only filesystem access
   - Focus on security, quality, best practices
   - Use case: Code review, vulnerability scanning

6. **Presentation Creator Bundle** (`05-presentation-creator-bundle.yaml`) - Advanced
   - Streaming orchestrator for real-time output
   - Filesystem + web research capabilities
   - Use case: Creating presentation content, slide decks

### Using run-bundle.py

The `run-bundle.py` script can be used directly for testing or integration:

```bash
# Execute a bundle with JSON input via stdin
cd lib
echo '{"bundleId":"00-basic-bundle","bundlePath":"00-basic-bundle.yaml","prompt":"Explain quantum computing"}' | python run-bundle.py
```

**Input format:**
```json
{
  "bundleId": "00-basic-bundle",
  "bundlePath": "00-basic-bundle.yaml",
  "prompt": "Your prompt here"
}
```

**Output format:**
```json
{
  "output": "AI-generated response text",
  "bundleId": "00-basic-bundle",
  "timestamp": "2026-01-09T12:34:56.789Z"
}
```

**Error format:**
```json
{
  "error": "Error description",
  "traceback": "Python traceback (if applicable)",
  "timestamp": "2026-01-09T12:34:56.789Z"
}
```

### Using run-bundle-stream.py

For real-time streaming execution:

```bash
# Execute with streaming output
echo '{"bundleId":"05-presentation-creator-bundle","bundlePath":"05-presentation-creator-bundle.yaml","prompt":"Create a tech presentation"}' | python run-bundle-stream.py
```

Outputs Server-Sent Events (SSE) format with real-time status updates and results.

## Deployment

### Docker Deployment

The application includes a complete Docker setup for containerized deployment:

**Dockerfile Features:**
- Base: Node 20 (bookworm-slim)
- Installs Python 3, pip, git, and build-essential
- Uses UV package manager for faster Python dependency installation
- Validates dependencies with `validate-deps.py` before build
- Builds optimized Next.js production bundle
- Exposes port 3000

**Docker Compose:**
- Single-service setup with health checks
- Volume mount for development (`./lib:/app/lib`)
- Auto-restart unless stopped
- HTTP health check endpoint: `/api/chat`

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or with Docker directly
docker build -t amplifier-onboarding .
docker run -p 3000:3000 --env-file .env amplifier-onboarding
```

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

## Telemetry & Analytics

The application includes comprehensive telemetry tracking powered by Azure Application Insights for understanding user behavior and improving the product.

### What's Tracked

- **User Interactions**: Clicks on buttons, links, and interactive elements
- **Chat Usage**: Message sends, responses, errors, session duration
- **Playground Activity**: Bundle/recipe selections, executions, timing, success rates
- **Navigation**: Page views, route changes, dropdown interactions
- **Performance**: Response times, execution duration, error rates

### Privacy & Control

- **Privacy-First Design**: No PII collection, password/email sanitization
- **Do Not Track (DNT) Support**: Respects browser DNT settings
- **Opt-Out**: Elements with `data-track="false"` are not tracked
- **Anonymous IDs**: Session-based tracking without personal identification

### Development Mode

For developers testing telemetry locally, see [TELEMETRY_DEVELOPMENT_GUIDE.md](./.docs/TELEMETRY_DEVELOPMENT_GUIDE.md) for:
- Using the debug mode for console logging
- Exporting events to JSONL files
- Testing without waiting for Azure ingestion

### Documentation

- [Telemetry Implementation Summary](./.docs/TELEMETRY_IMPLEMENTATION_SUMMARY.md) - Complete implementation details
- [Telemetry Development Guide](./.docs/TELEMETRY_DEVELOPMENT_GUIDE.md) - Developer testing guide

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Test thoroughly
5. Submit a pull request

## Roadmap

### Recent Accomplishments (Phase 3)
- Migrated from examples to bundle-based architecture
- Implemented real-time streaming execution with SSE
- Added 5 pre-configured bundles showcasing different capabilities
- Enhanced playground UI with collapsible YAML viewer
- Added bundle metadata system for better organization

### Current Focus
- Custom bundle editor with Monaco integration
- Expand bundle library with more specialized configurations
- Add bundle comparison mode
- Implement execution history and analytics
- Add user authentication for saved sessions

### Future Plans
- Community bundle marketplace
- Bundle composition and inheritance
- Advanced debugging tools
- Performance optimizations
- Multi-provider support within bundles

## Documentation

### Getting Started
- [Quick Start Guide](./QUICKSTART.md) - Get started in 5 minutes
- [API Getting Started](./API_GETTING_STARTED.md) - Start using the API with practical examples

### API Documentation
- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference with examples
- [API Overview](./API_DOCUMENTATION_OVERVIEW.md) - High-level API architecture overview
- [API Quick Reference](./API_QUICK_REFERENCE.md) - Quick lookup for endpoints and formats
- [Documentation Index](./DOCUMENTATION_INDEX.md) - Complete documentation navigation

### Configuration & Bundles
- [Bundle Metadata](./lib/amplifier/bundle-metadata.json) - Available bundles and their capabilities
- Bundle configurations in `lib/amplifier/bundles/` - YAML files defining each agent

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
**Version**: 0.3.0
**Last Updated**: 2026-01-09
