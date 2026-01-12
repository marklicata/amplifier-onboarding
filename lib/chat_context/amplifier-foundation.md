# Amplifier Foundation: Composition Framework for AI Agent Applications

## Overview

**amplifier-foundation** is the composition framework for building AI agent applications in the Amplifier ecosystem. It provides the primitives, patterns, and utilities for assembling modular AI systems through a **bundle composition model**—think of it as a package manager and dependency injection system specifically designed for AI agent configurations.

**Repository**: [microsoft/amplifier-foundation](https://github.com/microsoft/amplifier-foundation)  
**License**: MIT  
**Status**: Active development

## Purpose and Main Functionality

### The Problem It Solves

Building AI agent applications involves coordinating many pieces: LLM providers, tools (filesystem, web, bash), orchestration strategies, memory management, observability hooks, specialized sub-agents, and system instructions. Managing this complexity across different environments, use cases, and deployment scenarios is challenging.

amplifier-foundation solves this by providing:

1. **A composition model** for layering AI agent configurations
2. **Reusable bundles** that package capabilities for sharing and reuse
3. **@-mention context system** for including documentation and instructions
4. **Module resolution** for downloading and activating external capabilities
5. **Validation and introspection** for ensuring configuration correctness

### Core Functionality

At its core, amplifier-foundation enables developers to **compose AI agent capabilities like LEGO bricks**: start with a base bundle (like `foundation`), layer on additional capabilities (tools, agents, behaviors), and produce a complete configuration ready for execution by the Amplifier kernel (`amplifier-core`).

```
Bundle -> Compose -> Prepare -> Execute
```

## Key Features and Capabilities

### 1. Bundle Composition System

**Bundles are composable units** that produce mount plans for AmplifierSession. They use markdown files with YAML frontmatter:

```yaml
---
bundle:
  name: my-app
  version: 1.0.0

includes:
  - bundle: foundation    # Inherit from foundation
  - bundle: my-app:behaviors/custom-capability

tools:
  - module: tool-custom
    source: ./modules/tool-custom

agents:
  include:
    - my-app:specialized-agent
---

# System Instructions

Your markdown instructions here become the system prompt.
Reference documentation: @my-app:docs/GUIDE.md
```

**Merge rules**:
- `session`, `providers`, `tools`, `hooks`: Deep merge by module ID
- `agents`: Merge by agent name
- Markdown instructions: Replace entirely (later wins)

### 2. @-Mention Context System

**Include documentation directly in system prompts** using `@namespace:path` syntax:

```markdown
# My Agent Instructions

Follow guidelines: @foundation:context/IMPLEMENTATION_PHILOSOPHY.md
See API docs: @my-bundle:docs/API.md
```

**How it works**:
- Each bundle's `base_path` is tracked by namespace
- Content is loaded and included inline
- **SHA-256 content deduplication** prevents duplicate loading

### 3. Source URI Resolution

**Flexible module sourcing** for tools, hooks, and other capabilities:

| Format | Example | Use Case |
|--------|---------|----------|
| Local path | `./modules/my-module` | Modules within bundle |
| Relative path | `../shared-module` | Sibling directories |
| Git URL | `git+https://github.com/org/repo@main` | External modules |
| Git subpath | `git+https://github.com/org/repo@main#subdirectory=modules/foo` | Module within repo |

### 4. Behavior Pattern

**Reusable capability add-ons** that bundle agents + context + optional tools/hooks:

```yaml
# behaviors/my-capability.yaml
bundle:
  name: my-capability-behavior
  version: 1.0.0

tools:
  - module: tool-my-capability
    source: git+https://github.com/...

agents:
  include:
    - my-capability:agent-one
    - my-capability:agent-two
```

**Benefits**:
- Reusability: Add capability to any bundle
- Modularity: Separate concerns cleanly
- Composition: Mix and match behaviors

### 5. App-Level Runtime Injection

**Bundles define WHAT capabilities exist; apps inject HOW they run**:

```yaml
# ~/.amplifier/settings.yaml
providers:
  - module: provider-anthropic
    config:
      api_key: ${ANTHROPIC_API_KEY}
```

**The composition chain**:
```
Foundation -> Your bundle -> App settings -> Session overrides
```

### 6. Validation System

**Ensure bundle correctness**:

```python
from amplifier_foundation import validate_bundle_or_raise

validate_bundle_or_raise(bundle)  # Raises if invalid
```

### 7. Registry and Caching

**Manage and cache bundles**:

```python
from amplifier_foundation import BundleRegistry

registry = BundleRegistry()
registry.register("my-bundle", "git+https://github.com/org/bundle@main")
bundle = await registry.load("my-bundle")  # Uses cache on subsequent loads
```

## Architecture

### The Linux Kernel Metaphor

amplifier-foundation builds on **amplifier-core** (the kernel) and follows the **mechanism, not policy** philosophy:

```
KERNEL (amplifier-core)
    v mount plan (config dict)
FOUNDATION (amplifier-foundation)
    v bundles (markdown + YAML)
USER BUNDLES
```

**Key architectural principles**:

1. **Text-First**: Bundles are markdown files—human-readable, diffable, versionable
2. **Composition Over Configuration**: New behavior from plugging in modules
3. **Separation of Concerns**: Clear boundaries between kernel (mechanisms) and bundles (policies)
4. **Module Protocol Compliance**: All capabilities implement stable interfaces
5. **Deterministic Resolution**: Same inputs → same mount plan → predictable behavior

### The Thin Bundle Pattern (Recommended)

**Most bundles should be thin**—inherit from foundation, add only unique capabilities:

```yaml
---
bundle:
  name: my-capability
  version: 1.0.0

includes:
  - bundle: git+https://github.com/microsoft/amplifier-foundation@main
  - bundle: my-capability:behaviors/my-capability
---

# My Capability

@my-capability:context/instructions.md
```

**Why thin bundles?**
- Avoid duplicating foundation's tools/session config
- Automatically inherit foundation updates
- Minimal maintenance burden
- Clear separation: foundation provides base, you add capability

## How It Fits Into the Ecosystem

### amplifier-foundation in the Amplifier Stack

```
AMPLIFIER CLI (amplifier)
    v uses
AMPLIFIER FOUNDATION (amplifier-foundation) <- YOU ARE HERE
    v produces mount plans for
AMPLIFIER CORE (amplifier-core)
    v loads
MODULES (Ecosystem)
```

**Analogy**: If `amplifier-core` is the Linux kernel, then `amplifier-foundation` is the package manager (apt/yum) and init system (systemd)—it composes, resolves, and prepares the system for execution.

## Target Users and Use Cases

### Primary Users

1. **AI Application Developers** - Building production AI agent systems
2. **Bundle Authors** - Creating reusable capability packages
3. **Enterprise Teams** - Standardizing AI agent configurations
4. **Research/Education** - Experimenting with AI architectures

### Common Use Cases

#### Building Custom AI Assistants

```python
# Compose foundation + custom capabilities
assistant = await load_bundle("foundation")
custom = Bundle(
    name="my-assistant",
    agents={"include": ["my-assistant:code-reviewer"]},
)
final = assistant.compose(custom)
```

#### Environment-Specific Deployments

```python
# Base config + environment overlay
base = await load_bundle("./bundle.md")
prod = Bundle(
    name="prod",
    providers=[{"module": "provider-anthropic", "config": {"timeout": 60}}],
)
production_bundle = base.compose(prod)
```

## Getting Started

### Installation

```bash
pip install amplifier-foundation
```

### Basic Usage

```python
from amplifier_foundation import load_bundle

# Load the foundation bundle
bundle = await load_bundle("git+https://github.com/microsoft/amplifier-foundation@main")

# Prepare and execute
prepared = await bundle.prepare()
async with prepared.create_session() as session:
    response = await session.execute("Hello, world!")
    print(response)
```

### Creating Your First Bundle

1. **Create bundle.md**:

```yaml
---
bundle:
  name: my-first-bundle
  version: 1.0.0

includes:
  - bundle: git+https://github.com/microsoft/amplifier-foundation@main
---

You are a helpful assistant specialized in Python programming.
```

2. **Load and use**:

```python
bundle = await load_bundle("./bundle.md")
prepared = await bundle.prepare()
async with prepared.create_session() as session:
    response = await session.execute("Write a hello world program")
```

## Summary

**amplifier-foundation** is the composition framework that bridges the minimal kernel (`amplifier-core`) and user applications. It provides the bundle system, module resolution, @-mention context loading, and composition patterns that make building modular AI agent systems practical, maintainable, and scalable.
