# Amplifier Core: The Kernel

## Overview

**Amplifier Core** (`amplifier-core`) is the ultra-thin kernel at the heart of the Amplifier modular AI agent system. At approximately 3,900 lines of Python code, it embodies the Linux kernel philosophy applied to AI agent systems:

> **"The center stays still so the edges can move fast."**

**Repository**: [microsoft/amplifier-core](https://github.com/microsoft/amplifier-core)  
**License**: MIT  
**Status**: Active development

The kernel provides **mechanisms only** — the fundamental capabilities needed to build AI agent systems. All **policies** — the decisions about behavior, orchestration strategies, provider choices, and security rules — live in swappable modules at the edges.

## Purpose and Main Functionality

Amplifier Core serves as the **stable foundation** that:

1. **Discovers and loads modules** from multiple sources (installed packages, git repositories, local files)
2. **Coordinates module lifecycles** through initialization, execution, and cleanup phases
3. **Dispatches events** through a powerful hook system enabling observability and control
4. **Manages session state** providing execution context with mounted modules and conversation history
5. **Enforces stable contracts** through Python Protocols that modules implement

### Core Responsibilities

| Kernel Provides (Mechanism) | Modules Decide (Policy) |
|------------------------------|-------------------------|
| Module loading infrastructure | Which modules to use |
| Event emission system | What to log, where to log it |
| Session lifecycle management | Orchestration strategy |
| Hook registration & dispatch | Security policies, approval gates |
| Protocol definitions | Provider selection, tool behavior |
| Coordinator context | Response formatting, UX decisions |

## Key Features and Capabilities

### 1. Module Discovery and Loading

The kernel provides flexible module loading through multiple sources:

- **Installed packages**: Via Python entry points (`amplifier.modules`)
- **Git repositories**: `git+https://github.com/org/repo@ref`
- **Local files**: Absolute or relative file paths
- **Protocol validation**: Structural type checking at load time

### 2. Lifecycle Coordination

The `ModuleCoordinator` provides infrastructure context to all modules:

```python
coordinator.session_id      # Session identifier
coordinator.config          # Module configuration
coordinator.hooks           # Event system access
coordinator.mount_points    # Access to mounted modules
```

**Lifecycle phases**:
1. **Initialize**: Load and mount all configured modules
2. **Execute**: Run agent execution via orchestrator
3. **Cleanup**: Gracefully tear down resources

### 3. Hook System

A powerful event-driven observability and control system with rich capabilities:

#### Hook Capabilities

| Capability | Action | Use Case |
|------------|--------|----------|
| **Observe** | `continue` | Logging, metrics, audit trails |
| **Block** | `deny` | Security violations, validation failures |
| **Modify** | `modify` | Transform event data, enrich context |
| **Inject Context** | `inject_context` | Automated feedback loops, linter errors |
| **Request Approval** | `ask_user` | Dynamic permissions, high-risk operations |
| **Control Output** | `suppress_output` | Clean UX, hide verbose processing |

**Key innovation**: Hooks can inject context directly into the agent's conversation, enabling **automated correction loops** within the same turn.

### 4. Session Management

Sessions provide isolated execution contexts with:

- **Unique session IDs** for tracking and observability
- **Session forking** for agent delegation (child sessions with `parent_id`)
- **Mount plan configuration** defining which modules are active
- **State isolation** between concurrent sessions
- **Graceful cleanup** via async context managers

### 5. Stable Contracts

All module types use Python `Protocol` (structural typing) for loose coupling:

#### Provider Protocol
```python
@property
def name(self) -> str

async def list_models(self) -> list[ModelInfo]

async def complete(self, request: ChatRequest) -> ChatResponse
```

#### Tool Protocol
```python
@property
def name(self) -> str

@property
def description(self) -> str

async def execute(self, input: dict[str, Any]) -> ToolResult
```

#### Orchestrator Protocol
```python
async def execute(
    self,
    prompt: str,
    context: ContextManager,
    providers: dict[str, Provider],
    tools: dict[str, Tool],
    hooks: HookRegistry,
) -> str
```

## Architecture

### The Ultra-Thin Kernel Philosophy

Amplifier Core is designed to be:

1. **Minimal**: ~3,900 lines — small enough for one person to understand completely
2. **Stable**: Changes rarely; backward compatibility is sacred
3. **Boring**: No clever tricks, no magic — predictable and reliable
4. **Mechanism-focused**: Provides capabilities without making decisions

### Architecture Diagram

```
KERNEL (amplifier-core)
    ↓ protocols (Tool, Provider, etc.)
MODULES (Userspace - Swappable)
    • Providers: LLM backends
    • Tools: Capabilities
    • Orchestrators: Execution loops
    • Contexts: Memory management
    • Hooks: Observability
```

### Python Protocols (Structural Typing)

The kernel uses **structural typing** (duck typing formalized) instead of inheritance:

```python
from amplifier_core.interfaces import Tool
from amplifier_core.models import ToolResult

class MyTool:
    """Implements Tool protocol without inheritance."""
    
    @property
    def name(self) -> str:
        return "my_tool"
    
    @property
    def description(self) -> str:
        return "Does something useful"
    
    async def execute(self, input: dict) -> ToolResult:
        return ToolResult(output="Result", error=None)
```

**Benefits**:
- No forced inheritance hierarchy
- Modules remain independent
- Easy to test in isolation
- Clear contracts without tight coupling

## The "Mechanism Not Policy" Philosophy

This is the **north star principle** that guides all kernel design decisions.

### The Litmus Test

Before adding anything to the kernel, ask:

> **"Could two reasonable teams want different behavior here?"**

- **YES** -> It's **POLICY** → Belongs in a module, not kernel
- **NO**-> It **might** be mechanism (but prove it with ≥2 independent modules first)

### Examples

| Feature | Classification | Reasoning |
|---------|---------------|-----------|
| Event emission | Kernel (mechanism) | Everyone needs observability |
| What to log | Module (policy) | Teams differ on logging needs |
| Session lifecycle | Kernel (mechanism) | Core coordination primitive |
| Provider selection | Module (policy) | Each team has different preferences |
| Retry logic | Module (policy) | Retry strategies vary by use case |

## How It Fits Into the Ecosystem

Amplifier Core is the **foundational kernel** that other layers build upon:

```
APPLICATION LAYER (amplifier CLI, apps)
    v Mount Plan
MODULE ECOSYSTEM (amplifier-foundation, bundles)
    v Protocols
KERNEL (amplifier-core) <- YOU ARE HERE
```

### The Mount Plan Contract

The **Mount Plan** is the contract between the application layer and the kernel:

```python
{
    "session": {
        "orchestrator": "loop-basic",
        "context": "context-simple"
    },
    "providers": [
        {"module": "provider-anthropic", "config": {...}}
    ],
    "tools": [
        {"module": "tool-filesystem", "config": {...}},
        {"module": "tool-bash", "config": {...}}
    ],
    "hooks": [
        {"module": "hook-logger", "config": {...}}
    ]
}
```

## Target Users and Use Cases

### Module Developers

**Goal**: Build custom providers, tools, orchestrators, or hooks

**Example**: Building a custom tool
```python
# Implement the Tool protocol
class MyCustomTool:
    @property
    def name(self) -> str:
        return "custom_tool"
    
    async def execute(self, input: dict) -> ToolResult:
        return ToolResult(output="Success")
```

### System Architects

**Goal**: Design AI agent systems with specific architectural patterns

**What the kernel provides**:
- Stable foundation that won't change underneath them
- Swappable components (try different orchestrators, contexts, providers)
- Hook system for custom policies (security, approval, logging)
- Session forking for agent delegation patterns

### Platform Builders

**Goal**: Create platforms or products built on Amplifier

**What the kernel provides**:
- Minimal, auditable codebase (~3,900 lines)
- Clear separation: kernel (mechanisms) vs app layer (policies)
- Module ecosystem for extensibility
- Stable contracts that won't break with updates

## Getting Started

### Installation

```bash
# Via the main Amplifier package
pip install amplifier

# Or directly (for module development)
pip install amplifier-core
```

### Basic Usage

```python
from amplifier_core import AmplifierSession

# Define mount plan
config = {
    "session": {
        "orchestrator": "loop-basic",
        "context": "context-simple"
    },
    "providers": [
        {"module": "provider-anthropic"}
    ],
    "tools": [
        {"module": "tool-filesystem"},
        {"module": "tool-bash"}
    ]
}

# Create and use session
async with AmplifierSession(config) as session:
    response = await session.execute("List files in current directory")
    print(response)
```

## Summary

**Amplifier Core is the ultra-thin kernel that makes modular AI agent systems possible.** At ~3,900 lines, it provides just enough mechanism — module loading, lifecycle coordination, event dispatch, session management, and stable contracts — to enable a thriving ecosystem of swappable modules at the edges.

By following the "mechanism not policy" philosophy and Linux kernel design principles, Amplifier Core achieves the critical balance: **the center stays still so the edges can move fast.**

**The kernel doesn't make decisions — it makes decisions possible.**
