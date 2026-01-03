# Amplifier Onboarding

> Transform how developers think about AI application development

**Live Site**: [https://amplifier-onboarding.azurestaticapps.net](https://amplifier-onboarding.azurestaticapps.net)

A web experience that showcases Amplifier's capabilities through interactive demos, tutorials, and a recipe gallery. Users can experience pre-configured AI workflows and learn to build their own.

---

## 🚀 Quick Start

### View the Site

**Live on Azure**: https://icy-wave-001fa3d0f.1.azurestaticapps.net/

### Run Frontend Locally

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/amplifier-onboarding.git
cd amplifier-onboarding

# 2. Start development server
npm run dev

# 3. Open http://localhost:3000
```

**That's it!** No build step, no dependencies to install. Pure static site.

### Run Backend Locally (Optional - Phase 0 skeleton only)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the server
uvicorn app.main:app --reload

# 4. Test health check
curl http://localhost:8000/health

# 5. View API docs
# Open http://localhost:8000/api/docs
```

**Note**: Backend is a minimal skeleton in Phase 0. Recipe execution coming in Phase 1.

---

## 📂 What's Here

### Live Features (Phase 0 - In Progress)

- ✅ **Landing Page** - Professional homepage with navigation
- ✅ **Recipe Gallery** - Browse 5 showcase recipes with filtering and search
- ✅ **Design System** - Documented color palette, typography, components
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Azure Deployment** - Auto-deploys from main branch

### Coming Soon (Phase 1+)

- ⏳ **Recipe Execution** - Run recipes in sandboxed environment
- ⏳ **Real-time Viewer** - Watch AI agents execute step-by-step
- ⏳ **Interactive Tutorials** - Learn by doing
- ⏳ **Visual Builder** - Drag-and-drop recipe creation
- ⏳ **Community Gallery** - Share and discover recipes

---

## 🎯 Current Progress

**Phase 0: Foundation** (Weeks 1-2) - 28% Complete

- ✅ Day 1: Enhanced landing page, CSS architecture, navigation, design system
- ✅ Day 2: Component library, recipe gallery, filtering & search
- 🔄 Day 3: Dev server, build pipeline, documentation ← IN PROGRESS
- ⏳ Day 4: Recipe metadata, detailed content
- ⏳ Day 5: Testing framework, accessibility audit
- ⏳ Days 6-10: Backend, authentication, deployment automation

See [execution_plans/EXECUTION_PLAN_PHASE_0.md](./execution_plans/EXECUTION_PLAN_PHASE_0.md) for detailed breakdown.

---

## 🏗️ Architecture

### Current (Phase 0): Static Frontend + Backend Skeleton

```
┌─────────────────────────────────────┐
│ Frontend (Azure Static Web Apps)   │
│ - HTML, CSS, JavaScript             │
│ - Recipe gallery with 5 recipes     │
│ - Interactive filtering & search    │
│ - Auto-deploy from GitHub           │
│                                     │
│ Live: amplifier-onboarding.         │
│       azurestaticapps.net           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Backend (Local Only - Phase 0)      │
│ - FastAPI skeleton                  │
│ - Health check endpoint             │
│ - CORS configured                   │
│ - Dockerfile ready                  │
│                                     │
│ Status: Ready for Phase 1 deploy   │
└─────────────────────────────────────┘
```

### Future (Phase 1): Add Live Recipe Execution

```
Frontend (Static Web Apps)
    ↓ HTTP/WebSocket
Backend (Azure Container Apps)
    ↓ Sandboxed execution
Amplifier Core
```

### Future (Phase 2+): Add Authentication & Community

```
Frontend → Backend → Database (PostgreSQL)
                  ↓  Redis Cache
                  ↓  OAuth (GitHub)
```

See [docs/06_TECHNICAL_ARCHITECTURE.md](./docs/06_TECHNICAL_ARCHITECTURE.md) for full architecture.

---

## 📋 Documentation

### For Users
- **[Recipe Catalog](./docs/03_RECIPE_CATALOG.md)** - 18+ planned recipes
- **[User Journey](./docs/01_USER_JOURNEY.md)** - Personas and transformation paths

### For Developers
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute
- **[Design System](./docs/DESIGN_SYSTEM.md)** - Colors, typography, components
- **[Execution Plan](./execution_plans/EXECUTION_PLAN_PHASE_0.md)** - Implementation roadmap
- **[Azure Deployment](./execution_plans/AZURE_STATIC_WEB_APPS.md)** - Deployment guide

### For Stakeholders
- **[Executive Summary](./docs/00_EXECUTIVE_SUMMARY.md)** - Vision and approach
- **[Roadmap](./docs/07_ROADMAP.md)** - 6-month timeline
- **[Content Strategy](./docs/05_CONTENT_STRATEGY.md)** - Messaging and content plan

---

## 🛠️ Technology Stack

**Current (Phase 0)**:
- Pure HTML5, CSS3, JavaScript (ES6+)
- No framework, no build step (for simplicity)
- Azure Static Web Apps (hosting)

**Future (Phase 1+)**:
- Frontend: Next.js + React (when complexity justifies it)
- Backend: FastAPI (Python)
- Database: PostgreSQL (Azure or Supabase)
- Cache: Redis (Upstash or Azure)

**Philosophy**: Start simple, add complexity only when needed.

---

## 📊 Success Metrics

**Phase 0 Goals** (End of Week 2):
- ✅ Live site on Azure with auto-deploy
- ✅ Recipe gallery with 5 showcase recipes
- ⏳ Component library and design system
- ⏳ Development environment documented
- ⏳ Test suite with >80% coverage

**Launch Goals** (Week 27):
- 10,000 site visits
- 1,000 recipe executions
- 100 custom recipes created
- Top 5 on Product Hunt

---

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Local setup instructions
- Code style guide
- Development workflow
- How to submit changes

### Quick Contribution Guide

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Make changes and test locally: `npm run dev`
4. Commit with clear message
5. Push and create Pull Request

---

## 🚢 Deployment

**Automatic Deployment**:
- Push to `main` → Auto-deploys to Azure production
- Open Pull Request → Creates preview environment
- Merge PR → Deploys to production + removes preview

**Manual Deployment**:
See [execution_plans/AZURE_STATIC_WEB_APPS.md](./execution_plans/AZURE_STATIC_WEB_APPS.md) for Azure CLI commands.

---

## 🗺️ Roadmap

**6 months from kickoff to full launch**

- **Weeks 1-2**: Foundation (design system, structure, gallery) ← NOW
- **Weeks 3-6**: MVP - Recipe playground with execution
- **Weeks 7-10**: Learning hub with tutorials
- **Weeks 11-14**: Visual recipe builder
- **Weeks 15-18**: Community gallery
- **Weeks 19-22**: Advanced builders (agents, bundles, modules)
- **Weeks 23-26**: Scale & polish
- **Week 27**: Launch!

See [docs/07_ROADMAP.md](./docs/07_ROADMAP.md) for detailed roadmap.

---

## 📞 Contact

- **GitHub**: https://github.com/microsoft/amplifier
- **Issues**: https://github.com/yourusername/amplifier-onboarding/issues
- **Discussions**: https://github.com/yourusername/amplifier-onboarding/discussions

---

## 📄 License

MIT License - See LICENSE file for details

This project is part of the [Amplifier](https://github.com/microsoft/amplifier) ecosystem.

---

**Built with ❤️ by Microsoft | Powered by Azure Static Web Apps**
