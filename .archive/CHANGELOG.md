# Changelog

All notable changes to Amplifier Onboarding will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-01-03 - Phase 0 Complete

### Added

**Frontend**:
- Enhanced landing page with semantic HTML5 and comprehensive SEO meta tags
- Fixed navigation bar with glassmorphic design across all pages
- Recipe gallery with 5 showcase recipes
- Interactive filtering by category and difficulty
- Search functionality with debounce
- 5 detailed recipe pages with full content (how it works, use cases, inputs/outputs)
- Component library with button and card examples
- Design system documentation (colors, typography, spacing, components)
- Accessibility improvements (skip-to-main, ARIA labels, WCAG 2.1 AA baseline)
- Performance monitoring script
- 404 error page
- Accessibility statement page
- PWA manifest (site.webmanifest)
- Favicon (SVG)

**Backend (Skeleton)**:
- FastAPI application structure
- Health check endpoint (`GET /health`)
- CORS middleware configured for frontend
- Pydantic settings management
- Dockerfile for containerization
- Ready for Phase 1 deployment

**Development**:
- Local development server (http-server via npm)
- Playwright testing framework with 20+ tests
  - Homepage tests
  - Recipe gallery tests (filtering, search)
  - Navigation tests
  - Accessibility tests
  - Performance tests
- Recipe validation script
- Contributing guide
- Architecture documentation

**Deployment**:
- Azure Static Web Apps deployment
- Auto-deploy from GitHub Actions
- Live at: https://amplifier-onboarding.azurestaticapps.net

**Documentation**:
- Updated README with quick start and architecture
- Created CONTRIBUTING.md with developer guide
- Created ARCHITECTURE.md with technical details
- Created DESIGN_SYSTEM.md with design tokens and guidelines
- Updated execution plans (Phase 0 complete, Phase 1 created)

### Changed

- Simplified Phase 0 scope: Deferred authentication to Phase 2 (when live execution is added)
- Updated deployment strategy: Azure Static Web Apps instead of GitHub Pages
- Revised Phase 1 plan: Focus on demos and content, not live execution

### Technical Details

- **Files Created**: 40+ files
- **Lines of Code**: ~3,000 lines (HTML, CSS, JS, Python)
- **Test Coverage**: 20+ end-to-end tests
- **Pages**: 10+ pages (home, playground, learn, docs, 5 recipe details, components, accessibility)
- **Recipes**: 5 fully documented showcase recipes

### Deployment Stats

- **Deployments**: 3 successful deployments to Azure
- **Deployment Time**: ~2 minutes per deployment
- **Uptime**: 100% (since first deployment)
- **Cost**: $0/month (Free tier)

---

## [Unreleased] - Phase 1 (Planned)

### Planned Additions

**Content**:
- Execution video demos for all 5 recipes
- Static execution examples (before/after code)
- Interactive tutorials (What is a Recipe, Understanding Bundles, How Agents Work)
- 10 additional recipe descriptions (15 total)
- Visual recipe builder mockup (client-side YAML generation)

**Performance**:
- Social preview images for sharing
- Sitemap.xml for SEO
- Analytics integration (Microsoft Clarity or Plausible)
- Image optimization

**Documentation**:
- Expanded API reference
- Recipe authoring guide
- Best practices documentation
- Video tutorials

### Not Planned for Phase 1

- Live recipe execution (deferred to Phase 2)
- Authentication (deferred to Phase 2)
- Database deployment (deferred to Phase 2)
- User accounts (deferred to Phase 2)

**Rationale**: Keep site public and accessible for OSS evangelism.

---

## [Future] - Phase 2+ (Months 3-6)

### When to Add

**Live Recipe Execution Engine**:
- Deploy backend to Azure Container Apps
- Add sandboxed execution environment
- WebSocket for real-time updates
- IP-based rate limiting

**Authentication** (when abuse becomes a problem):
- GitHub OAuth
- JWT tokens
- User database
- Per-user rate limiting

**Community Features** (when you have active users):
- User profiles
- Custom recipe storage
- Recipe sharing and forking
- Ratings and comments

---

## Version History

| Version | Date | Description | Status |
|---------|------|-------------|--------|
| 0.1.0 | 2026-01-03 | Phase 0 Complete - Public showcase site | ✅ Live |
| 0.2.0 | TBD | Phase 1 - Demos and tutorials | 📅 Planned |
| 0.3.0 | TBD | Phase 2 - Live execution engine | 📅 Future |
| 1.0.0 | TBD | Public launch | 📅 Future |

---

## Links

- **Live Site**: https://amplifier-onboarding.azurestaticapps.net
- **GitHub**: https://github.com/yourusername/amplifier-onboarding
- **Amplifier OSS**: https://github.com/microsoft/amplifier
- **Phase 0 Plan**: execution_plans/EXECUTION_PLAN_PHASE_0.md
- **Phase 1 Plan**: execution_plans/EXECUTION_PLAN_PHASE_1.md
