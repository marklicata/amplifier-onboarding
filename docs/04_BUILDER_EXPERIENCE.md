# Builder Experience - Customization Tools

## Philosophy

The builder experience should feel like **discovering you can do magic**. Users start by tweaking examples, gradually understanding the primitives, and eventually building complex systems themselves.

**Guiding Principles:**
1. **Show the YAML** - Always reveal what's being generated
2. **Bi-directional editing** - Visual builder ↔ YAML editor
3. **Instant feedback** - See results immediately
4. **Progressive disclosure** - Start simple, reveal power gradually
5. **Learning by doing** - Every action teaches a concept

---

## The Builder Hierarchy

Users progress through increasing levels of customization:

```
Level 1: Parameter Tweaking
  ↓ ("I can change what it does")
Level 2: Step Modification
  ↓ ("I can change how it works")
Level 3: Recipe Creation
  ↓ ("I can build my own workflows")
Level 4: Agent Customization
  ↓ ("I can create specialized agents")
Level 5: Bundle Composition
  ↓ ("I can package systems")
Level 6: Module Development
  ↓ ("I can extend Amplifier itself")
```

---

## Level 1: Recipe Parameter Editor

**Purpose:** Let users customize existing recipes without understanding internals

### UI Design

```
┌─────────────────────────────────────────────┐
│ Recipe: Comprehensive Code Review           │
│ ⭐ 4.8 (234 reviews) | 🍴 89 forks         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Configure Inputs                            │
├─────────────────────────────────────────────┤
│                                             │
│ File to Review:                             │
│ [Choose File] or [Paste Code]              │
│                                             │
│ Programming Language:                       │
│ [Python ▼]                                  │
│                                             │
│ Focus Areas: (optional)                     │
│ ☑ Security  ☑ Performance  ☐ Style        │
│                                             │
│ Review Depth:                               │
│ ○ Quick  ● Standard  ○ Comprehensive       │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ [Preview YAML]  [▶ Execute]  [Save As...]  │
└─────────────────────────────────────────────┘
```

**Features:**
- Form-based input with validation
- Smart defaults based on context
- Help tooltips for each field
- "Preview YAML" shows generated config
- "Save As..." creates custom variant

**Learning Moment:**
When user clicks "Preview YAML", show side-by-side:
```
Your Choices          →    Recipe YAML
─────────────────────────────────────────────
Language: Python      →    language: "python"
Focus: Security       →    focus_areas: ["security"]
```

---

## Level 2: Visual Recipe Editor

**Purpose:** Drag-and-drop workflow builder for creating custom recipes

### UI Design

**Layout:**
```
┌──────────────┬────────────────────────────────┬───────────────┐
│              │                                │               │
│  Agent       │       Canvas                   │  Properties   │
│  Palette     │                                │  Panel        │
│              │   ┌─────────┐                  │               │
│  🤖 zen-     │   │ Step 1  │                  │  Step: Analyze│
│  architect   │   │ Analyze │                  │               │
│              │   └────┬────┘                  │  Agent:       │
│  🐛 bug-     │        │                       │  [zen...▼]    │
│  hunter      │        │ context flows         │               │
│              │        ↓                       │  Prompt:      │
│  🛡️ security-│   ┌─────────┐                  │  [.........]  │
│  guardian    │   │ Step 2  │                  │               │
│              │   │ Fix     │                  │  Output:      │
│  🔍 explorer │   └─────────┘                  │  [analysis]   │
│              │                                │               │
│  [+ Custom]  │   [+ Add Step]                 │  [Validate]   │
│              │                                │               │
└──────────────┴────────────────────────────────┴───────────────┘
```

### Features

**1. Agent Palette**
- Drag agents onto canvas
- Hover shows agent capabilities
- Color-coded by specialty
- Search/filter agents

**2. Canvas Interactions**
- Drag to add agent as step
- Connect steps to define flow
- Arrows show context passing
- Parallel steps (side-by-side)
- Conditional branches (diamond nodes)
- Loop constructs (foreach)

**3. Step Configuration**
- Click step to open properties
- Prompt editor with variable suggestions
- Output naming
- Conditional logic
- Error handling options

**4. Context Flow Visualization**
- Hover over arrow shows what data flows
- Click to see example values
- Highlight all uses of a variable
- Validate context availability

**5. Real-time Validation**
- Check for missing connections
- Validate variable references
- Ensure output names are unique
- Warn about unused outputs

**6. Test Mode**
- "Try It" button with sample data
- Step-by-step execution preview
- Pause at any step
- Inspect intermediate context

**7. YAML Sync**
- Split-screen mode: Visual ↔ YAML
- Changes in either update the other
- Syntax highlighting in YAML
- Format on save

### Example Interaction Flow

**User wants to create "Python Bug Fixer":**

1. Drag `bug-hunter` from palette to canvas
   - Step automatically created: "Find Bugs"
   - Default prompt populated

2. Configure Step 1:
   - Prompt: "Find bugs in {{file_path}}"
   - Output: "bugs"

3. Drag `modular-builder` from palette
   - Step 2 created: "Fix Issues"
   - Canvas shows arrow: bugs → Step 2

4. Configure Step 2:
   - Prompt: "Fix these bugs: {{bugs}}"
   - Output: "fixed_code"

5. Click "Try It":
   - Upload sample buggy code
   - Watch execution with real-time updates
   - See bugs found and fixes applied

6. Save recipe:
   - Name: "Python Bug Fixer"
   - Description: Auto-generated, editable
   - Tags: python, bugs, automation

7. Share or export:
   - Publish to community gallery
   - Download YAML
   - Copy shareable link

---

## Level 3: Agent Creator

**Purpose:** Customize agent behavior for specialized tasks

### Agent Anatomy

Every agent consists of:
- **Instructions:** System prompt defining behavior
- **Provider Config:** Which LLM and settings
- **Tool Access:** Which capabilities to enable
- **Mode Support:** Different operational modes

### UI Design

```
┌─────────────────────────────────────────────────────────────┐
│ Create Custom Agent                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Agent Name: [Python Expert                              ]  │
│                                                             │
│ Base Template:                                              │
│ [Start from: zen-architect ▼]  or  [Blank Agent]          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Instructions (System Prompt)                                │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐   │
│ │ You are a Python expert specializing in clean,      │   │
│ │ Pythonic code. Your priorities:                     │   │
│ │                                                      │   │
│ │ 1. Follow PEP 8 guidelines                          │   │
│ │ 2. Prefer built-in modules over third-party         │   │
│ │ 3. Write docstrings for all functions               │   │
│ │                                                      │   │
│ │ When reviewing code, focus on...                    │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ [AI Assistant] ← Click to get help writing instructions    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Provider Configuration                                      │
├─────────────────────────────────────────────────────────────┤
│ Model: [claude-sonnet-4-5 ▼]                               │
│ Temperature: [0.3] ─────●───── (deterministic)             │
│ Max Tokens: [4000]                                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Tool Access                                                 │
├─────────────────────────────────────────────────────────────┤
│ ☑ Filesystem   ☑ Bash   ☐ Web   ☐ Search                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Modes (Optional)                                            │
├─────────────────────────────────────────────────────────────┤
│ [+ Add Mode]                                                │
│                                                             │
│ Mode: REVIEW                                                │
│ └─ Prepended instruction: "Review this code critically..." │
│                                                             │
│ Mode: REFACTOR                                              │
│ └─ Prepended instruction: "Refactor this code to..."       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [Test Agent] [Preview YAML] [Save] [Publish]               │
└─────────────────────────────────────────────────────────────┘
```

### Features

**1. Template Starting Points**
- Fork from foundation agents
- Start from blank
- Import from community
- Clone your own agents

**2. Instruction Assistant**
- AI helps write effective system prompts
- Suggests improvements based on goals
- Shows examples from similar agents
- Validates clarity and specificity

**3. Provider Tuning**
- Model recommendations by use case
- Temperature guidance (creative vs deterministic)
- Token budget estimator
- Cost calculator

**4. Mode System**
- Add multiple modes for different tasks
- Mode-specific instructions
- Examples: ANALYZE, ARCHITECT, REVIEW, FIX
- Visual mode selector in recipes

**5. Testing Sandbox**
- Try agent with sample prompts
- Compare responses across models
- Iterate on instructions
- Save test cases

**6. Version Management**
- Save iterations
- Compare versions
- Rollback to previous
- Fork to create variants

---

## Level 4: Bundle Composer

**Purpose:** Package agents, tools, and configurations for reusable systems

### UI Design

```
┌─────────────────────────────────────────────────────────────┐
│ Create Bundle                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Bundle Name: [My Team Bundle                            ]  │
│ Version: [1.0.0]                                            │
│ Description: [Standard setup for our Python projects    ]  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Inheritance                                                 │
├─────────────────────────────────────────────────────────────┤
│ Base Bundle:                                                │
│ [✓] foundation                                              │
│     ├─ Tools: filesystem, bash, web, search, task          │
│     ├─ Agents: zen-architect, bug-hunter, etc.             │
│     └─ Hooks: logging, status, redaction                   │
│                                                             │
│ Additional Bundles:                                         │
│ [+ Add Bundle]                                              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Providers (Override foundation)                             │
├─────────────────────────────────────────────────────────────┤
│ ┌─ Anthropic ─────────────────────────────────────┐        │
│ │ Model: [claude-sonnet-4-5]                      │        │
│ │ API Key: [From Environment: ANTHROPIC_API_KEY] │        │
│ │ Default Model: Yes                              │        │
│ └────────────────────────────────────────────────┘        │
│                                                             │
│ [+ Add Provider]                                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Tools (Additions to foundation)                             │
├─────────────────────────────────────────────────────────────┤
│ ☑ All foundation tools included                            │
│                                                             │
│ Additional:                                                 │
│ [+ Add Custom Tool Module]                                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Agents (Additions to foundation)                            │
├─────────────────────────────────────────────────────────────┤
│ ☑ All foundation agents included                           │
│                                                             │
│ Custom Agents:                                              │
│ ✓ Python Expert                                             │
│ ✓ API Designer                                              │
│                                                             │
│ [+ Add Custom Agent]                                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Hooks (Additions to foundation)                             │
├─────────────────────────────────────────────────────────────┤
│ ☑ All foundation hooks included                            │
│                                                             │
│ Custom Hooks:                                               │
│ ✓ Approval Gate (require human approval for writes)        │
│ ✓ Slack Notifications                                       │
│                                                             │
│ [+ Add Hook Module]                                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ System Instructions                                         │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐   │
│ │ You are assisting with Python development.          │   │
│ │                                                      │   │
│ │ Our standards:                                       │   │
│ │ - Always use type hints                             │   │
│ │ - Follow PEP 8                                      │   │
│ │ - Write tests for everything                        │   │
│ │                                                      │   │
│ │ For guidelines, see @my-bundle:docs/STANDARDS.md    │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [Preview YAML] [Test Bundle] [Save] [Publish]              │
└─────────────────────────────────────────────────────────────┘
```

### Features

**1. Inheritance Visualization**
- Tree view of inherited components
- See what's coming from each bundle
- Override indicators
- Conflict resolution

**2. Component Picker**
- Browse available modules
- Search by capability
- Filter by category
- See compatibility info

**3. Configuration Override**
- Inherit base config
- Override specific values
- Visual diff of changes
- Validation warnings

**4. Documentation Integration**
- Markdown editor for bundle docs
- Auto-generate from structure
- Include reference files
- @mention system for cross-refs

**5. Test Environment**
- Create sample session with bundle
- Try various scenarios
- Validate all modules load
- Check for conflicts

**6. Publishing**
- Local save (file system)
- Git repository
- Community gallery
- Private team registry

---

## Level 5: Module Developer Studio

**Purpose:** Create new tools, hooks, orchestrators for Amplifier

### UI Design

```
┌─────────────────────────────────────────────────────────────┐
│ Create Module                                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Module Type: [Tool ▼]                                       │
│              Options: Tool, Hook, Orchestrator, Context,    │
│                      Provider                               │
│                                                             │
│ Module Name: [tool-jira]                                    │
│ Description: [Interact with JIRA for issue tracking     ]  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Scaffold Options                                            │
├─────────────────────────────────────────────────────────────┤
│ ☑ Generate boilerplate                                      │
│ ☑ Include tests                                             │
│ ☑ Add documentation template                                │
│ ☑ Create pyproject.toml                                     │
│ ☑ Setup GitHub Actions                                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Tool Capabilities (for tool type)                           │
├─────────────────────────────────────────────────────────────┤
│ Operations:                                                 │
│ ✓ create_issue(project, summary, description)              │
│ ✓ get_issue(issue_key)                                      │
│ ✓ update_issue(issue_key, fields)                           │
│ ✓ search_issues(jql_query)                                  │
│                                                             │
│ [+ Add Operation]                                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Configuration Schema                                        │
├─────────────────────────────────────────────────────────────┤
│ {                                                           │
│   "jira_url": {"type": "string", "required": true},        │
│   "api_token": {"type": "string", "required": true},       │
│   "default_project": {"type": "string"}                    │
│ }                                                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [Generate Scaffold] [Open in VS Code] [Deploy]             │
└─────────────────────────────────────────────────────────────┘
```

### Generated Files

**Module Scaffold:**
```
tool-jira/
├── pyproject.toml          # Package definition with entry point
├── README.md               # Documentation
├── src/
│   └── tool_jira/
│       ├── __init__.py
│       └── mount.py        # Mount function
├── tests/
│   ├── test_mount.py
│   └── test_operations.py
└── .github/
    └── workflows/
        └── test.yml
```

**mount.py Template:**
```python
"""
JIRA integration tool for Amplifier.
"""

from typing import Any
from amplifier_foundation import ModuleCoordinator, ToolResult

class JiraTool:
    """Tool for JIRA operations."""
    
    name = "jira"
    description = "Interact with JIRA for issue tracking"
    
    def __init__(self, config: dict):
        self.jira_url = config["jira_url"]
        self.api_token = config["api_token"]
        self.default_project = config.get("default_project")
    
    async def execute(self, operation: str, **kwargs) -> ToolResult:
        """Execute a JIRA operation."""
        if operation == "create_issue":
            return await self._create_issue(**kwargs)
        # ... other operations
    
    async def _create_issue(self, project, summary, description):
        """Create a new JIRA issue."""
        # Implementation here
        pass

async def mount(coordinator: ModuleCoordinator, config: dict) -> JiraTool:
    """Mount the JIRA tool."""
    tool = JiraTool(config)
    await coordinator.mount("tools", tool, name="jira")
    return tool
```

### Features

**1. Contract Validator**
- Check mount protocol compliance
- Validate tool/hook contracts
- Test with mock coordinator
- Generate compliance report

**2. Testing Harness**
- Unit test templates
- Integration test setup
- Mock coordinator for testing
- CI/CD configuration

**3. Documentation Generator**
- Auto-generate API docs from code
- Usage examples
- Configuration schema
- Contribution guide

**4. Local Development**
- Hot reload during development
- Test in local Amplifier instance
- Debug mode with logging
- Performance profiling

**5. Publishing Pipeline**
- Package for PyPI
- Create GitHub release
- Submit to Amplifier registry
- Generate changelog

---

## Cross-Cutting Features

### 1. YAML Intelligence

**Syntax Highlighting:**
- Keywords (name, steps, agents, etc.)
- Variables ({{context_var}})
- References (@bundle:path)
- Comments

**Auto-completion:**
- Context variable suggestions
- Agent names from bundles
- Module IDs from registry
- Common patterns

**Validation:**
- Schema validation
- Reference checking
- Variable usage
- Syntax errors

**Formatting:**
- Auto-indent
- Align values
- Sort keys (optional)
- Prettify on save

### 2. Context Flow Tracer

**Visualize data flow through recipe:**
- Show where variables are defined
- Highlight all usages
- Trace transformations
- Identify unused outputs

**Example:**
```
Step 1: output = "analysis" ─┐
                              │
Step 2: input = {{analysis}} ←┘
        output = "fixes"     ─┐
                              │
Step 3: input = {{fixes}}    ←┘
```

### 3. Error Explainer

**When validation fails:**
- Plain English explanation
- Point to exact line/location
- Suggest fixes
- Link to relevant docs

**Example:**
```
❌ Error in step-2:
   Variable {{findings}} is not defined.
   
   Did you mean:
   • {{analysis}} from step-1
   • {{bugs}} from step-1
   
   Or add output: "findings" to a previous step.
```

### 4. Template Library

**Common Patterns:**
- Sequential analysis → fix
- Parallel processing with merge
- Conditional branching
- Retry on failure
- Approval gates
- Staged execution

**Usage:**
- Browse templates
- One-click insert
- Customize parameters
- Save as personal template

### 5. Version Control Integration

**Git Integration:**
- Initialize repo
- Commit on save
- Branch for experiments
- Compare versions
- Merge changes
- Push to GitHub

**Collaboration:**
- Share via GitHub
- Fork others' work
- Pull requests
- Review comments
- Version diffing

### 6. Export Options

**Formats:**
- YAML (native)
- JSON (programmatic)
- Markdown (documentation)
- Diagram (visual)
- Jupyter Notebook (tutorial)

**Destinations:**
- Local file system
- GitHub repository
- Community gallery
- Team registry
- Cloud storage

---

## Learning Integration

### Contextual Tutorials

**Every builder feature has:**
- "What is this?" tooltip
- "Show me an example" link
- "Learn more" doc link
- "Get help" AI assistant

### Interactive Walkthroughs

**Guided experiences:**
1. "Build Your First Recipe" (10 min)
2. "Create a Custom Agent" (15 min)
3. "Compose a Bundle" (20 min)
4. "Develop a Module" (30 min)

**Each walkthrough:**
- Step-by-step instructions
- Live edits in real builder
- Validation checkpoints
- Completion badge

### AI Assistant

**"Ask Amplifier" chat:**
- Help with syntax
- Suggest improvements
- Debug errors
- Find examples
- Explain concepts

**Context-aware:**
- Knows what user is building
- References their code
- Personalized suggestions

---

## Mobile Experience

**Read-Only on Mobile:**
- Browse gallery
- View recipes/bundles
- Read documentation
- Monitor executions

**Light Editing:**
- Adjust parameters
- Enable/disable steps
- Change configuration
- Trigger executions

**Full Editing:**
- Tablet+ only
- Simplified UI
- Touch-optimized
- Save drafts

---

## Success Metrics

**Engagement:**
- Time in builder
- Artifacts created
- Iterations per artifact
- Completion rate

**Learning:**
- Tutorial completion
- Feature discovery
- Error resolution time
- Help usage

**Quality:**
- YAML validation success
- Test execution success
- Community ratings
- Fork/usage count

**Conversion:**
- Parameter tweaks → Recipe creation
- Recipe creation → Agent creation
- Agent creation → Bundle creation
- Bundle creation → Module development
