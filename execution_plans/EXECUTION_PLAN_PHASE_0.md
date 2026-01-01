# Phase 0 Execution Plan - Foundation (Weeks 1-2)

**Goal**: Establish technical foundation with visible progress every 1-2 hours

**Philosophy**: Ship small, verify often, build confidence through incremental wins

---

## Week 1: Development Environment & Static Site Foundation

### Day 1: Project Structure & Basic HTML/CSS (4-6 hours)

#### Increment 1.1: Enhanced Landing Page (1-2 hours)
**Current state**: Basic index.html with gradient background  
**Target**: Professional landing page with proper structure

**Tasks**:
- [ ] Enhance index.html with proper semantic HTML5
- [ ] Add meta tags for SEO and social sharing
- [ ] Create favicon and app icons
- [ ] Improve responsive design (mobile-first)
- [ ] Add analytics placeholder (Plausible or similar)

**Verification**: Open index.html locally, test on mobile viewport  
**Commit**: "Enhance landing page structure and responsiveness"

---

#### Increment 1.2: Basic CSS Architecture (1 hour)
**Current state**: Inline styles in index.html  
**Target**: Organized CSS with utility classes

**Tasks**:
- [ ] Extract CSS to separate `styles/main.css`
- [ ] Set up CSS variables for theming (colors, spacing, fonts)
- [ ] Add utility classes for common patterns
- [ ] Ensure GitHub Pages can serve CSS correctly

**Verification**: Landing page looks identical, but CSS is external  
**Commit**: "Extract CSS to external stylesheet with CSS variables"

---

#### Increment 1.3: Navigation & Page Structure (1-2 hours)
**Current state**: Single page with no navigation  
**Target**: Multi-page structure ready

**Tasks**:
- [ ] Create `/pages` directory structure
- [ ] Add navigation header component (HTML template)
- [ ] Create footer with links
- [ ] Set up basic routing structure (for future pages)
  - `/index.html` - Homepage
  - `/playground/index.html` - Recipe playground (placeholder)
  - `/learn/index.html` - Learning hub (placeholder)
  - `/docs/index.html` - Documentation (placeholder)

**Verification**: Navigation works, pages load, GitHub Pages serves correctly  
**Commit**: "Add navigation and multi-page structure"

---

#### Increment 1.4: Design System Foundations (1 hour)
**Current state**: Ad-hoc styling  
**Target**: Documented design system basics

**Tasks**:
- [ ] Create `DESIGN_SYSTEM.md` in `/docs`
- [ ] Document color palette (from existing gradient)
- [ ] Document typography scale
- [ ] Document spacing scale
- [ ] Create simple component examples (buttons, cards)

**Verification**: Design system doc is clear and actionable  
**Commit**: "Add design system documentation"

---

### Day 2: Component Library & Interactive Elements (4-6 hours)

#### Increment 2.1: Reusable HTML Components (2 hours)
**Current state**: Everything in one HTML file  
**Target**: Reusable component templates

**Tasks**:
- [ ] Create `/components` directory
- [ ] Build card component (for features, recipes)
- [ ] Build button component (primary, secondary, tertiary)
- [ ] Build input component (text, select, file)
- [ ] Create example usage page

**Verification**: Components render correctly, are reusable  
**Commit**: "Add reusable HTML component library"

---

#### Increment 2.2: Recipe Gallery Preview (2 hours)
**Current state**: Only feature cards on landing page  
**Target**: Visual recipe cards with metadata

**Tasks**:
- [ ] Create `/data/recipes-showcase.json` with 5 recipes:
  1. Code Review
  2. API Documentation Generator
  3. Security Audit
  4. Test Coverage Improver
  5. Bug Finder & Fixer
- [ ] Build recipe card component
- [ ] Create `/playground/index.html` showing gallery
- [ ] Add filtering by category (client-side)

**Verification**: Can browse 5 recipes, filter works  
**Commit**: "Add recipe gallery with 5 showcase recipes"

---

#### Increment 2.3: Interactive Elements (1-2 hours)
**Current state**: Static page  
**Target**: Basic interactivity with vanilla JS

**Tasks**:
- [ ] Create `scripts/main.js` for interactions
- [ ] Add recipe card hover effects
- [ ] Add category filter functionality
- [ ] Add search box (filter by name/description)
- [ ] Add "Coming Soon" modal for disabled features

**Verification**: Filters work, search works, modals appear  
**Commit**: "Add interactive filtering and search to recipe gallery"

---

### Day 3: Development Tooling & Automation (3-4 hours)

#### Increment 3.1: Local Development Server (1 hour)
**Current state**: Opening files directly in browser  
**Target**: Proper local dev server

**Tasks**:
- [ ] Create `package.json` with dev dependencies
- [ ] Add simple dev server (e.g., `lite-server` or `http-server`)
- [ ] Add npm scripts: `dev`, `build`, `preview`
- [ ] Create `.gitignore` for node_modules
- [ ] Document setup in README

**Verification**: `npm run dev` works, hot reload on changes  
**Commit**: "Add development server and npm scripts"

---

#### Increment 3.2: Build Pipeline Basics (1 hour)
**Current state**: No build process  
**Target**: Simple build pipeline for optimizations

**Tasks**:
- [ ] Add CSS minification
- [ ] Add HTML minification (optional for now)
- [ ] Add file hash for cache busting
- [ ] Output to `/dist` directory
- [ ] Test GitHub Pages deployment from `/dist`

**Verification**: Build creates optimized files, deploys correctly  
**Commit**: "Add build pipeline with CSS minification"

---

#### Increment 3.3: Development Documentation (1 hour)
**Current state**: No dev docs  
**Target**: Clear contributor guide

**Tasks**:
- [ ] Create `CONTRIBUTING.md`
- [ ] Document local setup steps
- [ ] Document build and deployment process
- [ ] Add code style guide (HTML/CSS/JS)
- [ ] Create issue templates for GitHub

**Verification**: Another developer could set up from docs  
**Commit**: "Add development documentation and contribution guide"

---

### Day 4: Content Strategy & Information Architecture (3-4 hours)

#### Increment 4.1: Recipe Metadata Schema (1 hour)
**Current state**: Basic JSON with minimal info  
**Target**: Rich metadata for discovery

**Tasks**:
- [ ] Design recipe metadata schema:
  - name, description, version, author
  - difficulty, estimated_duration, category
  - tags, prerequisites, related_recipes
  - inputs schema, outputs schema
- [ ] Update `recipes-showcase.json` with full metadata
- [ ] Create schema validation (JSON Schema)

**Verification**: All 5 recipes have complete metadata  
**Commit**: "Add comprehensive recipe metadata schema"

---

#### Increment 4.2: Content for 5 Showcase Recipes (2 hours)
**Current state**: Just names and basic descriptions  
**Target**: Detailed recipe pages with value props

**Tasks**:
- [ ] For each of the 5 recipes, write:
  - Compelling description (2-3 sentences)
  - Value proposition (1 sentence hook)
  - Use cases (3-5 bullet points)
  - Example inputs/outputs
  - Estimated time and difficulty
- [ ] Create recipe detail page template
- [ ] Link from gallery to detail pages

**Verification**: Each recipe has a compelling detail page  
**Commit**: "Add detailed content for 5 showcase recipes"

---

### Day 5: Testing & Quality Assurance Setup (3-4 hours)

#### Increment 5.1: Testing Framework (1-2 hours)
**Current state**: No automated testing  
**Target**: Basic test infrastructure

**Tasks**:
- [ ] Add testing dependencies (Playwright or similar)
- [ ] Create test directory structure
- [ ] Write first E2E test: "Homepage loads"
- [ ] Write test: "Recipe gallery displays 5 recipes"
- [ ] Write test: "Filter works"
- [ ] Add npm script: `test`

**Verification**: Tests pass, can run locally  
**Commit**: "Add E2E testing framework with initial tests"

---

#### Increment 5.2: Accessibility Audit (1 hour)
**Current state**: Unknown accessibility status  
**Target**: WCAG 2.1 AA baseline

**Tasks**:
- [ ] Run Lighthouse accessibility audit
- [ ] Fix critical issues:
  - Alt text for images
  - Proper heading hierarchy
  - Color contrast ratios
  - Keyboard navigation
  - ARIA labels where needed
- [ ] Document accessibility checklist

**Verification**: Lighthouse accessibility score >90  
**Commit**: "Improve accessibility to WCAG 2.1 AA baseline"

---

#### Increment 5.3: Performance Baseline (1 hour)
**Current state**: Unknown performance  
**Target**: Fast initial load

**Tasks**:
- [ ] Run Lighthouse performance audit
- [ ] Optimize images (compress, proper formats)
- [ ] Add loading strategies (defer/async scripts)
- [ ] Minimize CSS/JS
- [ ] Test on slow 3G connection

**Verification**: Lighthouse performance score >90, <2s load  
**Commit**: "Optimize performance for fast initial load"

---

## Week 2: Backend Foundation & Deployment Infrastructure

### Day 6: Backend Project Setup (3-4 hours)

#### Increment 6.1: FastAPI Project Structure (1-2 hours)
**Current state**: No backend  
**Target**: Basic FastAPI skeleton

**Tasks**:
- [ ] Create `/backend` directory
- [ ] Initialize Python project with `pyproject.toml`
- [ ] Set up FastAPI with basic structure:
  - `app/main.py` - Entry point
  - `app/api/routes/` - Route handlers
  - `app/core/config.py` - Settings
- [ ] Add health check endpoint: `GET /health`
- [ ] Add CORS middleware for frontend
- [ ] Create `requirements.txt` or use pyproject.toml

**Verification**: `uvicorn app.main:app --reload` runs, /health returns 200  
**Commit**: "Initialize FastAPI backend with health check"

---

#### Increment 6.2: Development Environment (1 hour)
**Current state**: Manual setup  
**Target**: Automated local development

**Tasks**:
- [ ] Create `docker-compose.yml` for local development:
  - Backend service (FastAPI)
  - PostgreSQL service
  - Redis service
- [ ] Create `.env.example` with required variables
- [ ] Add backend to npm scripts: `npm run dev:backend`
- [ ] Document in CONTRIBUTING.md

**Verification**: `docker-compose up` starts all services  
**Commit**: "Add Docker Compose for local development"

---

#### Increment 6.3: Database Schema V1 (1 hour)
**Current state**: No database  
**Target**: Basic tables for users and executions

**Tasks**:
- [ ] Set up SQLAlchemy with base models
- [ ] Create initial migration with Alembic
- [ ] Define models (minimal):
  - `User` - id, github_id, username, created_at
  - `Execution` - id, user_id, status, created_at
- [ ] Create migration: `001_initial_schema`
- [ ] Test migration runs successfully

**Verification**: Tables created in PostgreSQL, migration runs  
**Commit**: "Add database schema v1 with users and executions"

---

### Day 7: Authentication Foundation (3-4 hours)

#### Increment 7.1: GitHub OAuth Setup (2 hours)
**Current state**: No auth  
**Target**: OAuth flow skeleton

**Tasks**:
- [ ] Register GitHub OAuth app (get client_id, client_secret)
- [ ] Add auth routes:
  - `GET /auth/login/github` - Redirect to GitHub
  - `GET /auth/callback/github` - Handle callback
  - `GET /auth/me` - Get current user
- [ ] Add environment variables for OAuth
- [ ] Create user on first login (get or create pattern)

**Verification**: Can log in with GitHub, user created in DB  
**Commit**: "Add GitHub OAuth authentication flow"

---

#### Increment 7.2: JWT Token System (1 hour)
**Current state**: OAuth works but no session management  
**Target**: JWT-based auth

**Tasks**:
- [ ] Add JWT token generation
- [ ] Add token verification middleware
- [ ] Add `Authorization: Bearer <token>` support
- [ ] Create frontend auth state management (localStorage)
- [ ] Add login/logout UI to frontend

**Verification**: Can log in, token stored, protected routes work  
**Commit**: "Add JWT token system and auth UI"

---

#### Increment 7.3: Rate Limiting (1 hour)
**Current state**: No rate limiting  
**Target**: Basic per-IP rate limits

**Tasks**:
- [ ] Add `slowapi` dependency
- [ ] Configure rate limiter with Redis
- [ ] Add rate limit to future recipe execution endpoint (10/minute)
- [ ] Add rate limit headers to responses
- [ ] Test rate limiting works

**Verification**: Can't exceed rate limit, returns 429  
**Commit**: "Add rate limiting with Redis backend"

---

### Day 8: Deployment Infrastructure (1-2 hours)

#### Increment 8.1: Azure Static Web Apps Deployment (15 minutes)
**Current state**: Running locally only  
**Target**: Live on Azure with auto-deploy

**Prerequisites**:
- Azure subscription
- Azure CLI installed and logged in (`az login`)
- GitHub personal access token (repo + workflow scope)

**Tasks**:
- [ ] Run Azure Static Web Apps deployment script (see AZURE_STATIC_WEB_APPS.md)
- [ ] Verify GitHub Actions workflow auto-created
- [ ] Wait for first deployment to complete
- [ ] Verify site accessible at `*.azurestaticapps.net`

**Quick commands**:
```bash
# See execution_plans/AZURE_STATIC_WEB_APPS.md for full script
az staticwebapp create \
  --name "amplifier-onboarding" \
  --resource-group "amplifier-rg" \
  --location "eastus2" \
  --source "https://github.com/yourusername/amplifier-onboarding" \
  --branch "main" \
  --app-location "/" \
  --output-location "/" \
  --token "$GITHUB_TOKEN"
```

**Verification**: 
- Site live at `https://<app-name>.azurestaticapps.net`
- GitHub Actions workflow in `.github/workflows/azure-static-web-apps-*.yml`
- Commits to main trigger auto-deploy

**Commit**: Not needed - Azure creates the workflow automatically

---

#### Increment 8.2: Backend Container Preparation (45 minutes)
**Current state**: Backend runs locally only  
**Target**: Backend ready for Azure Container Apps deployment (Phase 1)

**Tasks**:
- [ ] Create `backend/Dockerfile` (optimized for FastAPI)
- [ ] Create `.dockerignore` file
- [ ] Test Docker build locally: `docker build -t amplifier-api ./backend`
- [ ] Test Docker run locally: `docker run -p 8000:8000 amplifier-api`
- [ ] Document backend deployment process for Phase 1

**Verification**: 
- Docker image builds successfully
- Container runs and `/health` endpoint works
- Image size is reasonable (<500MB)

**Commit**: "Add Dockerfile for backend container deployment"

**Note**: We're not deploying the backend yet - that comes in Phase 1. We're just preparing the container.

---

#### Increment 8.3: Custom Domain Setup (15 minutes - OPTIONAL)
**Current state**: Using `*.azurestaticapps.net`  
**Target**: Custom domain with free SSL

**Prerequisites**: Own a domain and have DNS access

**Tasks**:
- [ ] Add custom domain to Static Web App:
  ```bash
  az staticwebapp hostname set \
    --name "amplifier-onboarding" \
    --resource-group "amplifier-rg" \
    --hostname "amplifier.dev"
  ```
- [ ] Add DNS CNAME record at your DNS provider:
  - Name: `www` (or `@` for apex)
  - Type: `CNAME`
  - Value: `<app-name>.azurestaticapps.net`
- [ ] Wait for DNS propagation (5-60 minutes)
- [ ] Verify SSL certificate auto-provisioned

**Verification**: 
- Custom domain resolves to Static Web App
- HTTPS works on custom domain
- Certificate is valid

**Commit**: Not needed (infrastructure only)

**Note**: Skip this if you don't have a custom domain yet. The `*.azurestaticapps.net` URL works perfectly fine.

---

### Day 9: Backend API - Recipe Gallery (3-4 hours)

#### Increment 9.1: Recipe Gallery API (1-2 hours)
**Current state**: Recipes only in frontend JSON  
**Target**: Backend serves recipe catalog

**Tasks**:
- [ ] Create `app/api/routes/recipes.py`
- [ ] Add endpoint: `GET /api/recipes` (list all)
- [ ] Add endpoint: `GET /api/recipes/{id}` (get one)
- [ ] Add query params: `?category=`, `?difficulty=`
- [ ] Load recipes from JSON or database
- [ ] Add response models (Pydantic)

**Verification**: API returns recipes, filtering works  
**Commit**: "Add recipe gallery API endpoints"

---

#### Increment 9.2: Frontend Integration with API (1-2 hours)
**Current state**: Frontend uses local JSON  
**Target**: Frontend fetches from API

**Tasks**:
- [ ] Create `scripts/api.js` - API client wrapper
- [ ] Update recipe gallery to fetch from API
- [ ] Add loading states
- [ ] Add error handling (API down, network error)
- [ ] Configure API URL (env-based: local vs production)

**Verification**: Gallery loads from API, shows loading state  
**Commit**: "Connect frontend recipe gallery to backend API"

---

### Day 10: Testing & Documentation (3-4 hours)

#### Increment 10.1: Backend Testing (2 hours)
**Current state**: No backend tests  
**Target**: Basic test coverage

**Tasks**:
- [ ] Set up pytest
- [ ] Add test fixtures (test database, test client)
- [ ] Write tests for recipe endpoints:
  - Test GET /api/recipes returns 5 recipes
  - Test filtering by category
  - Test GET /api/recipes/{id} returns recipe
  - Test 404 for invalid recipe id
- [ ] Add npm script: `npm run test:backend`

**Verification**: All tests pass  
**Commit**: "Add backend API tests with pytest"

---

#### Increment 10.2: Integration Tests (1 hour)
**Current state**: Only unit tests  
**Target**: End-to-end workflow tests

**Tasks**:
- [ ] Write integration test: "User can browse recipes"
- [ ] Write test: "User can filter recipes by category"
- [ ] Write test: "User can view recipe details"
- [ ] Add to CI pipeline

**Verification**: Integration tests pass in CI  
**Commit**: "Add integration tests for recipe gallery flow"

---

#### Increment 10.3: Documentation Updates (1 hour)
**Current state**: Basic README  
**Target**: Complete Phase 0 documentation

**Tasks**:
- [ ] Update README.md with:
  - Current status (what's built)
  - Setup instructions (local development)
  - Deployment status
  - Architecture diagram (simple)
- [ ] Create `docs/ARCHITECTURE.md` with:
  - Frontend structure
  - Backend structure
  - Deployment diagram
- [ ] Update CONTRIBUTING.md with testing guide

**Verification**: Documentation is clear and complete  
**Commit**: "Update documentation for Phase 0 completion"

---

## Success Criteria for Phase 0

At the end of Week 2, we should have:

### Technical
- ✅ Local development environment runs with one command
- ✅ Frontend deploys automatically to Azure Static Web Apps on commit
- ✅ Backend containerized and ready for Phase 1 deployment
- ✅ Recipe gallery displays 5 showcase recipes
- ✅ Filtering and search work
- ✅ Basic authentication flow works (GitHub OAuth)
- ✅ Database schema established
- ✅ Rate limiting in place

### Quality
- ✅ All tests passing in CI/CD
- ✅ Lighthouse scores: Performance >90, Accessibility >90
- ✅ Mobile-responsive design verified
- ✅ Documentation complete and clear

### Deliverables
- ✅ Live site at https://amplifier-onboarding.azurestaticapps.net
- ✅ Backend containerized (Dockerfile) and tested locally
- ✅ Design system documented
- ✅ 5 showcase recipes with full content
- ✅ Test suite with >80% coverage
- ✅ Auto-deploy pipeline via GitHub Actions (Azure-managed)

---

## Daily Standup Format

Each day, track:

**Yesterday:**
- Increments completed
- Commits pushed
- Blockers encountered

**Today:**
- Target increments (1-4 per day)
- Expected commits
- Dependencies needed

**Blockers:**
- Technical issues
- Decisions needed
- External dependencies

---

## Verification Checklist (End of Phase 0)

Run through this before moving to Phase 1:

### Frontend
- [ ] Homepage loads in <2 seconds
- [ ] Navigation works across all pages
- [ ] Recipe gallery displays all 5 recipes
- [ ] Filter by category works
- [ ] Search by name/description works
- [ ] Mobile view is usable
- [ ] Accessibility score >90

### Backend
- [ ] Health check returns 200
- [ ] Recipe API returns all recipes
- [ ] Filtering API works
- [ ] Authentication flow completes
- [ ] Rate limiting triggers at limit
- [ ] Database migrations run successfully

### DevOps
- [ ] Commit to main triggers frontend deploy to Azure Static Web Apps
- [ ] GitHub Actions workflow auto-created by Azure
- [ ] All tests pass in CI
- [ ] Backend Dockerfile builds and runs locally
- [ ] Environment variables documented for Phase 1
- [ ] Monitoring/logging basics in place

### Documentation
- [ ] README explains setup
- [ ] CONTRIBUTING.md explains development
- [ ] Design system documented
- [ ] Architecture documented
- [ ] API endpoints documented

---

## Risk Mitigation

### Risk: Azure Static Web Apps deployment issues
**Mitigation**: Test deployment early (Day 8), use simple static files first  
**Fallback**: GitHub Pages or Netlify as temporary alternative

### Risk: Azure Container Apps complexity (Phase 1)
**Mitigation**: Use minimal configuration, leverage Supabase/Upstash free tiers  
**Fallback**: Defer backend to Phase 2 if needed

### Risk: OAuth setup takes too long
**Mitigation**: Defer to Day 7, use mock auth initially  
**Fallback**: Use simple API key auth for MVP

### Risk: Can't complete in 2 weeks
**Mitigation**: Prioritize increments, cut nice-to-haves  
**Fallback**: Extend Phase 0 to 3 weeks, but ship something every day

---

## Tools & Dependencies

### Frontend
- **HTML/CSS/JS**: Vanilla (no framework yet)
- **Build**: npm scripts + basic tooling
- **Testing**: Playwright
- **Dev Server**: lite-server or http-server

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL (Fly.io Postgres or Supabase)
- **Cache**: Redis (Fly.io Redis or Upstash)
- **Auth**: authlib (OAuth), PyJWT
- **Testing**: pytest, httpx

### DevOps
- **CI/CD**: GitHub Actions
- **Frontend Hosting**: GitHub Pages
- **Backend Hosting**: Fly.io
- **Monitoring**: Basic logging (upgrade later)

---

## Next Steps After Phase 0

Once Phase 0 is complete, we'll be ready for:

**Phase 1 (Weeks 3-6): MVP - Show**
- Recipe execution engine (sandbox)
- Real-time execution viewer
- WebSocket integration
- 5 working recipes (not just metadata)

But for now, **focus exclusively on Phase 0 foundations**. Every increment should:
1. Take 1-2 hours max
2. Be committable and deployable
3. Have clear verification criteria
4. Build on previous increments
5. Show visible progress

---

## Progress Tracking

Use this checklist to track overall Phase 0 progress:

**Week 1:**
- [ ] Day 1: Enhanced landing page, CSS architecture, navigation, design system
- [ ] Day 2: Component library, recipe gallery preview, interactivity
- [ ] Day 3: Dev server, build pipeline, dev documentation
- [ ] Day 4: Recipe metadata, content for 5 recipes
- [ ] Day 5: Testing framework, accessibility, performance

**Week 2:**
- [ ] Day 6: Backend setup, health check, basic structure
- [ ] Day 7: Authentication (OAuth + JWT), rate limiting
- [ ] Day 8: Deployment (GitHub Pages + Fly.io), CI/CD
- [ ] Day 9: Recipe API, frontend integration
- [ ] Day 10: Backend tests, integration tests, final docs

**Percentage Complete**: 0/25 increments (0%)

---

## Communication & Demos

**Daily**: Share what was built (screenshot, link, description)  
**Weekly**: Live demo of accumulated progress  
**End of Phase 0**: Full walkthrough of foundation

Every commit should be demo-able. Every day should show visible progress.

---

**Ready to start? Let's begin with Increment 1.1: Enhanced Landing Page!**
