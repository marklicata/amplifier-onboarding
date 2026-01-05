Below is a **clean mental model** for:

1.  **Skills vs Bundles vs Recipes** — what each is, how they differ, how they compose.
2.  **Well‑lit paths** — a coherent default system for *non‑technical*, *technical*, *developer*, and *super‑dev* audiences.

# **1. Skills, Bundles, Recipes — The Clean Model**

Think of these as *three layers of “how work happens”* inside the Amplifier ecosystem.  
They differ by **abstraction**, **scope**, and **when the model calls them**.

## **A. Skills — “Capabilities” (small, atomic, reusable)**

**What they are:**

*   Small, focused tools or behaviors (“verbs”).
*   Provide *capability*, not flow.
*   Usually thin wrappers over APIs, file operations, frameworks, testing, Git, etc.
*   They do **one thing well** (e.g., run curl, parse logs, start a Playwright test, call a backend endpoint).

**Primary value:**

*   Expand the agent’s usable toolset.
*   Allow modular capability loading.

**Analogy:**  
🔧 *Individual tools in a toolbox.*

**Good for:**

*   Adding new powers quickly.
*   Sharing reusable functionality across bundles.

## **B. Bundles — “Personalities + Context + Tools” (the execution environment)**

**What they are:**

*   A *collection* of tools, skills, domain knowledge, instructions, and behavior.
*   Define **how** the agent thinks, what it knows, and what it can use.
*   Load at runtime and shape the entire UX.

**Primary value:**

*   Provide a coherent “mode” or “experience.”
*   E.g., foundation bundle, expert bundles, delegation bundle, repo‑expert bundles.

**A bundle includes:**

*   Skills (capabilities)
*   Context files
*   Behavioral instructions
*   Default planning strategies
*   Tooling constraints (e.g., delegation‑only)

**Analogy:**  
🧩 *A configured environment or persona — like choosing “Photoshop workspace: Photography vs Motion Graphics.”*

**Good for:**

*   Defining a repeatable experience (dev, super‑dev, normie).
*   Encapsulating domain experts (core-expert, repo-expert).
*   Creating defaults.

## **C. Recipes — “Programs” (multi-step procedural flows)**

**What they are:**

*   Orchestrated, multi-step sequences built on top of bundles.
*   Choose when/how to use tools, skills, other agents.
*   Structured automation patterns: audits, migrations, refactors, context cleaning.

**Primary value:**

*   Make complex tasks deterministic and repeatable.
*   Capture institutional knowledge.

**Analogy:**  
📜 *A script or playbook (“Here’s exactly how to do a 10-step workflow”).*

**Good for:**

*   Long-running structured work (repo audits, refactor → test → validate loops).
*   Turning expert knowledge into repeatable flows.

# **D. How They Compose (The Stack)**

           ┌────────────────────────────────────┐
           │            RECIPES                 │
           │   “Do X using these tools in       │
           │    this multi-step sequence.”      │
           └────────────────────────────────────┘
                     ▲ built on
           ┌────────────────────────────────────┐
           │             BUNDLES                │
           │  “Here is your brain, tools,       │
           │   behaviors, and context.”         │
           └────────────────────────────────────┘
                     ▲ includes
           ┌────────────────────────────────────┐
           │             SKILLS                 │
           │   “Atomic capabilities or tools.”  │
           └────────────────────────────────────┘

**In one sentence:**

> *Skills give powers, bundles shape the mind, recipes choreograph long-form behavior.*

# **2. Well‑Lit Paths for Different Audiences**

This is where your PM instincts shine.  
Here’s a clean, scalable framework for **default profiles/modes**.

We design four “experiences” based on *intent*, *ability*, and *comfort with autonomy*.

# **A. Non‑Technical Users — “Normie Mode”**

**Goal:**  
Get value without knowing repos, bundles, or commands.

**Defaults:**

*   Foundation bundle (simplified)
*   Skills: high-level (file upload, summarize, plan, translate, explain)
*   Recipes: safe, guided workflows (e.g., “walk me through what happened in this project”)
*   Guardrails: high
*   Delegation: high (agent does more automatically)

**UX characteristics:**

*   Natural language front-door (“Tell me your intent”)
*   No repo knowledge required
*   Automatic scaffolding (“It looks like you want to X — here are next steps”)

**Analogy:**  
🧭 *Google Maps default mode.*

# **B. Technical (but not dev) — “Explorer Mode”**

**Goal:**  
Enable analysts, PMs, designers, QA, etc., to inspect systems and run structured tasks.

**Defaults:**

*   Foundation bundle + domain‑specific bundles (design-intelligence, analysis, explorer)
*   Skills: grep, file-read, scenario analysis, structured audit tools
*   Recipes: context audit, design/requirements extraction, test-plan creation
*   Guardrails: medium
*   Delegation: medium-high

**UX characteristics:**

*   “Investigate,” “Explain,” “Extract” tasks
*   Ability to point at repos but not modify without confirmation
*   Reusable analysis presets (“Design audit,” “Code smell detector”)

**Analogy:**  
🕵️ *A guided inspection toolkit.*

# **C. Developers — “Developer Mode”**

**Goal:**  
Give developers a powerful assistant for real work without overwhelming them.

**Defaults:**

*   Foundation bundle + repo-expert bundle + language LSP bundle
*   Skills: git, bash, language server, test runners, build runners
*   Recipes: refactor, code migration, diff analysis, context poison removal
*   Guardrails: low-medium
*   Delegation: medium
*   Safety: emphasize reversible actions only

**UX characteristics:**

*   Understands repo architecture
*   Suggests fixes, generates tests, inspects diffs
*   Can perform multi-step refactors with human-in-loop

**Analogy:**  
🛠️ *VSCode with extensions preloaded.*

# **D. Super‑Devs — “Expert Mode” (Marc/Brian-level)**

**Goal:**  
Expose the system’s full power with minimal constraints.

**Defaults:**

*   Foundation bundle + all expert bundles (core-expert, foundation-expert, agent-expert)
*   Skills: full toolchain, debugging, orchestrator-level abilities
*   Recipes: full automation pipelines, multi-repo audits, multi-agent orchestrations
*   Guardrails: near-zero
*   Delegation: high (agent can recursively spawn work)

**UX characteristics:**

*   Deep code navigation
*   Can spawn subagent sessions
*   Rarely asks for confirmation
*   Ideal for “fix everything in this repo,” “migrate X to Y,” “analyze cross-repo patterns”

**Analogy:**  
🚀 *Linux root with LSP + AI orchestrator.*

# **3. Tying It Together Into Cohesive Defaults**

To make this system “well‑lit”:

### **A. Provide user-facing “Modes” mapped 1:1 to bundles**

    - normie
    - explorer
    - developer
    - expert

### **B. Each mode = predefined bundle loadouts**

Example:

    normie:
      bundles: [foundation-lite]
      skills: [nlp, summarizer, planner]
      recipes: [guided-analysis]

    developer:
      bundles: [foundation, repo-expert, language-lsp]
      skills: [bash, git, tests]
      recipes: [refactor, migrate, audit]

### **C. On first run, ask lightweight questions:**

*   “Do you want simple explanations or deep technical detail?”
*   “Do you want the model to act mostly on its own?”

→ Auto-select a mode.

# **4. What You Should Drive (Your PM Levers)**

### **1. Clarify the conceptual relationship (this model) and get buy-in**

This alone will align engineering and design.

### **2. Define the four default modes (normie → expert)**

This becomes part of the onboarding flow.

### **3. Create a mapping document: “Which bundles belong to which modes?”**

This is the missing artifact the team keeps asking for.

### **4. Define the 2–3 canonical recipes per mode**

This will give coherence and demonstrate value instantly.

### **5. Push for default behavior that orients users**

E.g., on start:

> “I’ve loaded the Developer Mode bundle. Want me to show what changed in your repo?”

# **If you want, I can produce next:**

*   A **visual diagram** of the full ecosystem
*   A **spec for the four user modes**
*   A **bundle/skills matrix** showing what’s included where
*   A **product brief for leadership (‘Amplifier Experience Model’)**
