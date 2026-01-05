# Amplifier Web Experience

Transform how people think about AI development through hands-on experience.

## Overview

Amplifier enables developers to build AI applications through composable, modular, declarative workflows. This web experience demonstrates the power of Amplifier through:

- **One-Pager**: Quick introduction and value proposition
- **Crash Course**: Interactive learning with tutorials
- **Playground**: Run, create, and share recipes and bundles
- **Resources**: Documentation and GitHub links

## Project Structure

```
amplifier-onboarding/
├── frontend/              # Next.js 14 frontend
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   └── lib/          # Utilities and hooks
│   └── public/           # Static assets
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Configuration
│   │   ├── services/    # Business logic
│   │   └── main.py      # FastAPI app
│   └── tests/           # Backend tests
├── .docs/               # Documentation
├── .planning/           # Implementation phases
└── docker-compose.yml   # Local development
```

## Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker and Docker Compose
- GitHub account (for authentication)
- OAuth credentials (get from team - see SETUP_OAUTH.md)

### Local Development

1. **Start infrastructure:**
```bash
docker-compose up -d postgres
```

2. **Run backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Edit with your config
uvicorn app.main:app --reload
```

Backend runs at http://localhost:8000

3. **Run frontend:**
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:3000

## Implementation Phases

We're building this in 5 phases over 12 weeks:

- **Phase 0** (Weeks 1-2): Foundation - Infrastructure and core architecture ✓
- **Phase 1** (Weeks 3-4): MVP - Gallery and execution engine
- **Phase 2** (Weeks 5-7): Learn + Create - Tutorials and recipe builder
- **Phase 3** (Weeks 8-10): Expert Features - Skill creator and community
- **Phase 4** (Weeks 11-12): Launch - Polish and public launch

See [.planning/](./.planning/) for detailed phase plans.

## Documentation

- [Executive Summary](./.docs/EXECUTIVE_SUMMARY.md) - Vision and strategy
- [Audiences](./.docs/AUDIENCES.md) - User modes and personalization
- [Information Architecture](./.docs/INFORMATION_ARCHITECTURE.md) - Site structure
- [Technical Architecture](./.docs/TECHNICAL_ARCHITECTURE.md) - System design
- [Implementation Roadmap](./.docs/IMPLEMENTATION_ROADMAP.md) - Detailed plan

## Mode-Based Experience

Amplifier serves 4 distinct audiences:

- **Normie Mode**: Run pre-built recipes (non-technical users)
- **Explorer Mode**: Run and configure (technical non-developers)
- **Developer Mode**: Create recipes and bundles (software developers)
- **Expert Mode**: Full platform access including custom skills (power users)

## Technology Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Monaco Editor
- React Flow

### Backend
- FastAPI
- Python 3.11+
- PostgreSQL
- Azure Container Apps
- Application Insights

### Infrastructure
- Azure Static Web Apps (frontend)
- Azure Container Apps (backend)
- Azure Database for PostgreSQL
- Azure Application Insights

## Current Status

**Branch:** feature/phase-1-implementation
**Phase:** Phase 0 (Foundation)
**Status:** Setting up basic file structure

## Contributing

This is an internal Microsoft project. For questions or contributions, contact the Amplifier team.

## License

Copyright (c) Microsoft Corporation. All rights reserved.
