# Amplifier Onboarding - Architecture

**Current Version**: 0.1.0 (Phase 0 Complete)  
**Last Updated**: 2026-01-03

---

## Overview

Amplifier Onboarding is a progressive web experience that showcases the Amplifier platform through:
- Interactive recipe gallery
- Detailed documentation
- Component library
- Future: Live recipe execution and tutorials

**Design Philosophy**: Start simple, add complexity only when needed.

---

## Phase 0: Static Showcase (Current) ✅

### Architecture Diagram

```
┌────────────────────────────────────────────────────┐
│ Developer / User                                   │
└────────────────┬───────────────────────────────────┘
                 │
                 │ HTTPS
                 ↓
┌────────────────────────────────────────────────────┐
│ Azure Static Web Apps                              │
│ ┌────────────────────────────────────────────────┐ │
│ │ Static Assets (Global CDN)                     │ │
│ │ - HTML pages (index, playground, learn, docs)  │ │
│ │ - CSS (styles/main.css with design tokens)     │ │
│ │ - JavaScript (recipes.js for filtering/search) │ │
│ │ - JSON data (recipes-showcase.json)            │ │
│ │ - Images, fonts, icons                         │ │
│ └────────────────────────────────────────────────┘ │
│                                                     │
│ Features:                                          │
│ - Auto-deploy from GitHub (main branch)           │
│ - Free SSL certificate                            │
│ - Global CDN distribution                         │
│ - PR preview environments                         │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ Backend (Local Only - Not Deployed)                │
│ - FastAPI skeleton                                 │
│ - Health check endpoint                            │
│ - Ready for Phase 1 deployment                     │
└────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend**:
- Pure HTML5, CSS3, JavaScript (ES6+)
- No framework, no build step
- CSS variables for theming
- Vanilla JS for interactivity

**Hosting**:
- Azure Static Web Apps (Free tier)
- Auto-deploy via GitHub Actions
- Global CDN included
- Free SSL certificate

**Backend (Skeleton Only)**:
- FastAPI (Python 3.11+)
- Ready for containerization
- Not deployed in Phase 0

**Development**:
- http-server for local development
- Playwright for testing
- Git for version control

---

## Phase 1: Add Demos & Tutorials (Planned)

### Architecture Additions

**No backend deployment yet!** Instead:

```
Frontend (Static Web Apps)
    ↓
Add to existing site:
- Execution video players
- Static execution examples
- Interactive tutorials (client-side)
- Visual recipe builder mockup (client-side YAML generation)
```

**Still fully public, no authentication.**

### What Gets Added

**Content**:
- Pre-recorded execution videos (30-60 seconds each)
- Static before/after examples
- Interactive tutorials with local state
- Visual builder that generates YAML for download

**Technologies**:
- Video hosting (Azure Storage or YouTube embeds)
- Client-side YAML generation (js-yaml library)
- Local storage for tutorial progress
- Still no backend API needed

---

## Phase 2: Add Live Execution Engine (Future)

### When to Build This

**Triggers for Phase 2**:
- User demand for live execution (vs videos)
- Want to gather execution analytics
- Need to prevent abuse (rate limiting)
- Ready to invest in infrastructure

### Architecture (Phase 2)

```
┌────────────────────────────────────┐
│ Frontend (Static Web Apps)         │
│ - Browse recipes (public)           │
│ - View demos (public)               │
│ - Execute recipes (auth required)  │
└──────────┬─────────────────────────┘
           │
           │ HTTPS/WebSocket
           ↓
┌────────────────────────────────────┐
│ Backend (Azure Container Apps)     │
│ - Recipe execution API              │
│ - Sandboxed execution environment  │
│ - Real-time WebSocket updates      │
│ - Rate limiting                    │
└──────┬─────────────┬───────────────┘
       │             │
       ↓             ↓
┌──────────┐  ┌──────────────┐
│PostgreSQL│  │ Redis Cache  │
│(Supabase)│  │ (Upstash)    │
└──────────┘  └──────────────┘
```

### What Gets Added (Phase 2)

**Backend**:
- Recipe execution engine (Amplifier integration)
- Sandbox management (Docker containers)
- WebSocket server for real-time updates
- Execution logging and storage

**Authentication**:
- GitHub OAuth (optional - only for execution)
- JWT tokens
- User database (id, github_id, username)

**Infrastructure**:
- Azure Container Apps (backend)
- PostgreSQL (Supabase free tier)
- Redis (Upstash free tier)

**Cost**: ~$15-30/month

---

## Phase 3: Community Features (Future)

### Architecture (Phase 3)

Adds:
- User profiles
- Custom recipe storage
- Community gallery with ratings
- Recipe forking and sharing

**Authentication**: Now required for publishing content  
**Database**: Expanded schema for community content

---

## Current State: Phase 0 Complete

### What's Live

**URL**: https://amplifier-onboarding.azurestaticapps.net

**Features**:
- ✅ Landing page with navigation
- ✅ Recipe gallery (5 recipes)
- ✅ Interactive filtering (category, difficulty)
- ✅ Search functionality
- ✅ 5 detailed recipe pages
- ✅ Component library
- ✅ Design system
- ✅ Mobile responsive
- ✅ Accessible (WCAG 2.1 AA baseline)

**Backend**:
- ✅ FastAPI skeleton created
- ✅ Dockerfile ready
- ⏸️ Not deployed (waiting for Phase 1 need)

### What's NOT Built (By Design)

- ❌ Live recipe execution (Phase 2)
- ❌ Authentication (Phase 2)
- ❌ User accounts (Phase 2)
- ❌ Database (Phase 2)
- ❌ Backend API deployment (Phase 2)

**Rationale**: Public showcase site for OSS project - no barriers to exploration!

---

## Authentication Strategy

### Your Question: "What is OAuth for?"

**Original plan**: Add OAuth in Phase 0  
**Problem**: This creates barriers on a public showcase site  
**Better approach**: Defer authentication until it's actually needed

### When Authentication IS Needed

**Phase 2+** (When you add live execution):
- Prevent abuse of execution resources
- Rate limiting per user (not just IP)
- Save execution history
- Store custom recipes
- Community features (publish, rate, comment)

### When Authentication is NOT Needed

**Phase 0-1** (Current + demos):
- Browsing recipes - **PUBLIC**
- Viewing documentation - **PUBLIC**
- Watching execution videos - **PUBLIC**
- Reading tutorials - **PUBLIC**
- Downloading YAML files - **PUBLIC**

**The whole point** is to let anyone explore Amplifier without friction!

---

## Deployment

### Current: Azure Static Web Apps

**What deploys**: Frontend only (HTML, CSS, JS, JSON)

**Deployment flow**:
```
git push origin main
    ↓
GitHub Actions triggered
    ↓
Build (npm run build:azure - just echoes message)
    ↓
Upload to Azure Storage
    ↓
Distribute via global CDN
    ↓
Live in ~2 minutes
```

**Cost**: $0/month (Free tier)

### Future: Backend Deployment (Phase 1-2)

**When needed**: When you want live recipe execution

**What deploys**: FastAPI backend to Azure Container Apps

**Deployment flow**:
```
git push origin main
    ↓
Build Docker image
    ↓
Push to Azure Container Registry
    ↓
Deploy to Container Apps
    ↓
Link to Static Web Apps
```

**Cost**: ~$15-30/month (Container Apps with scale-to-zero)

---

## Development Workflow

### Frontend Changes

1. Edit HTML/CSS/JS files
2. Test with `npm run dev`
3. Commit and push to main
4. Auto-deploys to Azure (2 min)

### Backend Changes (When Needed)

1. Edit Python files in `/backend`
2. Test with `uvicorn app.main:app --reload`
3. Test Docker build: `docker build -t amplifier-api backend/`
4. Commit and push
5. Manual deploy to Azure Container Apps (Phase 1)

---

## Testing

### Run All Tests

```bash
# Install Playwright (first time)
npm install --save-dev @playwright/test
npx playwright install

# Run tests
npm test

# Run with UI
npm run test:ui
```

### Test Suites

- `tests/homepage.spec.js` - Landing page tests
- `tests/recipe-gallery.spec.js` - Gallery filtering and search
- `tests/navigation.spec.js` - Navigation flow
- `tests/accessibility.spec.js` - Accessibility compliance
- `tests/performance.spec.js` - Performance benchmarks

---

## File Organization

### Frontend (Static Assets)
- Root directory: Pages (index.html, 404.html, etc.)
- `/styles` - CSS files
- `/scripts` - JavaScript files
- `/data` - JSON data files
- `/components` - Component examples
- `/playground`, `/learn`, `/docs` - Section pages

### Backend (Python)
- `/backend/app` - Application code
- `/backend/tests` - Backend tests (Phase 1)
- `/backend/Dockerfile` - Container definition

### Documentation
- `/docs` - Strategy and planning docs (Markdown)
- `/execution_plans` - Implementation roadmaps
- `README.md` - Project overview
- `CONTRIBUTING.md` - Developer guide
- `ARCHITECTURE.md` - This file

---

## Security Considerations

### Phase 0 (Current)

**Public site - minimal security needs**:
- ✅ HTTPS enforced (Azure Static Web Apps)
- ✅ No user data collected
- ✅ No authentication (nothing to protect)
- ✅ XSS prevention (escapeHtml in JavaScript)
- ✅ CORS configured (when backend deploys)

### Phase 1-2 (Future with Backend)

**When execution is added**:
- Sandboxed execution environment (Docker containers)
- Resource limits (CPU, memory, timeout)
- IP-based rate limiting
- Input validation (Pydantic)
- Later: User authentication (OAuth)
- Later: Per-user rate limiting

---

## Performance Targets

### Current Performance (Phase 0)

**Measured**:
- Page load time: < 1s (pure static site)
- Time to Interactive: < 1.5s
- Recipe gallery load: < 500ms (5 recipes from JSON)
- Lighthouse score: 90+ (Performance, Accessibility, Best Practices, SEO)

**Optimizations Applied**:
- CSS variables (reduce redundancy)
- Minimal JavaScript (vanilla JS, no frameworks)
- No build step overhead
- Global CDN distribution via Azure
- Defer non-critical scripts

### Future Targets (Phase 1+)

When adding execution engine:
- Recipe execution start: < 500ms
- WebSocket connection: < 100ms
- Real-time updates: < 50ms latency
- Concurrent executions: 100+

---

## Monitoring & Observability

### Phase 0 (Current)

**Client-side**:
- Console logging (scripts/performance.js)
- Web Vitals tracking (LCP, FID, CLS)
- Error logging (console.error)

**Server-side**:
- Azure Static Web Apps built-in metrics
- GitHub Actions deployment logs

### Phase 1+ (Future)

When backend deploys:
- Application Insights (Azure)
- Structured logging (Python logging)
- Request tracing
- Error tracking
- Performance monitoring

---

## Scalability

### Phase 0 (Current)

**Can handle**:
- Unlimited page views (Azure CDN)
- No compute limits (static files)
- No database load (no database)

**Bottlenecks**: None (CDN serves static files globally)

### Phase 1-2 (With Backend)

**Scale considerations**:
- Container Apps scale-to-zero (cost optimization)
- Auto-scaling based on HTTP requests
- Database connection pooling
- Redis caching for frequently accessed data
- Rate limiting to prevent abuse

---

## Cost Breakdown

### Phase 0 (Current)
- **Azure Static Web Apps**: $0/month (Free tier)
- **GitHub Actions**: $0/month (included with public repos)
- **Total**: **$0/month**

### Phase 1 (Demos Only)
- Same as Phase 0
- **Total**: **$0/month**

### Phase 2 (With Backend)
- **Azure Static Web Apps**: $0-9/month
- **Azure Container Apps**: $15-30/month (0.25 CPU, 0.5GB RAM)
- **PostgreSQL**: $0/month (Supabase free) or $25/month (Azure)
- **Redis**: $0/month (Upstash free) or $15/month (Azure)
- **Total**: **$15-80/month** depending on choices

---

## Decision Log

### Why No Backend in Phase 0?

**Decision**: Keep Phase 0 as pure static site  
**Rationale**: 
- Public showcase for OSS project
- No user data to store
- No execution capability yet
- Simpler = faster to build and deploy
- $0 cost during development

**Result**: Phase 0 built in 5 days instead of 10 days

### Why No Authentication in Phase 0-1?

**Decision**: Defer OAuth until Phase 2  
**Rationale**:
- Site is public showcase/marketing
- Creates barriers to exploration
- No protected resources yet
- No user-generated content yet

**Result**: Anyone can browse and learn without friction

### Why Azure Static Web Apps?

**Decision**: Use Static Web Apps instead of Storage + Front Door  
**Rationale**:
- Purpose-built for static sites
- Free tier during development
- Auto-deploy from GitHub
- Easy backend integration later
- $35/month cheaper than Front Door

**Result**: 10-minute setup vs 3-hour setup, $0 vs $35/month

---

## Migration Paths

### Phase 0 → Phase 1 (No Breaking Changes)

**Adding**:
- Video embeds to recipe pages
- Static execution examples
- Client-side tutorials

**Not changing**:
- Existing URLs (all stay the same)
- Design system
- Component structure
- No backend deployment

**Migration effort**: Zero - just add content

### Phase 1 → Phase 2 (Backend Deployment)

**Adding**:
- Deploy backend to Azure Container Apps
- Link to Static Web Apps
- Add execution engine
- Add WebSocket support

**Breaking changes**: None (execution is additive feature)

**Migration effort**: 
- 4-6 hours backend deployment
- 2-3 hours integration testing
- No frontend code changes needed

---

## Dependencies

### Frontend (Phase 0)

**Runtime**: None (pure static)

**Development**:
- Node.js 18+ (for dev server)
- http-server (via npx)
- @playwright/test (for testing)

### Backend (Phase 0 Skeleton)

**Runtime**:
- Python 3.11+
- FastAPI
- Uvicorn
- Pydantic

**Future** (Phase 1-2):
- SQLAlchemy (database ORM)
- Alembic (migrations)
- Redis client
- OAuth libraries
- Amplifier SDK (for recipe execution)

---

## Contributing to Architecture

When proposing architectural changes:

1. **Consider simplicity first** - Can we achieve goal without adding complexity?
2. **Document the decision** - Add to Decision Log section
3. **Update diagrams** - Keep visuals current
4. **Test performance impact** - Ensure changes don't degrade UX
5. **Consider costs** - Keep infrastructure costs reasonable

**Guiding principle**: "Mechanism, not policy" (from Amplifier philosophy)

---

## References

- **Amplifier Core**: https://github.com/microsoft/amplifier
- **Amplifier Foundation**: https://github.com/microsoft/amplifier-foundation
- **Azure Static Web Apps Docs**: https://learn.microsoft.com/en-us/azure/static-web-apps/
- **Phase 0 Execution Plan**: execution_plans/EXECUTION_PLAN_PHASE_0.md
- **Phase 1 Execution Plan**: execution_plans/EXECUTION_PLAN_PHASE_1.md

---

**Last Updated**: 2026-01-03  
**Architecture Version**: 0.1.0 (Phase 0 Complete)  
**Next Review**: Start of Phase 1
