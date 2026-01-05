# Information Architecture

## Overview

The Amplifier web experience is organized into **four main sections**, with the Playground serving as the primary interaction hub where ALL users can run sessions and advanced users can create.

---

## Site Structure

```
amplifier.dev/
├── Home (One-Pager)
├── Learn (Crash Course)
├── Playground (Try & Build)
│   ├── Gallery
│   ├── Studio
│   ├── Sessions
│   └── Community
└── Resources (Docs & GitHub)
```

---

## 1. Home (The One-Pager)

**URL:** `/`

**Purpose:** Hook visitors and get them to the Playground in under 30 seconds

**Content:**
- Hero: "Program Intelligence, Not Just Code" with auto-playing demo video
- Value props: What makes Amplifier different (3 cards)
- Mode selection: "What describes you?" → 4 choices
- Primary CTA: "Try the Playground →"
- Social proof: GitHub stars, community stats
- Secondary CTA: "Learn How It Works →"

**User Flow:**
```
Land → Watch 15-second demo → Select mode → Click "Try Playground" → Playground
```

**Design Notes:**
- Minimal, fast-loading
- No navigation overwhelm
- Single-page scroll
- Clear CTAs throughout

---

## 2. Learn (The Crash Course)

**URL:** `/learn`

**Purpose:** Build mental models and understanding before diving into Playground

**Sub-sections:**

### 2.1 Overview (`/learn`)
- What is Amplifier?
- How does it work? (visual architecture)
- Why declarative AI workflows?
- Quick demo video (3 min)

### 2.2 Core Concepts (`/learn/concepts`)
- Bundles (configuration packages)
- Skills (atomic capabilities)
- Recipes (declarative workflows)
- Agents (specialized AI configurations)
- How they compose

### 2.3 Interactive Tutorials (`/learn/tutorials`)
**All Modes:**
- "Run Your First Recipe" (5 min)
- "Understanding Context Flow" (5 min)

**Explorer+:**
- "Exploring a Codebase" (10 min)
- "Running an Analysis Workflow" (10 min)

**Developer+:**
- "Create a Custom Recipe" (15 min)
- "Compose Your Own Bundle" (15 min)

**Expert Only:**
- "Build a Custom Skill" (20 min)
- "Multi-Agent Orchestration" (25 min)

### 2.4 Video Walkthroughs (`/learn/videos`)
- What is Amplifier? (2 min)
- See it in action (3 min)
- Building your first recipe (5 min)
- Advanced use cases (8 min)

### 2.5 Architecture Deep-Dive (`/learn/architecture`)
- Technical architecture guide
- Module system explained
- Bundle composition patterns
- For developers/experts

**Navigation:**
- Progress tracking for tutorials
- "Try this in Playground →" links throughout
- Mode-based content filtering

---

## 3. Playground (The Heart)

**URL:** `/playground`

**Purpose:** The primary interaction hub where users run, explore, and create

This section adapts heavily based on user mode. Layout:

```
┌─────────────────────────────────────────────────────┐
│ Header: Logo | Mode Badge | My Account | Sign In   │
├─────────────────────────────────────────────────────┤
│ Tabs: Gallery | Studio | Sessions | Community      │
├─────────────────────────────────────────────────────┤
│                                                     │
│             [Tab Content Area]                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3.1 Gallery (`/playground/gallery`)

**Purpose:** Discover and run pre-built content

**All Modes Can:**
- Browse recipes, bundles, skills
- Filter by category, complexity, mode
- View details and documentation
- **Run in browser** (primary action)
- See execution results
- Save to "My Work"

**Content Cards:**
```
┌──────────────────────────────────┐
│ 📋 Recipe: Code Review           │
│                                  │
│ Multi-agent code analysis        │
│                                  │
│ 🔵 For: Developer Mode           │
│ ⏱️ Duration: ~3 min             │
│                                  │
│ [▶️ Run] [👁️ View] [⭐ Save]    │
└──────────────────────────────────┘
```

**Categories:**
- Recipes (workflows)
- Bundles (configurations)
- Skills (individual capabilities)

**Filters:**
- By mode (Normie, Explorer, Developer, Expert)
- By category (Analysis, Development, DevOps, etc.)
- By complexity (Simple, Intermediate, Advanced)
- By popularity (Most used, Trending, New)

**Running Content:**
When user clicks "Run":
1. Opens execution panel (right sidebar or modal)
2. Shows configuration form (if inputs needed)
3. Streams execution in real-time
4. Displays results
5. Option to fork/customize

### 3.2 Studio (`/playground/studio`)

**Purpose:** Create and edit recipes, bundles, and skills

**Tab Layout:**
```
┌─────────────────────────────────────────┐
│ What do you want to create?            │
│ • Recipe (workflow)                     │
│ • Bundle (configuration) [Developer+]   │
│ • Skill (capability) [Expert only]     │
└─────────────────────────────────────────┘
```

#### 3.2.1 Recipe Builder (All Modes)

**Visual Builder:**
```
┌──────────────┬────────────────────────┬───────────────┐
│              │                        │               │
│  Components  │       Canvas           │  Properties   │
│  Palette     │                        │  Panel        │
│              │   ┌─────────┐          │               │
│  🤖 Agents   │   │ Step 1  │          │  Step: Analyze│
│  ✓ explorer  │   │ Analyze │          │               │
│  ✓ zen-arch  │   └────┬────┘          │  Agent:       │
│              │        │                │  [zen...▼]    │
│  📚 Skills   │        ↓                │               │
│  ✓ grep      │   ┌─────────┐          │  Prompt:      │
│  ✓ read      │   │ Step 2  │          │  [.........]  │
│              │   │ Report  │          │               │
│              │   └─────────┘          │  Output:      │
│  [+ Add]     │                        │  [analysis]   │
│              │   [+ Add Step]         │               │
│              │                        │  [Test Step]  │
└──────────────┴────────────────────────┴───────────────┘
```

**YAML Editor Mode:**
- Monaco editor with syntax highlighting
- Live validation
- Context variable autocomplete
- Side-by-side with visual builder

**Features:**
- Drag-and-drop step creation
- Live preview
- Test execution
- Save & share
- Fork existing recipes

**Complexity by Mode:**
- **Normie:** Simple sequential steps only
- **Explorer:** Add conditionals, basic loops
- **Developer:** Full control, parallel execution, error handling
- **Expert:** Advanced orchestration, sub-recipes, dynamic flows

#### 3.2.2 Bundle Composer (Developer+)

**Interface:**
```
┌─────────────────────────────────────────┐
│ Bundle: my-team-bundle                  │
├─────────────────────────────────────────┤
│                                         │
│ Includes:                               │
│ ☑ foundation                            │
│ ☐ amplifier-bundle-recipes              │
│                                         │
│ Providers:                              │
│ • Anthropic (Claude Sonnet 4.5)        │
│                                         │
│ Skills: (inherited + custom)            │
│ ✓ filesystem                            │
│ ✓ bash                                  │
│ + Add custom skill                      │
│                                         │
│ Agents: (select from foundation)        │
│ ✓ zen-architect                         │
│ ✓ bug-hunter                            │
│                                         │
│ Instructions:                           │
│ [Markdown editor for system prompt]    │
│                                         │
│ [Preview YAML] [Test] [Save]           │
└─────────────────────────────────────────┘
```

**Features:**
- Visual bundle composition
- Inheritance preview (see what you get from foundation)
- Configuration overrides
- YAML export
- Test in sandbox

#### 3.2.3 Skill Creator (Expert Only)

**Interface:**
```
┌─────────────────────────────────────────┐
│ Create Skill                            │
├─────────────────────────────────────────┤
│                                         │
│ Skill Name: [my-custom-skill]          │
│                                         │
│ Type:                                   │
│ ○ Tool (agent capability)               │
│ ○ Hook (observability/control)          │
│                                         │
│ Description:                            │
│ [What this skill does...]              │
│                                         │
│ Implementation:                         │
│ [Python code editor with mount()]      │
│                                         │
│ Configuration Schema:                   │
│ [JSON Schema editor]                   │
│                                         │
│ [Validate] [Test] [Package] [Share]    │
└─────────────────────────────────────────┘
```

**Features:**
- Code scaffolding
- Contract validation
- Test harness
- Packaging for distribution
- Publishing to community

### 3.3 Sessions (`/playground/sessions`)

**Purpose:** View execution history and manage active sessions

**Layout:**
```
┌─────────────────────────────────────────────┐
│ My Sessions                                 │
├─────────────────────────────────────────────┤
│                                             │
│ Active                                      │
│ ┌─────────────────────────────────────┐   │
│ │ ▶️ Recipe: Code Review              │   │
│ │ Running step 2 of 4...              │   │
│ │ [View] [Pause] [Stop]               │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ Recent                                      │
│ ┌─────────────────────────────────────┐   │
│ │ ✅ Recipe: API Documentation        │   │
│ │ Completed 5 min ago                 │   │
│ │ [View Results] [Re-run]             │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ ┌─────────────────────────────────────┐   │
│ │ ❌ Recipe: Security Audit           │   │
│ │ Failed at step 3 - 2 hours ago      │   │
│ │ [View Logs] [Resume] [Edit Recipe]  │   │
│ └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

**Features:**
- Real-time status updates
- Execution logs
- Results viewer
- Resume failed sessions
- Re-run with different inputs
- Share session results

### 3.4 Community (`/playground/community`)

**Purpose:** Discover, share, and collaborate

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Community Gallery                           │
├─────────────────────────────────────────────┤
│ Filters: [All▼] [Trending▼] [This Week▼]  │
│ Search: [___________________________] 🔍    │
├─────────────────────────────────────────────┤
│                                             │
│ Trending Recipes                            │
│ ┌───────────┬───────────┬───────────┐      │
│ │ Recipe    │ Recipe    │ Recipe    │      │
│ │ Card 1    │ Card 2    │ Card 3    │      │
│ │ ⭐ 234    │ ⭐ 189    │ ⭐ 156    │      │
│ │ 👤 @user  │ 👤 @user  │ 👤 @user  │      │
│ └───────────┴───────────┴───────────┘      │
│                                             │
│ Featured Bundles                            │
│ [Similar grid...]                           │
│                                             │
│ Top Contributors                            │
│ [User avatars with stats]                   │
└─────────────────────────────────────────────┘
```

**Features:**
- Search and discovery
- User profiles
- Comments and ratings
- Fork/remix functionality
- Usage statistics
- Featured content (curated by team)

---

## 4. Resources (Docs & GitHub)

**URL:** `/resources`

**Purpose:** Deep technical resources for builders

**Sub-sections:**

### 4.1 Documentation (`/resources/docs`)
- Getting Started guide
- API Reference (comprehensive)
- Module Contracts
- Best Practices
- Troubleshooting
- FAQ

### 4.2 Repositories (`/resources/repos`)
- Links to all GitHub repos
- Repository descriptions
- Quick links to key files
- Contribution guidelines

### 4.3 Architecture (`/resources/architecture`)
- Complete architecture guide
- Technical specifications
- Design decisions
- Performance considerations

### 4.4 Integration Guides (`/resources/integrations`)
- VS Code integration
- CI/CD pipelines
- Custom deployments
- API usage

---

## Navigation Design

### Global Header
```
┌──────────────────────────────────────────────────────┐
│ 🔷 Amplifier | Learn | Playground | Resources       │
│                                                       │
│                    [🔵 Developer Mode ▼] [@user ▼]   │
└──────────────────────────────────────────────────────┘
```

**Always Visible:**
- Logo (home link)
- Primary sections (Learn, Playground, Resources)
- Mode indicator/switcher
- User menu (if signed in) or Sign In button

### Footer
- About Amplifier
- GitHub
- Community
- Privacy & Terms
- Microsoft branding

---

## User Flows

### First-Time Visitor Flow
```
1. Land on Home
2. Watch demo video (15 sec)
3. Select mode → "Developer"
4. Click "Try Playground"
5. Lands in Gallery
6. Browse recipes
7. Click "Run" on "Code Review"
8. See execution in real-time
9. View results
10. Prompted: "Want to customize this? [Fork to Studio]"
```

### Developer Creating Recipe Flow
```
1. Navigate to Playground → Studio
2. Click "Create Recipe"
3. Visual builder opens
4. Drag "zen-architect" agent to canvas
5. Configure step
6. Add second step
7. Connect steps (context flow)
8. Click "Test"
9. Execution panel shows results
10. Click "Save"
11. Prompted: "Share with community?"
```

### Expert Creating Skill Flow
```
1. Navigate to Playground → Studio
2. Click "Create Skill"
3. Select "Tool" type
4. Code editor opens with template
5. Write mount() function
6. Define configuration schema
7. Click "Validate"
8. Contract validation runs
9. Click "Test"
10. Test harness executes
11. Click "Package"
12. Download or publish to community
```

---

## Mode-Based Progressive Disclosure

### Normie Mode Sees:
- **Gallery:** Simplified recipe cards, "Quick Run" emphasis
- **Studio:** Recipe builder (simplified, templates only)
- **Sessions:** Basic execution history
- **Community:** Browse and star (no creation)

### Explorer Mode Sees:
- **Gallery:** + Analysis-focused recipes
- **Studio:** + Visual recipe builder with conditionals
- **Sessions:** + Detailed logs
- **Community:** + Fork/remix

### Developer Mode Sees:
- **Gallery:** + Development workflows
- **Studio:** + Full recipe builder + Bundle composer
- **Sessions:** + Resume/debug capabilities
- **Community:** + Upload and share

### Expert Mode Sees:
- **Gallery:** + Advanced orchestrations
- **Studio:** + Full suite (Recipe + Bundle + Skill creation)
- **Sessions:** + Full debugging, raw logs
- **Community:** + Publish modules

---

## Key Design Principles

### 1. Playground First
Most valuable actions happen in Playground. Make it easy to get there and stay there.

### 2. Progressive Complexity
Start simple, reveal power as needed. Don't overwhelm but don't hide.

### 3. Universal Execution
Everyone can run. Creation is gated by mode but execution is universal.

### 4. Tight Feedback Loops
Create → Test → See results → Iterate. Keep cycle fast.

### 5. Community as Accelerator
Make it easy to discover, fork, and share. Network effects drive growth.

---

## Mobile Considerations

### Mobile Experience (< 768px)

**Read-Only Focus:**
- Browse gallery
- View executions
- Read documentation
- Watch tutorials

**Limited Creation:**
- Can fork/star
- Can start basic recipes
- Can view sessions

**No Complex Creation:**
- Recipe/bundle/skill creation requires desktop
- Shows "Continue on desktop" prompt

**Responsive Breakpoints:**
- Mobile: < 768px (read-only + basic runs)
- Tablet: 768px - 1024px (includes recipe builder)
- Desktop: > 1024px (full experience)

---

## SEO & URLs

### Clean URL Structure
```
amplifier.dev/
├── /                                    (Home)
├── /learn                               (Learn hub)
│   ├── /learn/tutorials                 (Tutorials)
│   └── /learn/architecture              (Deep dive)
├── /playground                          (Playground hub)
│   ├── /playground/gallery              (Browse)
│   │   ├── /playground/gallery/recipes
│   │   ├── /playground/gallery/bundles
│   │   └── /playground/gallery/skills
│   ├── /playground/studio               (Create)
│   │   ├── /playground/studio/recipe
│   │   ├── /playground/studio/bundle
│   │   └── /playground/studio/skill
│   ├── /playground/sessions             (History)
│   └── /playground/community            (Community)
└── /resources                           (Docs & GitHub)
    ├── /resources/docs
    └── /resources/repos
```

### Shareable URLs
```
/playground/gallery/recipe/code-review-123
/playground/session/abc-def-ghi-789
/playground/community/user/johndoe
```

---

## Next Steps

1. **Wireframes:** Create detailed wireframes for each section
2. **User Testing:** Validate IA with potential users
3. **Technical Feasibility:** Confirm architecture can support this IA
4. **Content Strategy:** Plan content for each section
5. **Implementation:** Phased rollout (Gallery first, then Studio)
