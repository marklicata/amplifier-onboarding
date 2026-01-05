# Amplifier Audiences & User Modes

## Overview

Amplifier serves four distinct audiences, each with different levels of technical capability and different needs. Rather than forcing everyone through the same journey, we provide **mode-based experiences** that meet users where they are.

---

## The Four Modes

### 1. Normie Mode
**Audience:** Non-technical users who want to accomplish tasks without coding

**Characteristics:**
- Limited or no programming experience
- Wants to get value without understanding the internals
- Needs high-level, guided experiences
- Comfortable with tools like Notion, Zapier, or no-code platforms

**Goals:**
- Accomplish specific tasks quickly
- Understand what's possible without technical depth
- Use pre-built solutions with minimal configuration

**Amplifier Experience:**
- **Can Run:** Pre-built bundles with simple prompts
- **Can Run:** Pre-configured recipes with minimal inputs
- **Configuration:** Minimal (just provide inputs/prompts)
- **Guardrails:** High (safe, tested workflows only)
- **Cannot:** Create or edit recipes/bundles/skills

**Example Use Cases:**
- Run "Code Review" recipe on a file
- Run "Documentation Generator" bundle with a prompt
- Execute "Test Coverage Analysis" recipe on a project

**Success Metric:** Can accomplish a task in under 5 minutes without technical help

---

### 2. Explorer Mode
**Audience:** Technical but non-developer (PMs, designers, analysts, QA)

**Characteristics:**
- Technical literacy but doesn't write code daily
- Understands systems and workflows
- Wants to inspect, analyze, and understand
- Comfortable with structured tools and processes

**Goals:**
- Investigate systems and extract insights
- Run structured analysis tasks
- Understand how things work without modifying them
- Create lightweight automation

**Amplifier Experience:**
- **Can Run:** Pre-built bundles with more configuration options
- **Can Run:** Pre-configured recipes with custom inputs
- **Configuration:** Medium (can adjust bundle settings, recipe parameters)
- **Guardrails:** Medium (more control over execution)
- **Cannot:** Create recipes/bundles/skills from scratch

**Example Use Cases:**
- Run "Codebase Audit" recipe with custom analysis rules
- Configure bundle to focus on specific file patterns
- Execute "API Documentation" with custom output format
- Run "Dependency Analysis" with version constraints

**Success Metric:** Can investigate and extract insights independently

---

### 3. Developer Mode
**Audience:** Software developers who want AI assistance for real work

**Characteristics:**
- Professional developers
- Writes code daily
- Wants powerful tools without overwhelming complexity
- Values reversible actions and clear explanations

**Goals:**
- Get AI assistance for development tasks
- Automate repetitive workflows
- Build custom solutions for their projects
- Maintain control while leveraging AI power

**Amplifier Experience:**
- **Can Run:** Any bundle or recipe with full configuration
- **Can Create:** Custom recipes from scratch (visual + YAML editor)
- **Can Create:** Custom bundles (compose from existing skills)
- **Configuration:** Full control over execution parameters
- **Guardrails:** Low (trusted to know what they're doing)
- **Cannot:** Create custom skills (that's Expert territory)

**Example Use Cases:**
- Create custom "Migration Workflow" recipe for their stack
- Compose specialized bundle for team's development process
- Build "Code Review" recipe with company standards
- Design multi-step orchestration for deployment prep

**Success Metric:** Completes development tasks faster with AI assistance

---

### 4. Expert Mode
**Audience:** Power users, architects, and AI/automation specialists

**Characteristics:**
- Deep technical expertise
- Understands Amplifier's architecture
- Wants maximum power and flexibility
- Comfortable with complex systems
- May be building on top of Amplifier

**Goals:**
- Access full Amplifier capabilities
- Create custom bundles, recipes, and modules
- Build sophisticated multi-agent workflows
- Extend and customize the platform

**Amplifier Experience:**
- **Can Run:** Anything
- **Can Create:** Recipes, bundles, AND custom skills
- **Can Create:** Advanced multi-agent orchestrations
- **Configuration:** Complete control, no restrictions
- **Guardrails:** None (full power)
- **Can Export:** Skills as Python modules for distribution

**Example Use Cases:**
- Create custom skill for proprietary internal tools
- Build sophisticated multi-agent workflows
- Design custom bundle architecture for enterprise
- Develop reusable skill modules for team

**Success Metric:** Builds and deploys custom Amplifier solutions

---

## Mode Transitions

Users naturally progress through modes as they gain expertise:

```
Normie → Explorer → Developer → Expert
```

**Key Principles:**
1. **No forced progression** - Users can start at any mode appropriate for their skills
2. **Easy upgrades** - Discovering advanced features should be friction-free
3. **No downgrade penalty** - Can always return to simpler modes for specific tasks
4. **Mode switching** - Users may use different modes for different contexts

**Transition Triggers:**
- **Normie → Explorer:** User asks "how does this work?" or wants to customize
- **Explorer → Developer:** User wants to create/modify rather than just inspect
- **Developer → Expert:** User wants to build custom bundles or orchestrate complex workflows

---

## Mode Selection

### On First Use

Present a simple choice:

**"What brings you to Amplifier?"**

- 🎯 **Get things done** → Normie Mode
  - "I want to use AI for specific tasks"

- 🔍 **Explore and analyze** → Explorer Mode
  - "I want to investigate and understand systems"

- 💻 **Build and develop** → Developer Mode
  - "I'm a developer looking for AI assistance"

- 🚀 **Customize and extend** → Expert Mode
  - "I want full control and advanced capabilities"

### Progressive Disclosure

As users work, suggest mode upgrades when appropriate:

> "💡 You're using several advanced features. Would you like to switch to Developer Mode for more capabilities?"

### Mode Indicators

Always show current mode clearly:
- In CLI: Status line shows current mode
- In web: Mode badge in header
- In docs: Mode-specific content highlighted

---

## What Each Mode Can Do

### Normie Mode: **Run Only**
✅ Run pre-built recipes (with simple inputs)
✅ Run bundles with prompts (basic configuration)
❌ Cannot create or edit anything
**Focus:** Get value quickly without technical depth

### Explorer Mode: **Run + Configure**
✅ Everything Normie can do
✅ Configure recipes (advanced parameters)
✅ Configure bundles (custom settings)
❌ Cannot create recipes/bundles/skills
**Focus:** More control over execution without building

### Developer Mode: **Run + Configure + Create Workflows**
✅ Everything Explorer can do
✅ Create custom recipes (visual + YAML)
✅ Compose custom bundles (from existing skills)
✅ Export recipes/bundles for local use
❌ Cannot create custom skills
**Focus:** Build reusable workflows and configurations

### Expert Mode: **Everything**
✅ Everything Developer can do
✅ Create custom skills (Python modules)
✅ Advanced orchestrations
✅ Export skills as distributable modules
**Focus:** Extend the platform itself

---

## Success Metrics by Mode

### Normie Mode
- Time to first successful task completion
- Task success rate
- Return usage within 7 days

### Explorer Mode
- Number of investigations completed
- Insights extracted per session
- Sharing of findings with team

### Developer Mode
- Development tasks completed per week
- Code quality improvements
- Custom recipes created

### Expert Mode
- Custom bundles/modules created
- Complex workflows orchestrated
- Contributions to Amplifier ecosystem

---

## Implementation Notes

### Authentication & Rate Limiting

**GitHub OAuth:**
- Users must sign in with GitHub to use Playground
- Rate limits tied to GitHub user ID
- No session persistence - ephemeral usage only

**Rate Limits by Mode:**
- Normie: 20 executions/hour
- Explorer: 40 executions/hour
- Developer: 100 executions/hour
- Expert: 200 executions/hour

### Mode Detection & Selection

**On First Visit:**
- User selects mode during GitHub OAuth
- Can change mode anytime in settings
- Mode stored in JWT token (no server-side persistence)

**Feature Gating:**
```typescript
// UI shows/hides features based on mode
const canCreateRecipes = ['developer', 'expert'].includes(userMode);
const canCreateSkills = userMode === 'expert';
```

### No Persistence

**What We DON'T Store:**
- User sessions
- Created recipes/bundles/skills
- Execution history
- User workspaces

**What Users CAN Do:**
- Download/export their creations locally
- Copy YAML to clipboard
- Export skills as Python modules

**What We DO Store (Analytics Only):**
- Usage events (views, clicks, executions)
- Anonymous metrics
- No PII beyond GitHub OAuth

---

## Open Questions

1. **Default Mode:** Should first-time users start in Normie or be required to choose?
2. **Auto-detection:** Can we detect mode from user's actions/queries?
3. **Mode persistence:** Per-project or global user preference?
4. **Mixed teams:** How do teams with mixed skill levels collaborate?

---

## Next Steps

1. Define exact bundle compositions for each mode
2. Create mode-specific recipe catalogs
3. Design mode selection UI/UX
4. Implement mode switching mechanism
5. Write mode-specific documentation and examples
