# Amplifier Onboarding

A modern web application for onboarding new users to Amplifier - an AI-powered development assistant platform that enables developers to build sophisticated AI workflows using declarative configuration.

## Overview

Amplifier Onboarding is a Next.js-based web application that introduces users to the Amplifier ecosystem through:

- **Marketing Landing Pages**: Comprehensive elevator pitch and value proposition
- **Interactive Chat**: Real-time AI-powered chat using Amplifier Core and Foundation
- **System Architecture Visualization**: Clear overview of how Amplifier components work together
- **Future Features**: Recipe gallery, interactive playground, and execution viewer (planned)

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
│   │   └── chat/                 # Chat endpoints
│   │       ├── route.ts          # Main chat API
│   │       └── warmup/route.ts   # Session warmup
│   ├── elevator-pitch/           # Landing page
│   ├── system-overview/          # Architecture page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
│
├── components/                   # React components
│   ├── Header.tsx               # Navigation header
│   ├── Footer.tsx               # Site footer
│   ├── Layout.tsx               # Layout wrapper
│   └── ChatWindow.tsx           # Chat modal
│
├── lib/                          # Backend Python scripts
│   ├── amplifier-chat.py        # Chat execution
│   ├── amplifier-warmup.py      # Session warmup
│   └── amplifier_config_files/  # Configuration files
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

### Current Implementation (Phase 0)

- **Landing Page**: Comprehensive value proposition and product overview
- **System Overview**: Visual architecture documentation
- **Interactive Chat**: AI-powered chat using Amplifier Foundation bundles
- **Session Warmup**: Pre-initialized sessions for reduced latency
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Markdown Support**: Rich formatting for chat responses

### Planned Features (Phase 1+)

- **Recipe Gallery**: Browse and explore pre-built Amplifier recipes
- **Interactive Playground**: Execute and modify recipes in real-time
- **Execution Viewer**: Real-time WebSocket streaming of execution logs
- **User Authentication**: GitHub OAuth integration
- **Mode Selector**: Normie, Explorer, Developer, and Expert modes
- **Rate Limiting**: Fair usage policies for shared resources

## Architecture

### Current Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────────────────┐
│  Next.js (Port 3001)    │
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

### Planned Architecture (Phase 1+)

- Separate Python backend (FastAPI) in Azure Container App
- WebSocket streaming for real-time updates
- PostgreSQL database for user sessions and execution history
- Session pooling for pre-warmed sessions
- Redis caching (optional)

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

Visit http://localhost:3001

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3001 |
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

See [.planning/PHASE_1_MVP.md](./.planning/PHASE_1_MVP.md) for detailed roadmap.

### Phase 1 (Current)
- Gallery API and UI
- WebSocket streaming
- Execution viewer
- 5+ showcase bundles
- Mobile responsive design
- Beta testing program

### Phase 2 (Planned)
- User authentication
- Recipe builder
- Saved sessions
- Analytics dashboard

## Documentation

- [Setup Guide](./SETUP.md) - Chat-specific setup instructions
- [Phase 1 Plan](./.planning/PHASE_1_MVP.md) - Detailed implementation plan
- [Technical Architecture](./.docs/TECHNICAL_ARCHITECTURE.md) - System design (if exists)

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

**Status**: Phase 1 Development (Active)
**Version**: 0.1.0
**Last Updated**: 2026-01-06
