# Amplifier Log Viewer: Session Debugging and Inspection Tool

## Overview

**amplifier-app-log-viewer** is a web-based developer tool that provides visual inspection and real-time monitoring of Amplifier session logs. It serves as the primary debugging interface for understanding AI agent behavior, inspecting conversation flows, and troubleshooting issues.

**Repository**: [microsoft/amplifier-app-log-viewer](https://github.com/microsoft/amplifier-app-log-viewer)  
**License**: MIT  
**Status**: Active development

## Purpose and Main Functionality

The Log Viewer solves a critical developer problem: **Amplifier generates rich, structured session logs in JSONL format that are difficult to parse manually**. These logs contain:

- Lifecycle events (session start/stop, agent spawns, tool calls)
- Conversation transcripts (user messages, AI responses)
- Debug data (LLM requests/responses, token usage, timing)
- Session metadata (parent/child relationships, configuration)

The Log Viewer transforms these raw logs into an **interactive, filterable, real-time dashboard** that lets developers:

- Watch sessions unfold in real-time
- Navigate complex multi-agent hierarchies
- Inspect LLM interactions in detail
- Filter events by type, level, or text search
- Debug issues without manually parsing JSONL files

## Key Features

### Core Functionality

1. **Real-time Log Streaming**
   - Events appear as Amplifier writes them to disk
   - 3-second server cache with auto-refresh
   - Manual refresh button for immediate updates

2. **Session Management**
   - Project and session selection via header dropdowns
   - Flexible sorting: by session ID or timestamp
   - Auto-detection of new projects and sessions
   - Persistent preferences

3. **Interactive Event Browser**
   - Two-pane layout inspired by browser developer tools
   - Left pane: Event list with color-coded log levels
   - Right pane: Detailed event inspection with tabs
   - Network tab-style UI

4. **Smart Filtering**
   - Dynamic event type filters
   - Log level filtering (debug, info, warning, error)
   - Text search across event content
   - Filters persist across sessions

5. **Session Hierarchy Navigation**
   - View parent and child session relationships
   - Navigate multi-agent systems
   - Understand delegation patterns

6. **LLM Request/Response Inspection**
   - Complete debug data for every LLM interaction
   - Request details: model, temperature, system prompts
   - Response details: content, token usage, stop reason

7. **Interactive JSON Viewer**
   - Collapsible/expandable tree structure
   - Smart defaults (key sections expanded)
   - Syntax highlighting
   - Copy-paste friendly

### Advanced Features

8. **Service Mode (Background Daemon)**
   - Run as a background service on Linux/WSL (systemd) or macOS (launchd)
   - Auto-starts on login
   - Always available without terminal window
   - Service management: install, start, stop, restart, uninstall, logs

9. **Persistent Preferences**
   - Remembers: last project, session, filters, sort order, active tab
   - Seamless workflow across browser sessions

10. **Developer-Friendly**
    - No installation required (run with `uvx`)
    - Custom port and host binding
    - Custom projects directory support

## Architecture

### Technology Stack

- **Backend**: Python Flask web server
- **Frontend**: Vanilla JavaScript (no framework dependencies)
- **Data Format**: Reads JSONL (JSON Lines) log files
- **Service Management**: systemd (Linux/WSL), launchd (macOS)

### Architecture Pattern

```
Browser (localhost:8180)
    HTTP/REST API
Flask Server
    File I/O
~/.amplifier/projects/
    <project-slug>/
        sessions/
            <session-id>/
                - events.jsonl
                - transcript.jsonl
                - metadata.json
```

### Key Design Decisions

1. **Filesystem-based**: Reads directly from Amplifier's standard log location
   - No database required
   - No configuration needed
   - Works with any Amplifier installation

2. **Pull model with caching**: Server rescans on demand (3-second cache)
   - Balance between freshness and filesystem I/O
   - Auto-refresh triggered by user interaction

3. **Browser-native UI**: No heavy frontend frameworks
   - Fast load times
   - Simple deployment
   - Easy to understand and modify

## How It Fits Into the Ecosystem

### Position in the Ecosystem

The Log Viewer is a **first-class application** built on Amplifier:

1. **Primary Debugging Tool**: The go-to interface for session inspection
2. **Reference Implementation**: Demonstrates how to consume Amplifier logs
3. **Developer Experience Enhancement**: Bridges raw logs and developer understanding

### Integration Points

| Component | Integration |
|-----------|-------------|
| **amplifier-core** | Consumes event streams from kernel hooks |
| **Session storage** | Reads `events.jsonl`, `transcript.jsonl`, `metadata.json` |
| **Hook system** | Visualizes events from all hooks |
| **Multi-agent systems** | Navigates parent/child session relationships |

## Target Users and Use Cases

### Primary Users

1. **Amplifier Developers**: Building applications with Amplifier
2. **AI Engineers**: Debugging multi-agent systems and prompt engineering
3. **Module Authors**: Testing and debugging custom tools, providers, hooks
4. **Contributors**: Working on Amplifier core or ecosystem modules

### Key Use Cases

#### Debugging Agent Behavior
**Scenario**: AI agent makes unexpected tool calls or produces wrong results

**Workflow**:
1. Run problematic session
2. Open Log Viewer, select project and session
3. Filter to `tool_call` and `tool_result` events
4. Inspect what the agent actually called vs. expected
5. Check LLM tab for full request context

#### Understanding Multi-Agent Systems
**Scenario**: Complex orchestration with coordinator spawning sub-agents

**Workflow**:
1. Run multi-agent workflow
2. View parent session (coordinator) in Log Viewer
3. See `agent_spawn` events with child session IDs
4. Click child session links to inspect sub-agent behavior
5. Navigate back to parent to see result integration

#### Prompt Engineering
**Scenario**: LLM not responding as expected

**Workflow**:
1. Filter to `llm_request` and `llm_response` events
2. Inspect LLM tab for full request data
3. Review system prompt, user messages, tool definitions
4. Check response for stop reason, token usage
5. Iterate on prompts and re-test

#### Real-time Development
**Scenario**: Actively developing and want live feedback

**Workflow**:
1. Install as service: `amplifier-log-viewer service install`
2. Open browser to `localhost:8180`
3. Run Amplifier sessions in terminal
4. Watch events appear in real-time
5. Debug issues immediately

## Installation and Quick Start

**Install globally**:
```bash
uv tool install git+https://github.com/microsoft/amplifier-app-log-viewer@main
amplifier-log-viewer
```

**Run without install**:
```bash
uvx --from git+https://github.com/microsoft/amplifier-app-log-viewer@main amplifier-log-viewer
```

**Install as background service**:
```bash
amplifier-log-viewer service install
# Starts automatically, access at http://localhost:8180
```

## Summary

The **amplifier-app-log-viewer** is an essential developer tool in the Amplifier ecosystem that transforms opaque JSONL logs into an interactive, real-time debugging interface. It exemplifies Amplifier's "mechanism, not policy" philosophy by being a specialized application that leverages the kernel's event system without requiring any kernel modifications.
