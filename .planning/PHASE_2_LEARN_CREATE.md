# Phase 2: Learn + Create

**Timeline:** Weeks 5-7
**Goal:** Add learning content and enable recipe creation for Developers

---

## Week 5: Learn Section

### Learn Pages
- [ ] `/learn` - Overview with video
- [ ] `/learn/concepts` - Core concepts explained
- [ ] `/learn/tutorials` - Interactive tutorials
  - [ ] Tutorial 1: Run Your First Recipe (5 min)
  - [ ] Tutorial 2: Understanding Bundles (5 min)
  - [ ] Tutorial 3: Recipe Anatomy (10 min)

### Implementation
- [ ] Markdown-based content system
- [ ] Video embeds (YouTube/Vimeo)
- [ ] Tutorial progress tracking (local storage)
- [ ] Code examples with syntax highlighting

### Content Creation
- [ ] Write all tutorial content
- [ ] Record demo videos (screen recordings OK)
- [ ] Create diagrams (architecture, flow)

**Milestone:** ✅ Users can learn Amplifier concepts interactively

---

## Week 6: Recipe Builder (Visual)

### Visual Builder
- [ ] React Flow integration
- [ ] Agent palette (drag-and-drop)
- [ ] Canvas with step nodes
- [ ] Connect steps (context flow)
- [ ] Properties panel
- [ ] YAML preview (live)

### Features
- [ ] Add step
- [ ] Configure step (agent, prompt, output)
- [ ] Delete step
- [ ] Reorder steps
- [ ] Test recipe (execute in playground)

### Mode Gating
- [ ] Only visible in Developer/Expert modes
- [ ] Show upgrade prompt for Explorer/Normie

**Milestone:** ✅ Developers can create simple recipes visually

---

## Week 7: YAML Editor + Export

### YAML Editor
- [ ] Monaco editor integration
- [ ] Amplifier YAML syntax highlighting
- [ ] Live validation
- [ ] Error highlighting
- [ ] Bi-directional sync with visual builder

### Export
- [ ] Download as YAML file
- [ ] Copy to clipboard
- [ ] "Share" button (URL with YAML in query param)

### Validation API
- [ ] `/api/validate` endpoint
- [ ] Recipe schema validation
- [ ] Bundle schema validation
- [ ] Friendly error messages

**Milestone:** ✅ Developers can create, edit, and export recipes

---

## Success Criteria

- [ ] 200+ users total
- [ ] 500+ recipe executions
- [ ] 20+ custom recipes created
- [ ] Tutorial completion rate > 60%
- [ ] < 5 seconds average execution start time

---

## Notes

- This phase adds real value for developers
- Visual builder is complex - start simple
- Export is critical - users need to take work elsewhere
