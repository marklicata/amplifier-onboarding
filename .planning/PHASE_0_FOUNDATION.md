# Phase 0: Foundation

**Timeline:** Weeks 1-2
**Goal:** Set up infrastructure and deploy "Hello World" to production

---

## Week 1: Infrastructure Setup

### Azure Resources
- [ ] Create resource group
- [ ] Provision Azure Static Web Apps (frontend)
- [ ] Provision Azure Container Apps (backend)
- [ ] Set up Azure Container Registry
- [ ] Create PostgreSQL Flexible Server (Basic tier)
- [ ] Configure Application Insights
- [ ] Set up Azure Key Vault for secrets

### GitHub
- [ ] Create monorepo structure
- [ ] Set up frontend CI/CD pipeline
- [ ] Set up backend CI/CD pipeline
- [ ] Configure branch protection (main)
- [ ] Set up PR preview deployments

### Local Development
- [ ] Docker Compose for local PostgreSQL
- [ ] Backend dev environment (Python + FastAPI)
- [ ] Frontend dev environment (Next.js + React)
- [ ] Hot reload working end-to-end

**Milestone:** ✅ Can deploy "Hello World" to production via GitHub push

---

## Week 2: Core Architecture

### Backend
- [ ] Pre-warmed session pool implementation
- [ ] GitHub OAuth integration
- [ ] JWT token generation/validation
- [ ] Rate limiter (PostgreSQL-based)
- [ ] Analytics tracking foundation
- [ ] Basic `/health` endpoint

### Frontend
- [ ] Next.js 14 setup with App Router
- [ ] Tailwind CSS + Shadcn/ui components
- [ ] GitHub OAuth flow (frontend)
- [ ] Analytics tracking hook
- [ ] Mode selection UI (basic)

### Database
- [ ] Create schema (2 tables)
- [ ] Seed gallery with 3 demo recipes
- [ ] Migration system (Alembic)

**Milestone:** ✅ User can sign in with GitHub and see their mode

---

## Success Criteria

- [ ] Infrastructure provisioned and accessible
- [ ] CI/CD pipelines deploying successfully
- [ ] Local development environment running
- [ ] User authentication working
- [ ] Basic analytics tracking events
- [ ] Database schema deployed

---

## Notes

- Focus on getting infrastructure right, not features
- Document setup process for team onboarding
- Keep deployments simple and automated
