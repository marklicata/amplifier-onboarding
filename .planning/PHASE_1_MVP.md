# Phase 1: Minimal Viable Product

**Timeline:** Weeks 3-4
**Goal:** Users can use existing skills and pre-built bundles to run an amplifier session via their web browser.

---

## Week 3: Gallery + Execution

### Gallery
- [ ] Gallery API endpoint (`/api/gallery`)
- [ ] Gallery UI (card grid)
- [ ] Filter by audience (normie, explorer, deverloper, expert)
- [ ] Bundle detail view (shown as an eash to understand visual for non-technical people. As well as the raw YAML for techies.)
- [ ] "Run" button UI

### Execution Engine
- [ ] Execute prompt API (`/api/execute`)
- [ ] WebSocket streaming (`/ws/stream/{id}`)
- [ ] Session executor in session pool using a bundle
- [ ] Real-time execution viewer UI
- [ ] Error handling and display

### Pre-Built Content
Create 5 showcase bundles associated with specific tasks:
- [ ] 1. Code Review
- [ ] 2. Documentation Generator
- [ ] 3. Test Coverage Analysis
- [ ] 4. Security Audit
- [ ] 5. Codebase Overview
- [ ] 6. Roadmap or scrum planning
- [ ] 7. Product strategy

**Milestone:** ✅ User can run a session with a bundle and see results stream in real-time

---

## Week 4: Polish + Beta Testing

### Polish
- [ ] Loading states everywhere
- [ ] Empty states (no results, etc.)
- [ ] Error messages (user-friendly)
- [ ] Mobile responsive (basic)
- [ ] Rate limit UI (show remaining)

### Content
- [ ] Homepage (1-pager)
  - [ ] Hero section with value props. Focus on the market and how amplifier helps us change the way we've thought about product development and how work gets done. 
  - [ ] Mode selector
  - [ ] CTA to Playground
- [ ] About Amplifier (simple page)
- [ ] GitHub links

### Testing
- [ ] Invite 10 internal beta testers
- [ ] Set up feedback mechanism
- [ ] Monitor analytics dashboard
- [ ] Fix critical bugs

**Milestone:** ✅ Usable MVP with real users testing

---

## Success Criteria

- [ ] 50+ beta testers signed up
- [ ] 100+ sessions executions
- [ ] No critical bugs
- [ ] Positive feedback from testers
- [ ] Average execution time < 5 seconds

---

## GitHub page
For this step, look at https://github.com/microsoft/amplifier and ALL of the repos associated with it. I want to make it simple for anyone to understand how all of the various repos come together.
 - At the top are applications. This app, the CLI, amplifier-desktop or other productivity apps.
 - The main entry point for Amplifier is amplifier-foundation
 - under amplifier foundation are all of the other repos. amplifier-core, bundles, etc. Visualize this, with links to the repos, so we can make it as simple as possible for anyone to understand how this all comes together.

## Notes

- This is the moment of truth - does it work?
- Focus on core experience, not bells and whistles
- Get real user feedback early
