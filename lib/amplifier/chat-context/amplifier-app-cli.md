# amplifier-app-cli: Reference CLI Implementation

## Overview

**amplifier-app-cli** is the reference command-line interface implementation for the Amplifier AI-powered modular development platform. It demonstrates how to build a production-ready CLI application on top of **amplifier-core**, serving both as the primary user-facing tool and as a blueprint for building custom Amplifier applications.

**Repository**: [microsoft/amplifier-app-cli](https://github.com/microsoft/amplifier-app-cli)  
**Status**: Active development  
**License**: MIT  
**Language**: Python 3.11+

## Purpose and Main Functionality

amplifier-app-cli provides a complete CLI experience for interacting with AI agents through the Amplifier platform. It's designed as a **reference implementation** - you can use it as-is, fork it for customization, or study it as a guide for building your own Amplifier applications.

### Core Capabilities

1. **AI Agent Interaction** - Natural language interface for software development tasks
2. **Bundle System** - Composable configuration packages for reusable capabilities
3. **Multi-Provider Support** - Works with Anthropic, OpenAI, Azure, Google Gemini, Ollama, and more
4. **Session Management** - Persistent conversations with resumption across sessions
5. **Agent Delegation** - Spawn specialized sub-agents for focused work
6. **Configuration Management** - Three-scope settings (local/project/global)
7. **Interactive & Single-Shot Modes** - REPL for exploration or one-off commands for automation

## Key Features

### Flexible Execution Modes

**Single-Shot Execution**:
```bash
amplifier run "Create a Python function to calculate fibonacci numbers"
```

**Interactive Chat Mode**:
```bash
amplifier  # Starts REPL with slash commands
```

**Conversational Single-Shot** (build context across commands):
```bash
amplifier run "What's the weather in Seattle?"
amplifier continue "And what about tomorrow?"  # Resumes with context
```

### Bundle System

Bundles are composable configuration packages that combine providers, tools, agents, and context:

```bash
# Use pre-built bundles
amplifier bundle use foundation          # Base capabilities
amplifier bundle use recipes             # Multi-step workflows

# Check current configuration
amplifier bundle current
```

### Session Persistence and Resumption

Every conversation is automatically persisted with a unique session ID:

```bash
# Work is auto-saved
amplifier run "Analyze this log file"

# Resume most recent session
amplifier continue "Now show errors only"

# Manage sessions
amplifier session list
amplifier session show <session-id>
```

### Interactive Mode with Slash Commands

Rich REPL experience with execution control:

| Command | Purpose |
|---------|---------|
| `/think` | Enter plan mode (read-only analysis) |
| `/do` | Exit plan mode, re-enable writes |
| `/save [file]` | Save transcript to session directory |
| `/clear` | Clear conversation history |
| `/status` | Show session info (mode, messages, tools) |
| `/tools` | List available capabilities |

## Architecture

The CLI follows a layered architecture:

```
amplifier-app-cli (Application Layer)
    ↓ builds on
amplifier-foundation (Bundle system)
    ↓ uses
amplifier-core (Kernel)
    ↓ loads
Runtime Modules (tools, providers, hooks, etc.)
```

## Target Users and Use Cases

### Primary Users

1. **Software Developers** - Write code with AI assistance, debug, refactor
2. **DevOps Engineers** - Automate infrastructure tasks, analyze logs
3. **Technical Writers** - Generate documentation, maintain consistency
4. **AI Researchers/Developers** - Experiment with multi-agent architectures

### Common Use Cases

**Interactive Development**:
```bash
amplifier  # Start interactive session
> Analyze this authentication module for security issues
> /think  # Enter read-only mode
> Review the error handling patterns
> /do     # Re-enable writes
> Implement the recommended fixes
```

**Automated Workflows**:
```bash
# Single-shot commands for scripting
amplifier run "Generate API documentation from @src/api/"
```

**Agent Delegation**:
```bash
# Delegate to specialized agents
amplifier run "Use bug-hunter to analyze performance issues"
amplifier run "Use zen-architect to design the caching layer"
```

## Installation

```bash
# Install globally
uv tool install git+https://github.com/microsoft/amplifier

# Or try without installing
uvx --from git+https://github.com/microsoft/amplifier amplifier
```

## Summary

**amplifier-app-cli** is the reference CLI implementation for Amplifier that provides:

- Complete user experience - Interactive and single-shot modes
- Production-ready features - Session persistence, agent delegation, multi-provider support
- Configuration flexibility - Bundle system with runtime overrides
- Developer-friendly - Shell completion, slash commands, @mention loading
- Reference implementation - Blueprint for building custom Amplifier applications
