# Amplifier: Ecosystem Hub and Entry Point

## Overview

The **amplifier** repository serves as the **primary entry point and ecosystem hub** for the entire Amplifier platform. It is the "front door" that users and developers encounter first.

**Repository**: [microsoft/amplifier](https://github.com/microsoft/amplifier)  
**Status**: Active development  
**License**: MIT

## Purpose and Main Functionality

The amplifier repository serves as:

- **User onboarding** - Zero-to-working in 90 seconds installation experience
- **Ecosystem navigation** - Links and guides users to all Amplifier components
- **Documentation hub** - Consolidates getting-started guides, concepts, and references
- **Governance center** - Defines repository rules and architectural principles

**Key distinction**: When users run `uv tool install git+https://github.com/microsoft/amplifier`, they're installing the **amplifier-app-cli** application, but they interact with it through this hub repository.

## What is Amplifier?

Amplifier is a **modular AI agent framework** built on the Linux kernel philosophy: a tiny, stable kernel that provides mechanisms only, with all policies and features living at the edges as replaceable modules.

**Core Principle**: "The center stays still so the edges can move fast."

### Key Features

1. **Modular AI Platform**
   - Provider flexibility - Works with Anthropic Claude, OpenAI, Azure OpenAI, Ollama
   - Bundle-based configuration - Composable packages for different scenarios
   - Session persistence - Resume work across sessions and projects
   - Extensibility - Build custom modules, bundles, and interfaces

2. **AI-Powered Development Assistant**
   - Code generation - From simple functions to full applications
   - Debugging - Systematic error resolution with specialized agents
   - System design - Architecture planning with design-first approach
   - Research - Find patterns and best practices

3. **Specialized Agent System**
   Ships with 14+ specialized agents in the foundation bundle:
   - **zen-architect** - System design with ruthless simplicity
   - **bug-hunter** - Systematic debugging
   - **modular-builder** - Code implementation
   - **explorer** - Breadth-first file exploration
   - **web-research** - Web research and content synthesis

## Repository Contents

### Core Files
- **README.md** - Quick start guide (90-second installation)
- **bundle.md** - Hub bundle configuration (includes foundation)
- **pyproject.toml** - Package configuration for installation

### Documentation (`docs/`)
- **USER_GUIDE.md** - Complete usage guide
- **USER_ONBOARDING.md** - First-time setup and configuration
- **DEVELOPER.md** - Building modules with Amplifier
- **MODULES.md** - Complete catalog of ecosystem components
- **REPOSITORY_RULES.md** - Governance and documentation placement rules

### Agents (`agents/`)
- **amplifier-expert.md** - Ecosystem knowledge consultant

### Recipes (`recipes/`)
- **ecosystem-activity-report.yaml** - Multi-repo activity analysis

## How It Fits Into the Ecosystem

The amplifier repository is the **hub at the center of a spoke-and-wheel architecture**:

```
                    amplifier (HUB/ENTRY POINT)
                            |
        ____________________|____________________
        |                   |                   |
  amplifier-core    amplifier-foundation  amplifier-app-cli
    (Kernel)          (Library)           (Application)
        |                   |                   |
        |_______________________________________|
                            |
                    Modules (Ecosystem)
        (Providers, Tools, Orchestrators, Hooks)
```

### Architectural Position

According to REPOSITORY_RULES.md, amplifier is the **Entry Point** in the awareness hierarchy:

**Can Reference**: Everything (it's the hub)  
**Referenced By**: All other repos point here for "getting started"

## Target Users and Use Cases

### Primary Users

1. **End Users (Developers)** - Installing AI assistant for development work
2. **Power Users** - Creating custom bundles for specialized workflows
3. **Module Developers** - Building custom tools, providers, orchestrators
4. **Application Builders** - Creating custom interfaces (web, mobile, voice)

### Common Use Cases

**Daily Development Work**:
```bash
# Install once
uv tool install git+https://github.com/microsoft/amplifier

# Use continuously  
amplifier run "Explain async/await"
amplifier "Debug this error: [paste]"
amplifier continue  # Resume previous work
```

**Specialized Workflows**:
```bash
# Add capability bundles
amplifier bundle add git+https://github.com/microsoft/amplifier-bundle-recipes@main

# Use specialized agents
amplifier "Use bug-hunter to debug auth.py"
```

## Current State

**Early Preview Release**:
- APIs stabilizing but may change
- Most tested with Anthropic Claude
- Other providers supported but may have rough edges
- Documentation catching up with code

**Caution Notice**: This project is a research demonstrator in early development. Use with caution and at your own risk.

## Summary

The **amplifier repository** is the **front door, navigation hub, and governance center** for the entire Amplifier ecosystem. It's where:

- **Users start** their journey (installation, onboarding)
- **Developers discover** capabilities (module catalog, bundle system)
- **Contributors understand** architecture (repository rules, governance)
- **The community converges** (central reference point for all repos)
