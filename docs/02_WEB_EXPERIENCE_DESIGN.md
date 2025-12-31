# Web Experience Design

## Overview

A GitHub Pages-deployable web experience that serves as both **showcase** and **sandbox** for Amplifier. Users discover capabilities through interaction, not documentation.

---

## Site Architecture

### Homepage
**Purpose:** Create instant intrigue and challenge assumptions

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ HERO: Autoplay video (30 sec, muted)           │
│ "Watch a multi-agent workflow execute"         │
│                                                 │
│ [Try It Live]  [Learn More]                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ VALUE PROPS (3 columns)                         │
│                                                 │
│  [Icon: Recipe]     [Icon: Blocks]  [Icon: 🚀] │
│  Declarative        Composable      Production  │
│  Workflows          Architecture    Ready       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ LIVE DEMO: Recipe Playground (embedded)         │
│                                                 │
│ Select a recipe: [Dropdown: Code Review ▼]     │
│                                                 │
│ [▶ Execute]                                     │
│                                                 │
│ [Real-time execution visualization]             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ HOW IT WORKS (Visual diagram)                   │
│                                                 │
│ Recipe → Agents → Tools → Results               │
│   ↓        ↓       ↓        ↓                   │
│ [Learn Each Primitive]                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ TESTIMONIALS / SOCIAL PROOF                     │
│                                                 │
│ "This changed how I think about AI"             │
│ - Developer testimonials                        │
│                                                 │
│ GitHub stats: ⭐ Stars | 🍴 Forks               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ GET STARTED                                     │
│                                                 │
│ [Explore Recipes] [Build Your Own] [Install]   │
└─────────────────────────────────────────────────┘
```

---

### Recipe Playground
**Purpose:** Let users experience Amplifier without installation

**Features:**

1. **Recipe Gallery** (Left Sidebar)
   - Categorized recipes with descriptions
   - Difficulty indicators (Beginner/Intermediate/Advanced)
   - Estimated execution time
   - Preview YAML on hover

2. **Recipe Editor** (Center Panel)
   - Live YAML editor with syntax highlighting
   - Inline documentation tooltips
   - Template variables clearly marked
   - "Fork this recipe" button

3. **Execution View** (Right Panel)
   - Real-time step-by-step visualization
   - Agent invocations shown with avatars
   - Tool calls logged with inputs/outputs
   - Context accumulation displayed
   - Pausable/resumable execution

4. **Results Panel** (Bottom Drawer)
   - Formatted output
   - Download results
   - Share link to execution
   - "Use as template" button

**Technical Approach:**
- Backend: Hosted Amplifier API (sandboxed execution)
- Frontend: React with real-time WebSocket updates
- Storage: Temporary sessions (24hr expiry)
- Rate limiting: Per-IP limits for abuse prevention

---

### Learning Hub
**Purpose:** Build mental models through interactive education

**Section 1: Primitives Tutorial**
```
Interactive walkthrough with live code:

1. What is a Bundle?
   - Visual: Lego blocks combining
   - Code: Show bundle.yaml with annotations
   - Try it: Modify a bundle, see result

2. What is a Recipe?
   - Visual: Flowchart of steps
   - Code: Show recipe YAML
   - Try it: Add a step, execute

3. What are Agents?
   - Visual: Specialized workers
   - Code: Agent definition
   - Try it: Swap agents, compare results

4. What are Modules?
   - Visual: Pluggable components
   - Code: Module structure
   - Try it: Enable/disable modules

Each tutorial: 5-10 minutes
Progress saved across visits
Quiz at end to test understanding
Certificate of completion (shareable)
```

**Section 2: Build Your First Recipe**
```
Guided, step-by-step builder:

1. "What do you want to accomplish?"
   - Dropdown of common patterns
   - Free text for custom ideas

2. "Choose your agents"
   - Visual picker with descriptions
   - Smart suggestions based on goal

3. "Define your steps"
   - Drag-drop step builder
   - Context flow visualization
   - Conditional logic helpers

4. "Configure parameters"
   - Form-based input for variables
   - Validation and examples

5. "Test your recipe"
   - Sample input provided
   - Execute in sandbox
   - Iterate if needed

6. "Save and share"
   - Export YAML
   - Publish to community gallery
   - Get shareable link
```

**Section 3: Advanced Topics**
- Custom agents
- Module development
- Bundle composition patterns
- Hook system for observability
- Production deployment

---

### Builder Studio
**Purpose:** Visual tools for creating Amplifier artifacts

**Recipe Builder:**
- Node-based flow editor (like Node-RED)
- Drag agents onto canvas
- Connect with context flow arrows
- Properties panel for configuration
- Real-time YAML preview
- "Export" and "Deploy" buttons

**Bundle Builder:**
- Form-based configuration
- Module picker with search/filter
- Provider configuration wizard
- Instructions editor with markdown preview
- Composition preview (shows inheritance)

**Agent Builder:**
- Template selector (fork from foundation)
- Instruction editor with AI assistance
- Provider configuration
- Tool selection
- Test harness

**Module Builder:**
- Scaffold generator (creates boilerplate)
- Mount protocol guide
- Contract validation
- Test runner integration

---

### Community Gallery
**Purpose:** Discover and share recipes/bundles/modules

**Features:**
- Search and filter by category/difficulty/popularity
- User profiles and reputation
- Comments and ratings
- Fork count and usage stats
- Version history
- "Featured" and "Trending" sections
- One-click import to Builder Studio

**Categories:**
- Code Quality (reviews, linting, refactoring)
- Documentation (generation, translation)
- Testing (coverage, e2e, fuzzing)
- Security (audits, dependency scanning)
- Data Processing (ETL, analysis, reports)
- Content Creation (writing, design, video)
- DevOps (deployment, monitoring)
- Custom Workflows

---

### Documentation Site
**Purpose:** Comprehensive reference for builders

**Structure:**
- Getting Started (installation, first recipe)
- Core Concepts (detailed explanations)
- API Reference (complete module contracts)
- Cookbook (common patterns and solutions)
- Best Practices (production considerations)
- Troubleshooting (common issues and fixes)

**Features:**
- Searchable
- Code examples in every section
- Copy-paste ready snippets
- Version selector
- "Edit on GitHub" links

---

## User Flows

### Flow 1: First-Time Visitor → Recipe Execution
```
1. Land on homepage
2. Watch hero video (30 sec)
3. Scroll to embedded playground
4. Click "Select a recipe" → Choose "Code Review"
5. Click "Execute" with default sample
6. Watch real-time execution (90 sec)
7. View results in drawer
8. Click "How did this work?" → Learning Hub
```
**Time to value: 3 minutes**

---

### Flow 2: Developer → Custom Recipe
```
1. Click "Build Your Own" from homepage
2. Choose "I want to analyze code quality"
3. Guided builder suggests: zen-architect, bug-hunter
4. Add steps: Analyze → Find Issues → Suggest Fixes
5. Configure parameters: language=Python, severity=high
6. Test with own code (paste or upload)
7. Execute and see results
8. Export YAML
9. "Install Amplifier to run locally"
```
**Time to custom recipe: 15 minutes**

---

### Flow 3: Leader → Team Adoption
```
1. Read "For Teams" page
2. See standardization benefits
3. Watch "Bundle Composition" tutorial
4. Download team bundle template
5. Customize for org (add approval hooks, logging)
6. Test with team sample workflow
7. Publish to internal registry
8. Share onboarding guide with team
```
**Time to team setup: 1 hour**

---

## Design System

### Visual Language
**Concept:** "Modular Intelligence"

**Colors:**
- Primary: Electric Blue (#0078D4) - Trust, technology
- Secondary: Vibrant Purple (#8B5CF6) - Creativity, intelligence
- Accent: Energetic Orange (#FF6B35) - Action, results
- Neutrals: Clean grays (#F5F5F5 → #1A1A1A)

**Typography:**
- Headers: Inter Bold (modern, clean)
- Body: Inter Regular (readable, professional)
- Code: JetBrains Mono (developer-friendly)

**Iconography:**
- Recipe: 📋 Clipboard with checklist
- Agent: 🤖 Robot avatar with role indicator
- Bundle: 📦 Package with layers
- Module: 🔌 Plug with connection points
- Tool: 🔧 Wrench for capabilities
- Hook: 🪝 Hook for observability

**Animations:**
- Context flow: Particles flowing between steps
- Agent execution: Pulsing avatar with progress ring
- Tool invocation: Flash + result badge
- Success: Confetti burst
- Execution: Smooth scrolling step reveal

---

## Technical Implementation

### Stack Recommendations

**Frontend:**
- Framework: Next.js (React with SSR)
- Styling: Tailwind CSS
- Components: Shadcn/ui
- Editor: Monaco Editor (VS Code editor component)
- Visualization: React Flow (for recipe diagrams)
- Animation: Framer Motion

**Backend:**
- API: Python FastAPI
- Execution: Amplifier Core (sandboxed)
- Queue: Redis for job management
- Database: PostgreSQL (user data, gallery)
- Storage: S3-compatible (recipes, logs)

**Infrastructure:**
- Hosting: GitHub Pages (static) + API on cloud
- CDN: Cloudflare
- Auth: GitHub OAuth
- Analytics: Plausible (privacy-friendly)

**Development:**
- Monorepo: Turborepo or Nx
- Testing: Playwright (e2e), Jest (unit)
- CI/CD: GitHub Actions
- Deployment: Vercel (frontend), Fly.io (backend)

---

## Mobile Considerations

**Responsive Breakpoints:**
- Desktop: Full experience
- Tablet: Stacked panels, touch-friendly
- Mobile: Gallery browsing, results viewing (no editing)

**Mobile-First Features:**
- Recipe gallery browsing
- Execution status monitoring
- Results viewing
- Tutorial consumption
- Community discovery

**Progressive Enhancement:**
- Core experience works without JS
- Enhanced interactivity with JS enabled
- Offline recipe viewing (PWA)

---

## Accessibility

**WCAG 2.1 AA Compliance:**
- Keyboard navigation throughout
- Screen reader annotations
- High contrast mode
- Focus indicators
- Alt text for all visuals
- Captions for videos

**Developer Accessibility:**
- Code examples in multiple formats
- Audio descriptions for complex visualizations
- Adjustable font sizes
- Reduced motion option

---

## Analytics & Metrics

**Track:**
- Page views and time on site
- Recipe executions (which ones, success rate)
- Builder usage (created vs completed)
- Tutorial completion rates
- Community engagement (uploads, forks, ratings)
- Conversion to local installation

**A/B Tests:**
- Hero video vs static hero
- Guided builder vs freeform
- Recipe categories and naming
- CTA button copy
- Tutorial length and format

---

## Content Management

**Static Content:**
- Documentation in Markdown (GitHub repo)
- Tutorials as JSON (versioned)
- Examples in YAML (validated)

**Dynamic Content:**
- Community recipes (database)
- User profiles (database)
- Comments and ratings (database)
- Execution logs (temporary storage)

**Update Strategy:**
- Documentation: Git-based workflow
- Examples: PR review process
- Community: Moderation queue
- Analytics: Real-time dashboards

---

## Launch Strategy

### Soft Launch (Internal)
- Microsoft employees only
- Gather feedback on UX
- Identify bugs and rough edges
- Iterate on tutorials

### Beta Launch (Public)
- Open to anyone with GitHub account
- Waitlist for early access (creates FOMO)
- Limited recipe executions (prevent abuse)
- Active community management

### Full Launch (GA)
- Remove restrictions
- Press outreach (TechCrunch, HN, etc.)
- Conference talks and demos
- Integration with existing Microsoft tools

---

## Success Indicators

**Week 1:**
- 1,000+ unique visitors
- 500+ recipe executions
- 50+ custom recipes created
- 10+ community uploads

**Month 1:**
- 10,000+ visitors
- 5,000+ executions
- 500+ custom recipes
- 100+ GitHub stars

**Quarter 1:**
- 50,000+ visitors
- Recognizable brand in AI dev space
- Active community forum
- Integration requests from companies
