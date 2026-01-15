# Amplifier Desktop: Native Desktop Application

## Overview

**Amplifier Desktop** is a powerful native desktop application that provides a rich graphical user interface for AI-powered development assistance. Built with Tauri (Rust + React), it offers a modern, cross-platform experience with deep integration into amplifier-core.

**Repository**: [michaeljabbour/amplifier-desktop](https://github.com/michaeljabbour/amplifier-desktop)  
**Version**: 1.1.0  
**License**: MIT  
**Status**: Active development

## Purpose and Main Functionality

Amplifier Desktop transforms the Amplifier CLI experience into a beautiful, feature-rich desktop application with:

- **Native performance** through Tauri's Rust core
- **Modern UI** built with React, TypeScript, and Tailwind CSS
- **Deep amplifier-core integration** via Python sidecar
- **Advanced features** including voice I/O, multi-provider support, skills system, and agent orchestration

Unlike the CLI, Amplifier Desktop provides:
- Visual conversation management with sidebar
- Artifacts panel for file previews and downloads
- Tool call transparency and debugging panels
- Memory and context visualization
- Setup wizard and guided onboarding
- Parallel chat instances

## Key Features and Capabilities

### Core AI Capabilities

1. **Multi-Provider AI Support**
   - Anthropic Claude (full support)
   - OpenAI (full support)
   - Google Gemini (full support)
   - xAI Grok (full support)
   - Azure OpenAI (draft/untested)
   - vLLM support

2. **Streaming Responses**
   - Real-time token-by-token output
   - Thinking display for Claude's reasoning
   - Animated progress indicators

3. **Agent Orchestration**
   - Subagent spawning and management
   - Specialized agents (code-reviewer, test-writer, etc.)
   - Claude agents with delegation patterns
   - Task delegation tool

### Advanced Features

4. **Skills System**
   - Reusable prompts and workflows
   - Load and execute skill definitions
   - Skill marketplace service
   - Example skill templates

5. **Voice Input/Output**
   - Speech-to-text input
   - Text-to-speech output
   - Voice hook integration

6. **Memory System**
   - AI learns user preferences
   - Memory extraction and persistence
   - Memory panel for viewing/managing memories
   - Entity extraction for knowledge graphs

7. **Knowledge Base**
   - RAG (Retrieval-Augmented Generation)
   - GraphRAG with entity extraction
   - Vector store for semantic search
   - Embedding service for text vectorization
   - Upload documents for project context

8. **GitHub Integration**
   - OAuth authentication
   - Repository access and picker
   - PR features and repository management

### User Interface Features

9. **Rich Chat Experience**
   - Enhanced chat input with rich features
   - Enhanced message rendering
   - Content parts parser and renderer
   - Mermaid diagram support
   - Syntax-highlighted code rendering

10. **Artifacts Management**
    - Multiple files in tabbed containers
    - Artifact preview component
    - Download to ~/Downloads/{chat-title}-{datestamp}/
    - Artifact store for state management

11. **Tool Transparency**
    - Tool calls panel
    - Tool call renderer with visualization
    - Raw prompt-chain explorer
    - Transactional transparency for amplifier-core calls

12. **Session Management**
    - Conversation resume with persistence
    - Session pool for concurrent management
    - Multiple amplifiers per chat (parallelism)
    - Multiple amplifiers across chats

13. **Todo Management**
    - Full task tracking
    - Visual panel for todo items
    - Todo tool integration

14. **Onboarding & Help**
    - Setup wizard with guided flow
    - Feature tour component
    - Onboarding guide
    - Features modal for capability overview

### MCP Integration

15. **Model Context Protocol**
    - MCP server support
    - MCP client integration
    - Enhanced context management

## Architecture

### Technology Stack

```
___________________________________________________
?              Tauri Desktop App                   ?
___________________________________________________
?  React Frontend (TypeScript + Tailwind)          ?
___________________________________________________
?  Tauri Rust Core (IPC + Native APIs)             ?
___________________________________________________
|  Python Sidecar (amplifier-core)                 ?
?  ??? FastAPI + WebSocket server                  ?
?  ??? AI Provider integrations                    ?
?  ??? Tools (filesystem, bash, grep, etc.)        ?
?  ??? Agent orchestration                         ?
___________________________________________________

```

### Key Components

**Frontend (React + TypeScript)**:
- Modern UI with Tailwind CSS
- Framer Motion animations
- Zustand for state management
- React Markdown with syntax highlighting
- Mermaid diagram rendering
- Sandpack for code execution

**Backend (Rust + Tauri)**:
- Native OS integration
- Secure IPC layer
- SQLite database with sqlite-vec for embeddings
- File system operations
- Shell command execution

**Python Sidecar**:
- FastAPI server (port 9876)
- WebSocket for real-time streaming
- amplifier-core integration
- PyInstaller bundling for distribution

### Data Storage

- **SQLite database** with vector extensions
- Comprehensive CRUD operations
- Migration system in Rust
- Store.ts for state management
- Session persistence
- Memory and entity storage

## How It Fits Into the Amplifier Ecosystem

Amplifier Desktop is a **first-class application** that demonstrates the full potential of the Amplifier platform:

```
Applications Layer
??? amplifier-app-cli (Terminal)
??? amplifier-desktop (GUI) <- YOU ARE HERE
??? amplifier-app-log-viewer (Debugging)
        v uses
amplifier-foundation (Bundle system)
        v builds on
amplifier-core (Kernel)
```

### Integration Points

| Component | Integration |
|-----------|-------------|
| **amplifier-core** | Python sidecar runs core directly |
| **Providers** | Multi-provider support (Anthropic, OpenAI, Google, xAI, Azure) |
| **Tools** | Full tool integration (filesystem, bash, delegate, skill, todo) |
| **Hooks** | Voice, logger, live diff tracker |
| **Agents** | Subagent spawning and delegation |
| **MCP** | Model Context Protocol client |

### Unique Advantages

Unlike the CLI, Amplifier Desktop provides:
- **Visual workflow management** - See all conversations, switch contexts easily
- **Parallel execution** - Multiple AI instances working simultaneously
- **Rich media support** - Diagrams, syntax highlighting, previews
- **Persistent memory** - AI remembers your preferences across sessions
- **Enhanced debugging** - Visual tool call tracking and prompt chain inspection

## Target Users and Use Cases

### Primary Users

1. **Software Developers** - Visual coding assistant with file management
2. **Product Teams** - Collaborative AI workspace with memory
3. **Content Creators** - Rich markdown and diagram support
4. **Researchers** - Knowledge base and RAG capabilities
5. **Power Users** - Multiple parallel AI sessions for complex workflows

### Common Use Cases

**Visual Development Workflow**:
- Write code with AI assistance in the chat
- Preview generated files in artifacts panel
- Download artifacts to project directory
- Track progress with visual todo panel
- Debug with tool call transparency

**Multi-Agent Collaboration**:
- Main chat coordinates work
- Spawn specialized agents for subtasks
- View agent delegation patterns
- Monitor parallel agent execution

**Knowledge Work**:
- Upload project documentation to knowledge base
- AI retrieves relevant context via RAG
- Memory system learns your preferences
- Entity extraction builds knowledge graphs

**Voice-Driven Development**:
- Speak your requirements
- AI responds with voice output
- Hands-free coding workflow

**Team Collaboration**:
- GitHub OAuth integration
- Repository access and management
- PR features for code review
- Shared skills and workflows

## Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| macOS (Intel) | Full | Native performance |
| macOS (Apple Silicon) | Full | Native ARM64 support |
| Windows x64 | Full | NSIS installer |
| Windows ARM64 | Full | Via x64 emulation |
| Linux x64 | Full | .deb and AppImage |
| Linux ARM64 | Full | Native support |

## Installation

### Download Pre-built

| Platform | Download |
|----------|----------|
| macOS | Amplifier.dmg (Intel & Apple Silicon) |
| Windows | Amplifier-Setup.exe (x64, works on ARM64) |
| Linux | Amplifier.deb / Amplifier.AppImage |

### Build from Source

**Prerequisites**:
- Node.js 18+
- Python 3.11+
- Rust (via rustup)
- uv package manager

**Quick Start**:
```bash
git clone https://github.com/michaeljabbour/amplifier-desktop.git
cd amplifier-desktop

# Setup dependencies
node scripts/setup.cjs

# Start development
npm run dev:all
```

**Production Build**:
```bash
# Build Python sidecar
cd sidecar
python -m PyInstaller sidecar.spec --noconfirm
cd ..

# Build Tauri app
npm run tauri:build
```

## Configuration

Create `.env` file or configure in Settings:

```bash
# Required: At least one API key
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Optional
OPENROUTER_API_KEY=sk-or-...
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift+Enter` | New line |
| `Cmd/Ctrl+N` | New chat |
| `Cmd/Ctrl+,` | Settings |
| `Cmd/Ctrl+B` | Toggle sidebar |
| `Cmd/Ctrl+E` | Toggle artifacts |
| `Cmd/Ctrl+K` | Focus input |

## Testing

Comprehensive test coverage:
- **Frontend**: 122 tests (React components, UI)
- **Backend**: 69 tests (Python sidecar, API)
- Total test coverage for critical paths

Run tests:
```bash
npm test                 # All tests
npm run test:frontend    # Frontend only
npm run test:backend     # Backend only
npm run test:watch       # Watch mode
```

## Summary

**Amplifier Desktop** brings the power of amplifier-core to a beautiful, native desktop experience. With 100+ features including multi-provider AI, voice I/O, skills system, agent orchestration, RAG, memory, and GitHub integration, it provides a comprehensive visual workspace for AI-powered development.

Whether you're coding solo, collaborating with a team, or managing complex multi-agent workflows, Amplifier Desktop offers a rich, native experience that goes far beyond what's possible in a terminal.
