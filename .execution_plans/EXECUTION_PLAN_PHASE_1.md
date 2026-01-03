# Phase 1 Execution Plan - MVP Show (Weeks 3-6)

**Goal**: Add recipe execution capability while keeping site public and accessible

**Philosophy**: Defer authentication as long as possible - keep the site open for exploration

---

## Authentication Strategy (REVISED)

### Phase 0 (Current): ✅ No Authentication
**Site is completely public**:
- Anyone can browse recipes
- Anyone can view content
- No login required

### Phase 1 (This Phase): ⚠️ Authentication Optional
**Two tracks**:

**Track A: Public Demos Only** (Recommended for MVP)
- Show pre-recorded execution videos
- Display static execution examples
- Sandboxed demos with strict IP-based rate limiting
- **Still no login required** ✅

**Track B: Live Execution with Auth** (If you want live execution)
- Add GitHub OAuth for users who want to execute recipes
- Public browsing still works without auth
- Login only required for "Execute" button
- **Hybrid approach**: Browse public, execute authenticated

### Phase 2-3: 🔐 Authentication Required for Execution
- GitHub OAuth for all recipe execution
- Save custom recipes (requires identity)
- Rate limiting per-user

### Phase 4: 🔐 Authentication Required for Community
- Publish to gallery (requires identity)
- User profiles
- Comments and ratings

---

## Recommended Phase 1 Approach: Public Demos

**Instead of building authentication**, show value through:

### Increment 1.1: Pre-recorded Execution Videos (2 hours)
- Record 5 recipe executions using Amplifier locally
- Add video player to recipe detail pages
- Show step-by-step execution with commentary
- **No backend needed, no auth needed**

### Increment 1.2: Static Execution Examples (2 hours)
- Create example inputs and outputs for each recipe
- Display in collapsible sections on recipe pages
- Show "before/after" code examples
- **Pure static content**

### Increment 1.3: Sandboxed Demo Environment (8-10 hours - OPTIONAL)
- Build minimal backend for demo executions only
- Strict IP-based rate limiting (5 executions per day per IP)
- Pre-configured safe examples only
- **Still no user authentication required**

---

## When to Add Authentication

**Add OAuth when you need to**:
1. **Prevent abuse** - Free execution is being abused
2. **User-generated content** - Save/share custom recipes
3. **Personalization** - Save preferences, history
4. **Rate limiting** - More sophisticated than IP-based

**Estimated timing**: Phase 2-3 (Months 3-4)

---

## Phase 1 Revised Increments

### Week 3: Recipe Execution Content (No Backend)

**Increment 1.1**: Create execution video demos (2 hours)
- Record 5 recipe executions
- Edit videos (30-60 seconds each)
- Add to recipe detail pages

**Increment 1.2**: Static execution examples (2 hours)
- Add "Example Usage" sections to recipe pages
- Show sample inputs and outputs
- Code snippets with syntax highlighting

**Increment 1.3**: Interactive execution viewer mockup (3 hours)
- Build UI for showing execution steps
- Use static data (JSON) to show flow
- Simulate real-time updates
- **No actual execution - just demonstration**

### Week 4: Learning Content

**Increment 2.1**: Interactive tutorials (4 hours)
- "What is a Recipe" interactive guide
- "Understanding Bundles" tutorial
- "How Agents Work" explanation
- All static content, no backend

**Increment 2.2**: Documentation expansion (3 hours)
- API reference documentation
- Recipe schema guide
- Best practices
- Common patterns

### Week 5: Visual Recipe Builder Mockup

**Increment 3.1**: Visual builder UI (6 hours)
- Drag-and-drop interface (static)
- YAML preview (client-side generation)
- Download YAML functionality
- **No save to cloud - just download**

### Week 6: Polish & Launch Prep

**Increment 4.1**: Performance optimization (2 hours)
**Increment 4.2**: SEO and social sharing (2 hours)
**Increment 4.3**: Analytics integration (1 hour)
**Increment 4.4**: Launch materials (3 hours)

---

## Backend Work (Deferred)

All backend work from original Phase 0 Days 6-7, 9-10 is **moved here**:

### When Needed: Add Backend for Live Execution

**This becomes Phase 2 work** (Months 3-4):

- FastAPI backend setup
- Docker Compose development environment
- PostgreSQL database (for user data, execution logs)
- Redis cache (for rate limiting)
- GitHub OAuth authentication
- JWT token system
- Recipe execution engine (sandboxed)
- WebSocket for real-time updates

**Estimated time**: 2-3 weeks of focused development

---

## Why This Approach is Better

**For Phase 1**:
- ✅ Faster to build (no backend complexity)
- ✅ Cheaper to run (no compute/database costs)
- ✅ More accessible (no login barrier)
- ✅ Better for SEO (all content is crawlable)
- ✅ Easier to maintain (fewer moving parts)
- ✅ Shows value through content, not execution

**User can**:
- See what recipes do (videos and examples)
- Understand how Amplifier works (documentation)
- Download recipe YAML (to run locally)
- Learn the concepts (tutorials)
- **Decide if they want to install Amplifier** without barriers

**When they want to actually execute**:
- Direct them to install Amplifier locally (the real goal!)
- Or add authentication later when you build execution engine

---

## Updated Success Metrics

### Phase 0 (Complete):
- ✅ Live site on Azure
- ✅ 5 showcase recipes with detailed content
- ✅ Recipe gallery with filtering/search
- ✅ Design system and component library
- ✅ Mobile responsive
- ✅ Accessible (WCAG 2.1 AA)

### Phase 1 (Weeks 3-6):
- Add execution videos/examples for all 5 recipes
- Create 3-5 interactive tutorials
- Build visual recipe builder (client-side, download only)
- Add 10 more recipe descriptions (15 total)
- Optimize performance and SEO
- **Still no authentication required**

### Phase 2 (Months 3-4) - When You Add Live Execution:
- Add backend API
- Add GitHub OAuth
- Enable live recipe execution
- Add rate limiting
- **NOW authentication is valuable**

---

## Summary

**Your question exposed the right issue**: OAuth was planned too early!

**New plan**:
- Phase 0: Public showcase ✅ COMPLETE
- Phase 1: Public demos and tutorials (no backend, no auth)
- Phase 2: Add execution engine (NOW add backend + auth)
- Phase 3-4: Community features (auth required for UGC)

This keeps the site **open and accessible** for discovery and learning, which aligns perfectly with your evangelism goal!

---

**Should I create the full Phase 1 plan with this revised approach?**
