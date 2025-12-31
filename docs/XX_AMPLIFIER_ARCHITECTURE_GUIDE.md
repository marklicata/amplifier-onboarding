Microsoft Windows [Version 10.0.26200.7392]
(c) Microsoft Corporation. All rights reserved.

C:\Users\malicata>amplifier
╭──────────────────────────────────────────────────────────────────╮
│ Amplifier Interactive Session                                    │
│ Session ID: 52f69164-1054-4296-95c2-8fd8d7f27baa                 │
│ Profile: full | Provider: Anthropic | claude-sonnet-4-5-20250929 │
│ Commands: /help | Multi-line: Ctrl-J | Exit: Ctrl-D              │
╰──────────────────────────────────────────────────────────────────╯

> Go look at this repo. https://github.com/microsoft/amplifier-foundation

Processing... (Ctrl-C to abort)

🧠 Thinking...

============================================================
Thinking:
------------------------------------------------------------
The user wants me to look at a GitHub repository:
https://github.com/microsoft/amplifier-foundation

I should use the github tool to explore this repository. Let
me start by getting information about the repository itself,
and then I can explore its contents.

First, I'll get the repository information, then list its
contents to understand its structure.
============================================================

│  📊 Token Usage
└─ Input: 14,382 | Output: 328 | Total: 14,710

🔧 Using tool: github
   Arguments: {'operation': 'get_repository', 'parameters': {'owner': 'microsoft', 'repo': 'amplifier-foundation'}}
❌ Tool result: github
   {'success': False, 'output': None, 'error': {'message': 'repository parameter is required', 'code': 'MISSING_PARAMETER'}}


🔧 Using tool: github
   Arguments: {'operation': 'list_repository_contents', 'parameters': {'owner': 'microsoft', 'repo': 'amplifier-foundation', 'path': ''}}
❌ Tool result: github
   {'success': False, 'output': None, 'error': {'message': 'repository parameter is required', 'code': 'MISSING_PARAMETER'}}


🔧 Using tool: github
   Arguments: {'operation': 'get_file_content', 'parameters': {'owner': 'microsoft', 'repo': 'amplifier-foundation', 'path': 'README.md'}}
❌ Tool result: github
   {'success': False, 'output': None, 'error': {'message': 'repository and path parameters are required', 'code': 'MISSING_PARAMETER'}}


🧠 Thinking...

============================================================
Thinking:
------------------------------------------------------------
The GitHub tool calls failed because I didn't format the
parameters correctly. Looking at the tool description, it
seems I need to provide the repository in a different
format. Let me try using the web_fetch tool to get
information about the repository instead.

Actually, let me use web_fetch to look at the GitHub
repository directly via the web interface.
============================================================

│  📊 Token Usage
└─ Input: 14,723 | Output: 143 | Total: 14,866

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://github.com/microsoft/amplifier-foundation'}
✅ Tool result: web_fetch
   {'url': 'https://github.com/microsoft/amplifier-foundation', 'content': 'GitHub - microsoft/amplifier-foundation: Foundation library for the Amplifier project\nSkip to content\nNavigation Menu\nToggle... (10766 more chars)


🧠 Thinking...

============================================================
Thinking:
------------------------------------------------------------
The user wants me to look at the amplifier-foundation
repository. I've successfully fetched the GitHub page, and I
can see it's the "Foundation library for the Amplifier
project" from Microsoft.

Let me summarize what I've learned:

amplifier-foundation is a foundational library for the
Amplifier ecosystem that provides:

 1 Bundle System - Load, compose, validate, and resolve
   bundles from local and remote sources
 2 @Mention System - Parse and resolve @namespace:path
   references in instructions
 3 Utilities - YAML/frontmatter I/O, dict merging, path
   handling, caching
 4 Reference Content - Reusable providers, agents,
   behaviors, and context files

Key features:

 • Load bundles from local paths or git URLs
 • Compose bundles together (later overrides earlier)
 • Create sessions and execute
 • Parse git URIs
 • Deep merge dictionaries
 • Parse markdown frontmatter

The repo includes:

 • Bundle system (bundle.py, registry.py, validator.py)
 • @Mention system for resolving references
 • Various utilities for I/O, dicts, paths, caching
 • Reference content (providers, agents, behaviors, context,
   bundles)

Philosophy:

 • Mechanism, not policy
 • Ruthless simplicity
 • Text-first (YAML/Markdown)
 • Composable

This looks like the foundation layer that powers Amplifier's
modular bundle system. The user might want to understand it
better, contribute to it, or use it in some way.
============================================================

│  📊 Token Usage
└─ Input: 18,228 | Output: 834 | Total: 19,062

Amplifier:
I've looked at the amplifier-foundation repository. This is a foundational library for the Amplifier ecosystem that provides the core infrastructure for bundle management and composition.


Key Components

Bundle System

 • Load, compose, validate, and resolve bundles from local and remote sources
 • Support for git URLs (e.g., git+https://github.com/microsoft/amplifier-foundation@main)
 • Bundle composition where later bundles override earlier ones
 • Registry to track loaded bundles and check for updates

@Mention System

 • Parse and resolve @namespace:path references in instructions
 • Base resolvers and content deduplication
 • This is what powers the @foundation:context/... style references you see throughout Amplifier

Utilities

 • YAML/frontmatter I/O with cloud sync retry
 • Dict operations (deep merge, nested get/set)
 • Path and URI handling
 • Caching with TTL support

Reference Content The repo includes reusable content like:

 • providers/ - Provider configurations (Anthropic, OpenAI, Azure, Ollama)
 • agents/ - Reusable agent definitions
 • behaviors/ - Behavioral configurations (logging, redaction, status)
 • context/ - Shared context files
 • bundles/ - Complete bundle examples


Philosophy

Follows Amplifier's core principles:

 • Mechanism, not policy - Provides loading/composition mechanisms, apps decide usage
 • Ruthless simplicity - One concept (bundle), one mechanism (includes + compose)
 • Text-first - YAML/Markdown formats are human-readable, diffable, versionable
 • Composable - Small bundles compose into larger configurations

This is essentially the "engine" that powers Amplifier's modular architecture and the bundle system that allows for flexible, composable configurations.

Would you like me to explore any specific part of this repository in more detail, such as the bundle composition logic, the @mention resolution system, or the reference content structure?

> What is a bundle? In fact, what are all the primitives in this thing called amplifier? And how do they relate to one another?

Processing... (Ctrl-C to abort)

🧠 Thinking...

============================================================
Thinking:
------------------------------------------------------------
This is a great question about the core primitives and
architecture of Amplifier. Let me dig into the foundation
repository to understand the fundamental building blocks. I
should look at:

 1 The CONCEPTS.md file - likely explains the mental model
 2 The bundle structure and code
 3 How bundles, agents, providers, behaviors, and other
   components relate to each other

Let me fetch the documentation files to give a comprehensive
answer.
============================================================

│  📊 Token Usage
└─ Input: 18,729 | Output: 342 | Total: 19,071

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-foundation/main/CONCEPTS.md'}

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-foundation/main/PATTERNS.md'}

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-foundation/main/bundle.md'}

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-foundation/main/API_REFERENCE.md'}
❌ Tool result: web_fetch
   {'success': False, 'output': None, 'error': {'message': 'HTTP 404: Not Found'}}

❌ Tool result: web_fetch
   {'success': False, 'output': None, 'error': {'message': 'HTTP 404: Not Found'}}

❌ Tool result: web_fetch
   {'success': False, 'output': None, 'error': {'message': 'HTTP 404: Not Found'}}

✅ Tool result: web_fetch
   {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-foundation/main/bundle.md', 'content': '---\nbundle:\n  name: foundation\n  version: 1.0.0\n  description: Foundation bundle - provider-a... (6918 more chars)


🧠 Thinking...

============================================================
Thinking:
------------------------------------------------------------
The user wants to understand the primitives in Amplifier and
how they relate to each other. Let me explore the repository
more thoroughly to find documentation about the core
concepts.

I found the bundle.md file which shows an example bundle
structure. Let me look for more documentation files and
explore the structure to understand the primitives better.

I should look at:

 1 The docs directory
 2 The amplifier_foundation directory to see the code
   structure
 3 Any README or documentation files in key directories
 4 The examples directory

Let me use web_fetch to explore the repository structure
more thoroughly.
============================================================

│  📊 Token Usage
└─ Input: 21,019 | Output: 376 | Total: 21,395

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://api.github.com/repos/microsoft/amplifier-foundation/contents/docs'}

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://api.github.com/repos/microsoft/amplifier-foundation/contents/'}

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-foundation/main/docs/CONCEPTS.md'}

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-foundation/main/docs/PATTERNS.md'}
✅ Tool result: web_fetch
   {'url': 'https://api.github.com/repos/microsoft/amplifier-foundation/contents/docs', 'content': '[{"name":"API_REFERENCE.md","path":"docs/API_REFERENCE.md","sha":"dc5704eb826db6aadfd211160bc4531a3f7d2... (4357 more chars)

✅ Tool result: web_fetch
   {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-foundation/main/docs/CONCEPTS.md', 'content': '# Core Concepts\n\nMental model for Amplifier Foundation. For code examples, see [PATTERNS... (3119 more chars)

✅ Tool result: web_fetch
   {'url': 'https://api.github.com/repos/microsoft/amplifier-foundation/contents/', 'content': '[{"name":".gitignore","path":".gitignore","sha":"59ab2dca6bcb8be4f6e47202adca3090bb8e3c7e","size":933,"url"... (14779 more chars)

✅ Tool result: web_fetch
   {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-foundation/main/docs/PATTERNS.md', 'content': '# Common Patterns\n\nPractical patterns for using Amplifier Foundation.\n\n## Bundle Organ... (9082 more chars)


🧠 Thinking...

============================================================
Thinking:
------------------------------------------------------------
Great! Now I have the docs. Let me synthesize what I've
learned about Amplifier's primitives and how they relate to
each other.

From the documentation, I can see:

 1 Bundle - The core concept: a composable configuration
   unit that produces a mount plan
 2 Mount Plan - The final configuration dict consumed by
   AmplifierSession
 3 PreparedBundle - A bundle ready for execution with all
   modules activated
 4 Session (AmplifierSession) - The execution environment
   where the AI actually runs
 5 Modules - The building blocks:
    • Orchestrator (session management)
    • Context manager (context handling)
    • Providers (LLM backends)
    • Tools (agent capabilities)
    • Hooks (observability and control)
    • Agents (named agent configurations)
 6 @Mention system - Reference system for including context
   files
 7 BundleRegistry - Tracks loaded bundles

Let me also fetch more information about the module system
and how agents work to give a complete picture.
============================================================

│  📊 Token Usage
└─ Input: 33,140 | Output: 382 | Total: 33,522

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-foundation/main/docs/BUNDLE_GUIDE.md'}

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://api.github.com/repos/microsoft/amplifier-foundation/contents/agents'}
✅ Tool result: web_fetch
   {'url': 'https://api.github.com/repos/microsoft/amplifier-foundation/contents/agents', 'content': '[{"name":"bug-hunter.md","path":"agents/bug-hunter.md","sha":"50a964e5d1dd51368d4e2a5e67934d395f8a2ed... (8240 more chars)

✅ Tool result: web_fetch
   {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-foundation/main/docs/BUNDLE_GUIDE.md', 'content': '# Creating Bundles with amplifier-foundation\n\n**Purpose**: Guide for creating bundle... (10276 more chars)


🧠 Thinking...

============================================================
Thinking:
------------------------------------------------------------
Great! Now I have a good understanding of the
amplifier-foundation repository and its concepts. Let me
synthesize this information to answer the user's question
about what a bundle is and what all the primitives in
Amplifier are.

From what I've gathered:

  1 Bundle - The core primitive. A composable configuration
    unit (markdown file with YAML frontmatter) that produces
    a mount plan for AmplifierSession
  2 Mount Plan - The final configuration dict consumed by
    AmplifierSession
  3 PreparedBundle - A bundle ready for execution with all
    modules activated
  4 Session - An AmplifierSession that executes prompts
  5 Modules - Pluggable components that provide
    functionality (tools, providers, orchestrators, etc.)
  6 Agents - Sub-agent configurations that can be spawned
    for specialized tasks
  7 Tools - Capabilities the agent can use (filesystem,
    bash, web, etc.)
  8 Providers - LLM backend configurations (Anthropic,
    OpenAI, Azure, Ollama)
  9 Hooks - Observability and control mechanisms
 10 Context - Context files to include
 11 @Mentions - A way to reference files using
    @namespace:path syntax

Let me organize this into a clear, comprehensive
explanation.
============================================================

│  📊 Token Usage
└─ Input: 40,159 | Output: 1,998 | Total: 42,157

Amplifier:
Great question! Let me break down the core primitives and concepts in Amplifier and how they relate to each other.


The Core Primitives

1. Bundle (The Foundational Primitive)

A bundle is a composable configuration unit - essentially a markdown file with YAML frontmatter. Think of it as a "configuration package" that defines everything needed for an AI agent
session.

A bundle contains:

 • Metadata (name, version, description)
 • Session configuration (orchestrator, context manager)
 • Providers (LLM backends like Anthropic, OpenAI, Azure)
 • Tools (capabilities like filesystem, bash, web access)
 • Hooks (observability and control points)
 • Agents (sub-agent definitions)
 • Context (files to include in context)
 • Instructions (system prompts in markdown)

2. Modules

Pluggable components that provide functionality. Each module type serves a specific purpose:

 • tool-* - Capabilities (filesystem, bash, web, search, task delegation)
 • provider-* - LLM backends
 • orchestrator-* - Control flow (like loop-streaming)
 • context-* - Context management strategies
 • hooks-* - Cross-cutting concerns (logging, redaction, status)

Modules have a mount() function that integrates them into the session.

3. Agents

Specialized AI configurations for specific tasks. Each agent is itself a bundle with:

 • Custom instructions
 • Specific provider configurations (e.g., lower temperature for deterministic tasks)
 • Access to relevant tools

Examples from foundation: bug-hunter, zen-architect, modular-builder, security-guardian

4. Session (AmplifierSession)

The runtime environment where prompts are executed. Created from a PreparedBundle:


 async with prepared.create_session() as session:
 response = await session.execute("Hello!")


5. Mount Plan

The final configuration dictionary consumed by AmplifierSession. Contains:

 • session config
 • providers list
 • tools list
 • hooks list
 • agents dict

6. @Mentions

A reference system using @namespace:path syntax to include files from bundles:


 See @foundation:context/guidelines.md for guidelines.


This allows instructions to reference documentation without hardcoding paths.


How They Relate: The Flow


 ┌─────────────────────────────────────────────────────┐
 │ 1. BUNDLE (Configuration) │
 │ - YAML frontmatter + Markdown instructions │
 │ - Defines: tools, agents, providers, hooks │
 └──────────────────┬──────────────────────────────────┘
 │
 ▼
 ┌─────────────────────────────────────────────────────┐
 │ 2. COMPOSITION (Optional) │
 │ base.compose(overlay) # Later overrides earlier │
 │ - Includes other bundles │
 │ - Merges configurations │
 └──────────────────┬──────────────────────────────────┘
 │
 ▼
 ┌─────────────────────────────────────────────────────┐
 │ 3. MOUNT PLAN │
 │ bundle.to_mount_plan() │
 │ - Resolves all includes │
 │ - Flattens configuration │
 └──────────────────┬──────────────────────────────────┘
 │
 ▼
 ┌─────────────────────────────────────────────────────┐
 │ 4. PREPARED BUNDLE │
 │ await bundle.prepare() │
 │ - Downloads modules from git if needed │
 │ - Installs dependencies │
 │ - Activates module resolver │
 └──────────────────┬──────────────────────────────────┘
 │
 ▼
 ┌─────────────────────────────────────────────────────┐
 │ 5. SESSION (Runtime) │
 │ async with prepared.create_session() as session: │
 │ - Mounts all modules (calls their mount()) │
 │ - Creates coordinator with tools, hooks │
 │ - Ready to execute prompts │
 └──────────────────┬──────────────────────────────────┘
 │
 ▼
 ┌─────────────────────────────────────────────────────┐
 │ 6. EXECUTION │
 │ await session.execute("prompt") │
 │ - Orchestrator manages the conversation loop │
 │ - Tools are invoked as needed │
 │ - Hooks observe/modify behavior │
 └─────────────────────────────────────────────────────┘



Example: A Complete Bundle


 ---
 bundle:
 name: my-app
 version: 1.0.0

 includes:
 - bundle: foundation # Inherit foundation's tools and agents

 session:
 orchestrator:
 module: loop-streaming
 source: git+https://github.com/microsoft/amplifier-module-loop-streaming@main
 context:
 module: context-simple
 source: git+https://github.com/microsoft/amplifier-module-context-simple@main

 providers:
 - module: provider-anthropic
 source: git+https://github.com/microsoft/amplifier-module-provider-anthropic@main
 config:
 default_model: claude-sonnet-4-5

 tools:
 - module: tool-filesystem
 source: git+https://github.com/microsoft/amplifier-module-tool-filesystem@main
 - module: tool-bash
 source: git+https://github.com/microsoft/amplifier-module-tool-bash@main

 agents:
 include:
 - foundation:bug-hunter
 - foundation:zen-architect
 ---

 # System Instructions

 You are a helpful coding assistant.

 For guidelines, see @my-app:docs/GUIDELINES.md



Key Insights

 1 Everything is a Bundle: Even agents are bundles. The system is turtles all the way down.
 2 Composition Over Inheritance: Bundles compose (like layers) rather than inherit. Later bundles override earlier ones.
 3 Modules = Plugins: The module system makes everything pluggable. Want a different LLM? Swap the provider module.
 4 Text-First Philosophy: Everything is human-readable YAML/Markdown. No binary formats.
 5 Mechanism, Not Policy: The foundation library provides the loading/composition mechanism. Your app decides which bundles to use (policy).

Does this clarify the architecture? Would you like me to dive deeper into any specific primitive or concept?

> I see in the example above you're specifying agents and tools. If those were already set in the foundation bundle, would I need to add them here to? I.e. does this bundles layer on top
   of one another or do they replace then?

Processing... (Ctrl-C to abort)

🧠 Thinking...

============================================================
Thinking:
------------------------------------------------------------
Great question! This is about the composition/merge
semantics of bundles. Let me look back at what I learned
from the documentation about how bundles compose.

From the CONCEPTS.md file, I saw this:

                        Merge Rules


  Section       Rule
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  session       Deep merge (nested dicts merged)
  providers     Merge by module ID
  tools         Merge by module ID
  hooks         Merge by module ID
  instruction   Replace (later wins)


And it said: "Module ID merge: Same ID = update config, new
ID = add to list."

So it's additive for tools, agents, etc. If foundation
bundle has tool-filesystem and you don't mention it, you
still get it. If you DO mention it in your bundle, you're
updating its config, not replacing the entire tools list.

Let me confirm this understanding and provide a clear
explanation with examples.
============================================================

│  📊 Token Usage
└─ Input: 41,902 | Output: 1,383 | Total: 43,285

Amplifier:
Excellent question! This gets at the heart of bundle composition. The answer is: they layer on top of each other - it's additive, not replacement.


How Bundle Composition Works

When you do:


 includes:
 - bundle: foundation


You inherit everything from the foundation bundle. Then your bundle's configuration layers on top using specific merge rules.

Merge Rules by Section


  Section       Behavior             Example
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  tools         Merge by module ID   Foundation has tool-filesystem, you don't mention it → you still get it
  agents        Merge by name        Foundation has bug-hunter, you don't mention it → you still get it
  providers     Merge by module ID   Same as tools
  hooks         Merge by module ID   Same as tools
  session       Deep merge           Your config merges into foundation's session config
  instruction   Replace entirely     Your markdown replaces foundation's (later wins)


The "Module ID Merge" Pattern

For tools, providers, and hooks:

 • Same module ID = Update/override config for that module
 • New module ID = Add to the list
 • Not mentioned = Keep the inherited one as-is


Practical Examples

Example 1: You Just Want Everything from Foundation


 ---
 bundle:
 name: my-app
 version: 1.0.0

 includes:
 - bundle: foundation

 providers:
 - module: provider-anthropic
 config:
 default_model: claude-sonnet-4-5 # Override just the model
 ---

 # Your instructions


Result:

 • ✅ You get ALL foundation's tools (filesystem, bash, web, search, task)
 • ✅ You get ALL foundation's agents (bug-hunter, zen-architect, etc.)
 • ✅ You get ALL foundation's hooks (logging, status, redaction, etc.)
 • ✅ You override ONLY the Anthropic provider's model config

Example 2: Adding a New Tool


 ---
 includes:
 - bundle: foundation

 tools:
 - module: tool-my-custom-tool # NEW tool
 source: ./modules/my-tool
 ---


Result:

 • ✅ All foundation tools (filesystem, bash, web, etc.)
 • ✅ PLUS your new custom tool

Example 3: Overriding a Tool's Config


 ---
 includes:
 - bundle: foundation

 tools:
 - module: tool-bash # SAME ID as foundation's
 config:
 timeout: 120 # Override timeout config
 ---


Result:

 • ✅ All foundation tools
 • ✅ The tool-bash now has your custom timeout config
 • ✅ Other foundation tools unchanged

Example 4: You Don't Need to Repeat Agents

If foundation includes:


 agents:
 include:
 - foundation:bug-hunter
 - foundation:zen-architect


And you do:


 includes:
 - bundle: foundation

 # You don't need to list agents again!


Result: You automatically get bug-hunter and zen-architect because they're inherited.


When You DO Need to List Things

You only need to explicitly list tools/agents/providers when you want to:

 1 Add new ones beyond what foundation provides
 2 Override configuration for existing ones
 3 Exclude something (this is trickier - you'd need to compose selectively)


The Foundation Bundle

Looking at the actual foundation bundle.md, it includes:

Tools:

 • tool-filesystem
 • tool-bash
 • tool-web
 • tool-search
 • tool-task

Agents:

 • bug-hunter
 • explorer
 • integration-specialist
 • modular-builder
 • post-task-cleanup
 • security-guardian
 • session-finder
 • test-coverage
 • zen-architect

Behaviors/Hooks:

 • logging
 • status-context
 • redaction
 • todo-reminder
 • streaming-ui

When you include foundation, you get all of this automatically.


So Your Minimal Bundle Could Be:


 ---
 bundle:
 name: my-app
 version: 1.0.0

 includes:
 - bundle: foundation

 providers:
 - module: provider-anthropic
 config:
 default_model: claude-sonnet-4-5
 ---

 # Your custom instructions here


And that's it! You get all the tools, agents, and behaviors from foundation without having to repeat them.

Does this clarify the composition model?

> Yes, that helps.  how are modules composed? What's the difference between a hook and a tool and context and orchestrators? When should I use which?

Processing... (Ctrl-C to abort)

🧠 Thinking...

============================================================
Thinking:
------------------------------------------------------------
Great question! The user is asking about the different types
of modules and when to use each. Let me explore the
amplifier-foundation repo more to understand the module
system better.

I should look at:

 1 What makes a module
 2 The different module types (hooks, tools, context
   managers, orchestrators, providers)
 3 How they're mounted and composed
 4 When to use each

Let me fetch some examples and the actual module
implementations to understand the patterns.
============================================================

│  📊 Token Usage
└─ Input: 43,091 | Output: 292 | Total: 43,383

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://api.github.com/repos/microsoft/amplifier-foundation/contents/amplifier_foundation'}

🔧 Using tool: web_search
   Arguments: {'query': 'amplifier module mount function architecture site:github.com/microsoft'}

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-foundation/main/docs/API_REFERENCE.md'}
✅ Tool result: web_fetch
   {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-foundation/main/docs/API_REFERENCE.md', 'content': '# API Reference\n\nThe amplifier-foundation API is fully documented via Python docstr... (5526 more chars)

✅ Tool result: web_fetch
   {'url': 'https://api.github.com/repos/microsoft/amplifier-foundation/contents/amplifier_foundation', 'content': '[{"name":"__init__.py","path":"amplifier_foundation/__init__.py","sha":"fca138f33f980b9... (12321 more chars)

✅ Tool result: web_search
   {'query': 'amplifier module mount function architecture site:github.com/microsoft', 'results': [{'title': 'amplifier-core/docs/specs/MOUNT_PLAN_SPECIFICATION ... - GitHub', 'url': 'https://github.com/... (1894 more chars)


🧠 Thinking...

============================================================
Thinking:
------------------------------------------------------------
The user is asking about how modules are composed and the
differences between hooks, tools, context, and
orchestrators. This is a great architectural question. Let
me fetch some more information about the module system and
mount plans.
============================================================

│  📊 Token Usage
└─ Input: 50,371 | Output: 250 | Total: 50,621

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-core/main/docs/specs/MOUNT_PLAN_SPECIFICATION.md'}

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-core/main/docs/MODULE_MOUNT_PROTOCOL.md'}

🔧 Using tool: web_search
   Arguments: {'query': 'amplifier-core mount protocol coordinator mount_points site:github.com/microsoft'}
❌ Tool result: web_fetch
   {'success': False, 'output': None, 'error': {'message': 'HTTP 404: Not Found'}}

✅ Tool result: web_fetch
   {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-core/main/docs/specs/MOUNT_PLAN_SPECIFICATION.md', 'content': '---\nspec_type: kernel_contract\nlast_modified: 2025-01-29\nrelated_contra... (12420 more chars)

✅ Tool result: web_search
   {'query': 'amplifier-core mount protocol coordinator mount_points site:github.com/microsoft', 'results': [{'title': 'amplifier-core/docs/specs/MOUNT_PLAN_SPECIFICATION ... - GitHub', 'url': 'https://g... (1545 more chars)


🧠 Thinking...

============================================================
Thinking:
------------------------------------------------------------
The user is asking about how modules are composed and the
differences between hooks, tools, context, and
orchestrators. This is a great question about the Amplifier
architecture. Let me fetch more information about the
contracts for these different module types to give a
comprehensive answer.
============================================================

│  📊 Token Usage
└─ Input: 54,776 | Output: 328 | Total: 55,104

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-core/main/docs/contracts/TOOL_CONTRACT.md'}

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-core/main/docs/contracts/HOOK_CONTRACT.md'}

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-core/main/docs/contracts/ORCHESTRATOR_CONTRACT.md'}

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-core/main/docs/contracts/CONTEXT_CONTRACT.md'}
✅ Tool result: web_fetch
   {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-core/main/docs/contracts/CONTEXT_CONTRACT.md', 'content': '---\ncontract_type: module_specification\nmodule_type: context\ncontract_versi... (9488 more chars)

✅ Tool result: web_fetch
   {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-core/main/docs/contracts/ORCHESTRATOR_CONTRACT.md', 'content': '---\ncontract_type: module_specification\nmodule_type: orchestrator\ncont... (9358 more chars)

✅ Tool result: web_fetch
   {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-core/main/docs/contracts/HOOK_CONTRACT.md', 'content': '---\ncontract_type: module_specification\nmodule_type: hook\ncontract_version: 1.... (7749 more chars)

✅ Tool result: web_fetch
   {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-core/main/docs/contracts/TOOL_CONTRACT.md', 'content': '---\ncontract_type: module_specification\nmodule_type: tool\ncontract_version: 1.... (7405 more chars)


🧠 Thinking...

============================================================
Thinking:
------------------------------------------------------------
Great! Now I have the full picture of how modules work in
Amplifier. Let me synthesize this into a comprehensive
answer about how modules compose and the differences between
the module types.

The user is asking about:

 1 How modules are composed
 2 The difference between hooks, tools, context managers,
   and orchestrators
 3 When to use which

I now have the complete picture from the contracts. Let me
create a comprehensive answer.
============================================================

│  📊 Token Usage
└─ Input: 66,606 | Output: 2,456 | Total: 69,062

Amplifier:
Excellent question! This gets to the heart of Amplifier's architecture. Let me break down how modules work and when to use each type.


How Modules Are Composed

All modules follow the same mount pattern:


 async def mount(coordinator: ModuleCoordinator, config: dict) -> ModuleType | Callable | None:
 """
 1. Initialize the module with config
 2. Register with coordinator at appropriate mount point
 3. Return instance or cleanup callable
 """
 module = MyModule(config)
 await coordinator.mount("mount_point_name", module)
 return module


Each module is discovered via Python entry points in pyproject.toml:


 [project.entry-points."amplifier.modules"]
 my-module = "my_module:mount"


When a session starts, the kernel:

 1 Loads all specified modules from the Mount Plan
 2 Calls each module's mount() function
 3 Passes a ModuleCoordinator that provides access to session state
 4 Modules register themselves at specific mount points


The Four Module Types

Think of them as different responsibility layers in the execution flow:

1. Orchestrator (The Control Flow)

What it does: Controls HOW the agent loop executes

Mount point: session.orchestrator

Responsibility:

 • Manage the prompt → LLM → tool → LLM cycle
 • Decide when to call the LLM vs tools
 • Emit lifecycle events (provider:request, tool:pre, etc.)
 • Handle streaming, error recovery, iteration limits

When to use:

 • You want a different execution strategy (basic loop vs streaming vs event-driven)
 • You need custom control flow (parallel tool execution, multi-agent orchestration)

Example: loop-streaming orchestrator provides real-time streaming responses

You typically have: Exactly one orchestrator per session

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
2. Context Manager (The Memory)

What it does: Controls WHAT the agent remembers

Mount point: session.context

Responsibility:

 • Store conversation messages
 • Track token usage
 • Decide when/how to compact context (summarize old messages)
 • Optionally persist across sessions

When to use:

 • You need different memory strategies (in-memory vs persistent)
 • You want custom compaction logic (summarization, importance-based)
 • You need session resumption

Example: context-simple keeps everything in memory, context-persistent saves to disk

You typically have: Exactly one context manager per session

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
3. Tools (The Capabilities)

What tools do: Give the agent capabilities to DO things

Mount point: coordinator.mount("tools", tool, name="tool-name")

Responsibility:

 • Execute specific actions (read file, run command, fetch URL)
 • Return structured results (success/failure, output/error)
 • Validate inputs before execution

When to use:

 • You want to give agents new capabilities
 • You need domain-specific operations
 • You want to enable external system integration

Example: tool-filesystem for file operations, tool-bash for commands

You typically have: Multiple tools (0 to many)

Protocol:


 class Tool:
 name: str
 description: str
 async def execute(self, input: dict) -> ToolResult


───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
4. Hooks (The Cross-Cutting Concerns)

What hooks do: Observe, validate, and control execution WITHOUT being invoked directly

Mount point: Register with coordinator.hooks.register(event, handler)

Responsibility:

 • Observe: Log events, collect metrics, audit trails
 • Validate: Security checks, approval gates, input validation
 • Control: Block operations, modify data, inject feedback
 • Augment: Add context, provide corrections

When to use:

 • You need observability (logging, metrics, tracing)
 • You need security gates (approval for dangerous operations)
 • You need automated feedback loops (linter errors injected as context)
 • You need output control (redaction, formatting)

Example: hooks-logging logs all events, hooks-approval gates dangerous operations

You typically have: Multiple hooks (0 to many)

Protocol:


 class HookHandler:
 async def __call__(self, event: str, data: dict) -> HookResult


Hook actions:

 • continue - Just observing, proceed normally
 • deny - Block the operation
 • modify - Transform the data
 • inject_context - Add feedback to agent's context
 • ask_user - Request approval

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

The Execution Flow with All Module Types


 User Prompt
 │
 ▼
 ┌─────────────────────────────────────────┐
 │ ORCHESTRATOR (controls the flow) │
 │ │
 │ 1. Add prompt to CONTEXT │
 │ └─> Context: stores message │
 │ │
 │ 2. Hook: prompt:submit │
 │ └─> Hooks: observe, validate │
 │ │
 │ 3. Call Provider (LLM) │
 │ Hook: provider:request │
 │ Provider: generates response │
 │ Hook: provider:response │
 │ │
 │ 4. Add response to CONTEXT │
 │ │
 │ 5. If tool_calls in response: │
 │ For each tool: │
 │ Hook: tool:pre │
 │ └─> Can deny, modify, approve │
 │ TOOL: execute(input) │
 │ └─> Does the actual work │
 │ Hook: tool:post │
 │ └─> Can inject feedback │
 │ Add result to CONTEXT │
 │ │
 │ 6. Check if CONTEXT needs compaction │
 │ └─> Context: compact if needed │
 │ │
 │ 7. Loop back to step 3 if more tools │
 │ │
 └─────────────────────────────────────────┘
 │
 ▼
 Final Response



Key Differences Summary


  Type           Invoked By        Purpose                  Quantity   Examples
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Orchestrator   Session           Control execution flow   1          loop-streaming, loop-basic
  Context        Orchestrator      Manage memory            1          context-simple, context-persistent
  Tool           Agent (via LLM)   Perform actions          0-many     filesystem, bash, web, search
  Hook           Events            Cross-cutting concerns   0-many     logging, approval, redaction



Decision Guide: When to Use Which?

Create a Tool when:

 • ✅ The agent needs to actively DO something
 • ✅ The capability should be discoverable by the LLM
 • ✅ It's an action the agent chooses to take
 • Example: "Read this file", "Run this command", "Search the web"

Create a Hook when:

 • ✅ You need passive observation of events
 • ✅ You need to validate or control operations
 • ✅ You want automated feedback without agent decision
 • ✅ It's a system concern, not an agent action
 • Example: "Log all LLM calls", "Block writes to /etc", "Auto-inject lint errors"

Create a Context Manager when:

 • ✅ You need custom memory strategy
 • ✅ You want different compaction logic
 • ✅ You need persistence or session resumption
 • Example: "Summarize old messages", "Persist to database", "Importance-based memory"

Create an Orchestrator when:

 • ✅ You need different execution strategy
 • ✅ You want custom control flow
 • ✅ You need specialized loop behavior
 • Example: "Real-time streaming", "Parallel tool execution", "Event-driven workflows"


Module Composition Example

Here's how they all work together in a bundle:


 session:
 orchestrator: loop-streaming # HOW to execute
 context: context-persistent # WHAT to remember

 tools: # WHAT the agent can DO
 - module: tool-filesystem
 - module: tool-bash
 - module: tool-web

 hooks: # HOW to observe/control
 - module: hooks-logging # Observe all events
 config:
 output_dir: .amplifier/logs

 - module: hooks-approval # Control dangerous ops
 config:
 require_approval:
 - write_to_production

 - module: hooks-redaction # Augment output
 config:
 redact_patterns:
 - api_key: "API_KEY_***"


During execution:

 1 Orchestrator runs the loop
 2 Context stores messages as they flow
 3 Tools execute when the LLM requests them
 4 Hooks observe/control at every step


The Power of Modularity

This design lets you swap policies without touching code:

 • Swap loop-basic → loop-streaming = streaming responses
 • Swap context-simple → context-persistent = session resumption
 • Add hooks-approval = safety gates
 • Add tool-custom = new capability

All without modifying the kernel or other modules!

Does this clarify the module architecture and when to use each type?

> Yes it does. What is a recipe?

Processing... (Ctrl-C to abort)

🧠 Thinking...

============================================================
Thinking:
------------------------------------------------------------
The user is asking about recipes in the Amplifier ecosystem.
From what I saw earlier in the bundle.md file, there was a
mention of recipes and a recipes tool. Let me search for
more information about what recipes are in Amplifier.

I should look for:

 1 The recipes bundle/module
 2 Documentation about what recipes are
 3 Examples of recipes

Let me search for this information.
============================================================

│  📊 Token Usage
└─ Input: 68,969 | Output: 205 | Total: 69,174

🔧 Using tool: web_search
   Arguments: {'query': 'amplifier-bundle-recipes github microsoft'}

🔧 Using tool: web_search
   Arguments: {'query': '"amplifier recipes" YAML workflow site:github.com/microsoft'}
✅ Tool result: web_search
   {'query': 'amplifier-bundle-recipes github microsoft', 'results': [{'title': 'GitHub - microsoft/amplifier', 'url': 'https://github.com/microsoft/amplifier', 'snippet': 'Contribute to microsoft/amplif... (2040 more chars)

✅ Tool result: web_search
   {'query': '"amplifier recipes" YAML workflow site:github.com/microsoft', 'results': [{'title': 'GitHub - microsoft/amplifier', 'url': 'https://github.com/microsoft/amplifier', 'snippet': "This CLI is ... (1616 more chars)


🧠 Thinking...

============================================================
Thinking:
------------------------------------------------------------
The user is asking about recipes in Amplifier. From the
context I've been reading, I saw mentions of recipes in the
foundation bundle.md file. Let me search for more specific
information about the recipes system.

From the bundle.md I fetched earlier, I saw:


 includes:
   - bundle:
 git+https://github.com/microsoft/amplifier-bundle-recipes@
 main


And in the instructions:


 ## Tool Usage Policy

 - IMPORTANT: For anything more than trivial tasks, make
 sure to use the todo tool to plan and track tasks
 throughout the conversation.
 - For complex multi-step workflows, use the **recipes**
 tool to define and execute declarative YAML-based
 workflows with context accumulation, approval gates, and
 resumability.

 ## Recipe System

 You have access to the **recipes** tool for multi-step AI
 agent orchestration. Recipes are YAML-defined workflows
 that execute sequences of agent tasks.

 **Key operations:**
 - `execute` - Run a recipe from a YAML file
 - `resume` - Continue a paused or interrupted recipe
 - `list` - Show recipe sessions and their status
 - `validate` - Check recipe YAML before execution

 **Available agents for recipe authoring:**
 - recipes:recipe-author - Conversational assistance for
 creating recipes
 - recipes:result-validator - Pass/fail validation of step
 outcomes

 **Documentation and examples:**
 - Schema: @recipes:docs/RECIPE_SCHEMA.md
 - Best practices: @recipes:docs/BEST_PRACTICES.md
 - Examples catalog: @recipes:docs/EXAMPLES_CATALOG.md
 - Example recipes:
 @recipes:examples/simple-analysis-recipe.yaml,
 @recipes:examples/code-review-recipe.yaml, etc.


So recipes are a declarative YAML-based workflow system for
multi-step AI agent orchestration. Let me search for the
actual amplifier-bundle-recipes repository to get more
details.
============================================================

│  📊 Token Usage
└─ Input: 70,802 | Output: 554 | Total: 71,356

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://github.com/microsoft/amplifier-bundle-recipes'}

🔧 Using tool: web_search
   Arguments: {'query': 'amplifier-bundle-recipes YAML workflow github microsoft'}
✅ Tool result: web_fetch
   {'url': 'https://github.com/microsoft/amplifier-bundle-recipes', 'content': 'GitHub - microsoft/amplifier-bundle-recipes: Recipes bundle for the Amplifier project\nSkip to content\nNavigation Menu\nTo... (12246 more chars)

✅ Tool result: web_search
   {'query': 'amplifier-bundle-recipes YAML workflow github microsoft', 'results': [{'title': 'GitHub - microsoft/amplifier', 'url': 'https://github.com/microsoft/amplifier', 'snippet': 'Build modules - ... (2118 more chars)


🧠 Thinking...

============================================================
Thinking:
------------------------------------------------------------
The user is asking about recipes in Amplifier. I found the
amplifier-bundle-recipes repository which gives me good
information. Let me also look for more detailed
documentation about recipe schemas and how they work.
============================================================

│  📊 Token Usage
└─ Input: 75,867 | Output: 257 | Total: 76,124

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-bundle-recipes/main/docs/RECIPE_SCHEMA.md'}

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-bundle-recipes/main/docs/RECIPES_GUIDE.md'}

🔧 Using tool: web_fetch
   Arguments: {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-bundle-recipes/main/examples/code-review-recipe.yaml'}
✅ Tool result: web_fetch
   {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-bundle-recipes/main/examples/code-review-recipe.yaml', 'content': 'name: "code-review-comprehensive"\ndescription: "Multi-stage code revi... (7091 more chars)

✅ Tool result: web_fetch
   {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-bundle-recipes/main/docs/RECIPES_GUIDE.md', 'content': '# Recipes Guide\n\n**Conceptual guide to creating and using Amplifier recipes**\n... (19545 more chars)

✅ Tool result: web_fetch
   {'url': 'https://raw.githubusercontent.com/microsoft/amplifier-bundle-recipes/main/docs/RECIPE_SCHEMA.md', 'content': '# Recipe Schema Reference\n\n**Complete YAML specification for Amplifier recipes*... (48277 more chars)


🧠 Thinking...

============================================================
Thinking:
------------------------------------------------------------
The user is asking what a recipe is in the context of
Amplifier. I've gathered extensive information from the
amplifier-bundle-recipes repository. Let me synthesize this
into a clear, comprehensive explanation.

Based on what I've learned:

 • Recipes are declarative YAML workflows that orchestrate
   multi-step AI agent workflows
 • They're part of the amplifier-bundle-recipes bundle
 • They provide a tool-recipes module and associated agents
 • They enable repeatable, resumable, multi-step agent
   orchestrations

I should explain:

 1 What recipes are at a high level
 2 How they work
 3 When to use them
 4 Give a clear example
 5 Show how they fit into the broader Amplifier architecture

The user doesn't need me to track todos here - they're just
asking a conceptual question.
============================================================

│  📊 Token Usage
└─ Input: 99,454 | Output: 2,385 | Total: 101,839

Amplifier:
Excellent question! Recipes are a higher-level abstraction built on top of Amplifier's module system. Let me explain what they are and how they fit into the architecture.


What is a Recipe?

A recipe is a declarative YAML specification that defines a multi-step AI agent workflow. Think of it as a "program" for orchestrating multiple agents in sequence (or parallel) to
accomplish complex tasks.

The Key Idea

Instead of manually coordinating multiple agent invocations in an interactive session, you write down the workflow once and let Amplifier execute it automatically.


 name: "code-review-comprehensive"
 description: "Multi-stage code review workflow"
 version: "1.0.0"

 context:
 file_path: "src/auth.py" # Input variables

 steps:
 - id: "analyze"
 agent: "zen-architect"
 mode: "ANALYZE"
 prompt: "Analyze {{file_path}} for issues"
 output: "analysis"

 - id: "suggest-improvements"
 agent: "zen-architect"
 mode: "ARCHITECT"
 prompt: "Based on {{analysis}}, suggest improvements"
 output: "improvements"

 - id: "validate"
 agent: "zen-architect"
 mode: "REVIEW"
 prompt: "Review these suggestions: {{improvements}}"
 output: "validation"



How Recipes Work

The Recipe Bundle

Recipes are provided by the amplifier-bundle-recipes bundle, which includes:

 1 tool-recipes - A tool module that executes recipe YAML files
 2 recipe-author - An agent that helps you create recipes conversationally
 3 result-validator - An agent for validation steps
 4 Complete documentation and examples

Execution Flow


 Recipe YAML File
 │
 ▼
 ┌─────────────────────────────────────────┐
 │ tool-recipes module │
 │ (invoked via tool call) │
 │ │
 │ 1. Parse YAML │
 │ 2. Validate structure │
 │ 3. Create session directory │
 │ 4. FOR EACH STEP: │
 │ ├─ Substitute context variables │
 │ ├─ Spawn sub-agent (via task tool) │
 │ ├─ Collect output │
 │ ├─ Update context │
 │ └─ Checkpoint state │
 │ 5. Return final results │
 └─────────────────────────────────────────┘


Key Features

1. Context Accumulation Each step can reference outputs from previous steps:


 steps:
 - id: "scan"
 prompt: "Scan {{file}}"
 output: "findings" # Stores result

 - id: "fix"
 prompt: "Fix: {{findings}}" # Uses previous output


2. Automatic Checkpointing Sessions persist to ~/.amplifier/projects/<project>/recipe-sessions/:

 • If interrupted, you can resume from last successful step
 • No lost work from transient errors

3. Conditional Execution Skip steps based on conditions:


 - id: "critical-fix"
 condition: "{{severity}} == 'critical'"
 prompt: "Fix critical issues"


4. Looping (foreach) Process lists with parallel or sequential execution:


 - id: "analyze-each"
 foreach: "{{files}}"
 as: "current_file"
 parallel: true # Run all concurrently
 prompt: "Analyze {{current_file}}"
 collect: "all_analyses"


5. Recipe Composition Recipes can invoke other recipes as sub-workflows:


 - id: "security-audit"
 type: "recipe"
 recipe: "security-audit.yaml"
 context:
 target: "{{file_path}}"


6. Approval Gates (Staged Mode) Pause for human review between stages:


 stages:
 - name: "planning"
 steps:
 - id: "plan"
 prompt: "Create upgrade plan"
 approval:
 required: true
 prompt: "Review plan before applying?"



How Recipes Fit Into Amplifier

Recipes are built using the primitives we discussed:


 ┌─────────────────────────────────────────────┐
 │ Your Application / CLI │
 │ │
 │ "execute code-review.yaml" │
 └──────────────────┬──────────────────────────┘
 │
 ▼
 ┌─────────────────────────────────────────────┐
 │ Session with Foundation Bundle │
 │ │
 │ • Orchestrator: loop-streaming │
 │ • Context: context-persistent │
 │ • Tools: filesystem, bash, web, recipes │ ◄─ Recipes tool
 │ • Agents: zen-architect, bug-hunter, etc. │
 └──────────────────┬──────────────────────────┘
 │
 ▼
 ┌─────────────────────────────────────────────┐
 │ tool-recipes Module │
 │ │
 │ • Parses recipe YAML │
 │ • Manages session state │
 │ • Orchestrates step execution │
 │ • Uses task tool to spawn sub-agents │
 └──────────────────┬──────────────────────────┘
 │
 ▼ (for each step)
 ┌─────────────────────────────────────────────┐
 │ Sub-Agent Session │
 │ │
 │ • Spawned via task tool │
 │ • Executes step prompt │
 │ • Returns result to recipe │
 └─────────────────────────────────────────────┘



When to Use Recipes

✅ Good Use Cases

 • Repeatable multi-step workflows: Code review, dependency upgrades, documentation generation
 • Complex orchestration: Multiple specialized agents, context flowing between steps
 • Long-running processes: Need checkpointing and resumability
 • Team workflows: Share standardized processes across team

❌ Not Ideal For

 • Simple single-agent tasks: Just use interactive session
 • Highly dynamic workflows: Better suited for interactive back-and-forth
 • Exploratory work: Recipe implies known process


Example: Using Recipes

Load the recipes bundle:


 amplifier run --bundle git+https://github.com/microsoft/amplifier-bundle-recipes@main


Execute a recipe:


 amplifier run "execute code-review-recipe.yaml with file_path=src/auth.py"


Create a recipe conversationally:


 amplifier run "I need to create a recipe for security auditing Python files"
 # The recipe-author agent guides you through the creation process


Resume an interrupted recipe:


 amplifier run "resume recipe session recipe_20251217_154000_abc123"


List active recipe sessions:


 amplifier run "list recipe sessions"



Recipes vs Direct Agent Delegation

Without recipes (interactive):


 You: "Analyze this code"
 Agent: [analysis]
 You: "Now suggest improvements based on that analysis"
 Agent: [improvements]
 You: "Now validate those suggestions"
 Agent: [validation]


 • Manual coordination
 • Context in conversation history
 • No resumability
 • Not repeatable

With recipes (declarative):


 steps:
 - id: "analyze"
 prompt: "Analyze code"
 - id: "improve"
 prompt: "Suggest improvements"
 - id: "validate"
 prompt: "Validate suggestions"


 • Automatic coordination
 • Explicit context flow
 • Fully resumable
 • Run anytime with one command


Summary: Recipes in the Architecture


  Primitive   What It Is                     Example
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Module      Pluggable component            tool-filesystem, provider-anthropic
  Bundle      Configuration package          foundation, amplifier-bundle-recipes
  Agent       Specialized AI configuration   zen-architect, bug-hunter
  Recipe      Multi-step agent workflow      code-review-recipe.yaml


Recipes are the "scripts" you write to automate complex multi-agent workflows.

They leverage:

 • Orchestrator to run the main session
 • Context manager to track state
 • Tools (especially tool-task) to spawn sub-agents
 • Agents to perform specialized work at each step
 • Hooks to observe execution

Does this clarify what recipes are and how they fit into Amplifier's architecture?

> Yes, it does. Thank you.





───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

Amplifier:
Perfect! Here's the complete markdown content. Simply copy this and save it as C:\Users\malicata\source\.planning\amplifier-architecture-guide.md:


 # Amplifier Architecture Guide

 **Reference documentation for understanding Amplifier's core concepts and primitives**

 *Last updated: 2025-12-17*

 ---

 ## Table of Contents

 1. [Overview](#overview)
 2. [Core Primitives](#core-primitives)
 3. [Bundles](#bundles)
 4. [Modules](#modules)
 5. [Agents](#agents)
 6. [Recipes](#recipes)
 7. [How They All Work Together](#how-they-all-work-together)
 8. [Decision Framework](#decision-framework)
 9. [Resources](#resources)

 ---

 ## Overview

 Amplifier is a modular AI agent platform following a Linux-inspired kernel architecture:
 - **Tiny stable kernel** (amplifier-core) - ~2,600 lines, rarely changes
 - **Everything else as modules** - Swappable policies at the edges
 - **Text-first configuration** - YAML/Markdown for all configs
 - **Composable by design** - Small pieces compose into larger systems

 ### Key Philosophy

 - **Mechanism, not policy** - Core provides loading/composition mechanisms; apps decide usage
 - **Ruthless simplicity** - One concept per abstraction, minimal layers
 - **Composable** - Small units combine into larger configurations
 - **Observable** - Full event logging and debugging support

 ---

 ## Core Primitives

 Amplifier has four main primitives that work together:

 | Primitive | What It Is | Example |
 |-----------|-----------|---------|
 | **Bundle** | Configuration package that defines session setup | `foundation`, `amplifier-bundle-recipes` |
 | **Module** | Pluggable component providing specific functionality | `tool-filesystem`, `loop-streaming`, `hooks-logging` |
 | **Agent** | Specialized AI configuration for specific tasks | `zen-architect`, `bug-hunter`, `security-guardian` |
 | **Recipe** | Declarative multi-step agent workflow | `code-review-recipe.yaml` |

 ---

 ## Bundles

 ### What is a Bundle?

 A **bundle** is a composable configuration unit - essentially a markdown file with YAML frontmatter that defines everything needed for an AI agent session.

 **File format:**
 ```markdown
 ---
 bundle:
 name: my-bundle
 version: 1.0.0
 description: What this bundle provides

 includes:
 - bundle: foundation # Inherit from other bundles

 session:
 orchestrator:
 module: loop-streaming
 context:
 module: context-simple

 providers:
 - module: provider-anthropic
 config:
 default_model: claude-sonnet-4-5

 tools:
 - module: tool-filesystem
 - module: tool-bash

 hooks:
 - module: hooks-logging

 agents:
 include:
 - zen-architect
 - bug-hunter
 ---

 # System Instructions

 Your markdown instructions here. This becomes the system prompt.

 Reference docs with @mentions:
 @foundation:context/IMPLEMENTATION_PHILOSOPHY.md


Bundle Contents


  Section       Purpose
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  bundle        Metadata (name, version, description)
  includes      Other bundles to inherit from
  session       Orchestrator and context manager configuration
  providers     LLM backend configurations
  tools         Agent capabilities
  hooks         Observability and control points
  agents        Named agent configurations
  context       Files to include in context
  instruction   System prompt (markdown body)


Bundle Composition

Bundles compose by layering - configurations merge additively:


 includes:
 - bundle: foundation # Get ALL foundation's tools, agents, hooks

 providers:
 - module: provider-anthropic
 config:
 default_model: claude-sonnet-4-5 # Override just this config


Merge Rules:


  Section                   Behavior
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  tools, providers, hooks   Merge by module ID (same ID = override config, new ID = add to list)
  agents                    Merge by agent name
  session                   Deep merge (nested dicts merged)
  instruction               Replace entirely (later wins)


Key insight: When you include a bundle, you inherit EVERYTHING. You only need to specify what you want to add or override.

Bundle Loading


 # From local path
 bundle = await load_bundle("./bundle.md")

 # From git URL
 bundle = await load_bundle("git+https://github.com/org/amplifier-bundle-foo@main")

 # Compose bundles
 composed = foundation.compose(my_bundle)

 # Prepare for execution (downloads modules, installs deps)
 prepared = await composed.prepare()

 # Create session
 async with prepared.create_session() as session:
 response = await session.execute("Hello!")


Bundle Flow


 Bundle (YAML + Markdown)
 │
 ▼ includes: composition
 Composed Bundle
 │
 ▼ to_mount_plan()
 Mount Plan (flat config dict)
 │
 ▼ prepare()
 Prepared Bundle (modules resolved)
 │
 ▼ create_session()
 Session (runtime execution)


───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

Modules

What are Modules?

Modules are pluggable components that implement specific functionality. All modules follow the same mount pattern:


 async def mount(coordinator: ModuleCoordinator, config: dict) -> ModuleType | Callable | None:
 """
 1. Initialize the module with config
 2. Register with coordinator at appropriate mount point
 3. Return instance or cleanup callable
 """
 module = MyModule(config)
 await coordinator.mount("mount_point_name", module)
 return module


Modules are discovered via Python entry points:


 [project.entry-points."amplifier.modules"]
 my-module = "my_module:mount"


The Four Module Types

Think of them as different responsibility layers in the execution flow:

1. Orchestrator (The Control Flow)

What it does: Controls HOW the agent loop executes

Responsibility:

 • Manage the prompt → LLM → tool → LLM cycle
 • Decide when to call the LLM vs tools
 • Emit lifecycle events (provider:request, tool:pre, etc.)
 • Handle streaming, error recovery, iteration limits

Mount point: session.orchestrator

When to use:

 • You want a different execution strategy (basic loop vs streaming vs event-driven)
 • You need custom control flow (parallel tool execution, multi-agent orchestration)

Example: loop-streaming provides real-time streaming responses

You have: Exactly one orchestrator per session

Protocol:


 async def execute(
 prompt: str,
 context: ContextManager,
 providers: dict[str, Provider],
 tools: dict[str, Tool],
 hooks: HookRegistry
 ) -> str


───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
2. Context Manager (The Memory)

What it does: Controls WHAT the agent remembers

Responsibility:

 • Store conversation messages
 • Track token usage
 • Decide when/how to compact context (summarize old messages)
 • Optionally persist across sessions

Mount point: session.context

When to use:

 • You need different memory strategies (in-memory vs persistent)
 • You want custom compaction logic (summarization, importance-based)
 • You need session resumption

Example: context-simple keeps everything in memory, context-persistent saves to disk

You have: Exactly one context manager per session

Protocol:


 async def add_message(message: dict) -> None
 async def get_messages() -> list[dict]
 async def should_compact() -> bool
 async def compact() -> None
 async def clear() -> None


───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
3. Tools (The Capabilities)

What they do: Give the agent capabilities to DO things

Responsibility:

 • Execute specific actions (read file, run command, fetch URL)
 • Return structured results (success/failure, output/error)
 • Validate inputs before execution

Mount point: coordinator.mount("tools", tool, name="tool-name")

When to use:

 • You want to give agents new capabilities
 • You need domain-specific operations
 • You want to enable external system integration

Example: tool-filesystem for file operations, tool-bash for commands

You have: Multiple tools (0 to many)

Protocol:


 class Tool:
 name: str
 description: str
 async def execute(self, input: dict) -> ToolResult


Invoked by: Agent (via LLM) - the agent CHOOSES to use tools

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
4. Hooks (The Cross-Cutting Concerns)

What they do: Observe, validate, and control execution WITHOUT being invoked directly

Responsibility:

 • Observe: Log events, collect metrics, audit trails
 • Validate: Security checks, approval gates, input validation
 • Control: Block operations, modify data, inject feedback
 • Augment: Add context, provide corrections

Mount point: Register with coordinator.hooks.register(event, handler)

When to use:

 • You need observability (logging, metrics, tracing)
 • You need security gates (approval for dangerous operations)
 • You need automated feedback loops (linter errors injected as context)
 • You need output control (redaction, formatting)

Example: hooks-logging logs all events, hooks-approval gates dangerous operations

You have: Multiple hooks (0 to many)

Protocol:


 async def __call__(event: str, data: dict) -> HookResult


HookResult actions:

 • continue - Just observing, proceed normally
 • deny - Block the operation
 • modify - Transform the data
 • inject_context - Add feedback to agent's context
 • ask_user - Request approval

Invoked by: Events - hooks listen for lifecycle events

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Module Comparison Table


  Type           Invoked By        Purpose                  Quantity   Examples
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Orchestrator   Session           Control execution flow   1          loop-streaming, loop-basic
  Context        Orchestrator      Manage memory            1          context-simple, context-persistent
  Tool           Agent (via LLM)   Perform actions          0-many     filesystem, bash, web, search
  Hook           Events            Cross-cutting concerns   0-many     logging, approval, redaction


The Execution Flow with All Modules


 User Prompt
 │
 ▼
 ┌─────────────────────────────────────────┐
 │ ORCHESTRATOR (controls the flow) │
 │ │
 │ 1. Add prompt to CONTEXT │
 │ └─> Context: stores message │
 │ │
 │ 2. Hook: prompt:submit │
 │ └─> Hooks: observe, validate │
 │ │
 │ 3. Call Provider (LLM) │
 │ Hook: provider:request │
 │ Provider: generates response │
 │ Hook: provider:response │
 │ │
 │ 4. Add response to CONTEXT │
 │ │
 │ 5. If tool_calls in response: │
 │ For each tool: │
 │ Hook: tool:pre │
 │ └─> Can deny, modify, approve │
 │ TOOL: execute(input) │
 │ └─> Does the actual work │
 │ Hook: tool:post │
 │ └─> Can inject feedback │
 │ Add result to CONTEXT │
 │ │
 │ 6. Check if CONTEXT needs compaction │
 │ └─> Context: compact if needed │
 │ │
 │ 7. Loop back to step 3 if more tools │
 │ │
 └─────────────────────────────────────────┘
 │
 ▼
 Final Response


Decision Guide: When to Use Which Module Type?

Create a Tool when:

 • ✅ The agent needs to actively DO something
 • ✅ The capability should be discoverable by the LLM
 • ✅ It's an action the agent chooses to take
 • Example: "Read this file", "Run this command", "Search the web"

Create a Hook when:

 • ✅ You need passive observation of events
 • ✅ You need to validate or control operations
 • ✅ You want automated feedback without agent decision
 • ✅ It's a system concern, not an agent action
 • Example: "Log all LLM calls", "Block writes to /etc", "Auto-inject lint errors"

Create a Context Manager when:

 • ✅ You need custom memory strategy
 • ✅ You want different compaction logic
 • ✅ You need persistence or session resumption
 • Example: "Summarize old messages", "Persist to database", "Importance-based memory"

Create an Orchestrator when:

 • ✅ You need different execution strategy
 • ✅ You want custom control flow
 • ✅ You need specialized loop behavior
 • Example: "Real-time streaming", "Parallel tool execution", "Event-driven workflows"

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

Agents

What are Agents?

Agents are specialized AI configurations for specific tasks. Each agent is itself a bundle with:

 • Custom instructions (system prompt)
 • Specific provider configurations (e.g., lower temperature for deterministic tasks)
 • Access to relevant tools
 • Behavioral tuning

Agents are sub-configurations that get spawned as child sessions.

Agent Definition

Agents are markdown files with YAML frontmatter:


 ---
 meta:
 name: bug-hunter
 description: "Finds and fixes bugs systematically"

 providers:
 - module: provider-anthropic
 config:
 default_model: claude-sonnet-4-5
 temperature: 0.3 # More deterministic for debugging

 tools:
 - module: tool-filesystem
 - module: tool-bash
 ---

 # Bug Hunter Agent

 You are an expert bug hunter. Find bugs systematically:
 1. Reproduce the issue
 2. Isolate the cause
 3. Fix the bug
 4. Verify the fix


Foundation Agents

The foundation bundle includes these agents:

 • bug-hunter - Systematic debugging
 • zen-architect - Architecture design and code review
 • modular-builder - Implementation from specifications
 • explorer - Codebase exploration
 • security-guardian - Security review and vulnerability assessment
 • test-coverage - Test analysis and generation
 • integration-specialist - External service integration
 • post-task-cleanup - Workspace cleanup and hygiene

Agent Spawning

Agents are spawned via the task tool:


 # From a session, spawn a sub-agent
 result = await session.spawn_agent(
 agent="bug-hunter",
 instruction="Find the bug in auth.py"
 )


Or in a recipe:


 - id: "debug"
 agent: "bug-hunter"
 prompt: "Find the bug in {{file_path}}"


Agent Modes

Some agents support different modes of operation. The mode is prepended to the instruction.

Example: zen-architect modes

 • ANALYZE - Break down problems and design solutions
 • ARCHITECT - System design and module specification
 • REVIEW - Code quality assessment


 - id: "design"
 agent: "zen-architect"
 mode: "ARCHITECT"
 prompt: "Design a caching layer"


───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

Recipes

What are Recipes?

Recipes are declarative YAML specifications that define multi-step AI agent workflows. Instead of manually coordinating multiple agent invocations, you write down the workflow once and
let Amplifier execute it automatically.

The Recipes Bundle

Recipes are provided by the amplifier-bundle-recipes bundle, which includes:

 • tool-recipes - Tool module that executes recipe YAML files
 • recipe-author - Agent for conversational recipe creation
 • result-validator - Agent for validation steps
 • Complete documentation and examples

Recipe Structure


 name: "code-review-comprehensive"
 description: "Multi-stage code review workflow"
 version: "1.0.0"
 author: "Platform Team"
 tags: ["code-review", "security", "quality"]

 context:
 file_path: "" # Required input
 severity_threshold: "high" # Default value

 steps:
 - id: "analyze"
 agent: "zen-architect"
 mode: "ANALYZE"
 prompt: "Analyze {{file_path}} for issues"
 output: "analysis"
 timeout: 600

 - id: "suggest-improvements"
 agent: "zen-architect"
 mode: "ARCHITECT"
 prompt: "Based on {{analysis}}, suggest improvements"
 output: "improvements"

 - id: "validate"
 agent: "zen-architect"
 mode: "REVIEW"
 prompt: "Review these suggestions: {{improvements}}"
 output: "validation"


Recipe Features

1. Context Accumulation Each step can reference outputs from previous steps:


 output: "analysis" # Step 1 stores result
 prompt: "{{analysis}}" # Step 2 uses it


2. Automatic Checkpointing Sessions persist to disk:

 • ~/.amplifier/projects/<project>/recipe-sessions/
 • Resume from last successful step if interrupted

3. Conditional Execution Skip steps based on conditions:


 condition: "{{severity}} == 'critical'"


4. Looping (foreach) Process lists:


 foreach: "{{files}}"
 as: "current_file"
 parallel: true # Run all concurrently
 collect: "all_analyses"


5. Recipe Composition Invoke other recipes as sub-workflows:


 type: "recipe"
 recipe: "security-audit.yaml"
 context:
 target: "{{file_path}}"


6. Approval Gates (Staged Mode) Pause for human review:


 stages:
 - name: "planning"
 steps: [...]
 approval:
 required: true
 prompt: "Review plan before applying?"


Recipe Execution Flow


 Recipe YAML File
 │
 ▼
 ┌─────────────────────────────────────────┐
 │ tool-recipes module │
 │ (invoked via tool call) │
 │ │
 │ 1. Parse YAML │
 │ 2. Validate structure │
 │ 3. Create session directory │
 │ 4. FOR EACH STEP: │
 │ ├─ Substitute context variables │
 │ ├─ Spawn sub-agent (via task tool) │
 │ ├─ Collect output │
 │ ├─ Update context │
 │ └─ Checkpoint state │
 │ 5. Return final results │
 └─────────────────────────────────────────┘


Using Recipes

Load the recipes bundle:


 amplifier run --bundle git+https://github.com/microsoft/amplifier-bundle-recipes@main


Execute a recipe:


 amplifier run "execute code-review-recipe.yaml with file_path=src/auth.py"


Create a recipe conversationally:


 amplifier run "I need to create a recipe for security auditing Python files"


Resume interrupted recipe:


 amplifier run "resume recipe session recipe_20251217_154000_abc123"


List active sessions:


 amplifier run "list recipe sessions"


When to Use Recipes

✅ Good Use Cases:

 • Repeatable multi-step workflows
 • Complex orchestration with multiple agents
 • Long-running processes needing resumability
 • Team workflows requiring standardization

❌ Not Ideal For:

 • Simple single-agent tasks
 • Highly dynamic workflows
 • Exploratory work where process is unknown

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

How They All Work Together

The Complete Architecture


 ┌─────────────────────────────────────────────┐
 │ Your Application / CLI │
 │ │
 │ User: "execute code-review.yaml" │
 └──────────────────┬──────────────────────────┘
 │
 ▼
 ┌─────────────────────────────────────────────┐
 │ Session (from Bundle) │
 │ │
 │ Orchestrator: loop-streaming ◄─────────────┼─ Controls execution flow
 │ Context: context-persistent ◄─────────────┼─ Manages memory
 │ Tools: filesystem, bash, recipes ◄──────────┼─ Provides capabilities
 │ Hooks: logging, approval ◄─────────────┼─ Cross-cutting concerns
 │ Agents: zen-architect, bug-hunter ◄─────────┼─ Specialized configs
 └──────────────────┬──────────────────────────┘
 │
 ▼ (if using recipes)
 ┌─────────────────────────────────────────────┐
 │ tool-recipes Module │
 │ │
 │ • Parses recipe YAML │
 │ • Manages session state │
 │ • Orchestrates step execution │
 │ • Uses task tool to spawn sub-agents │
 └──────────────────┬──────────────────────────┘
 │
 ▼ (for each step)
 ┌─────────────────────────────────────────────┐
 │ Sub-Agent Session │
 │ │
 │ • Spawned via task tool │
 │ • Inherits orchestrator, context, hooks │
 │ • Has agent-specific config │
 │ • Executes step prompt │
 │ • Returns result to recipe │
 └─────────────────────────────────────────────┘


Composition Example

Here's how you might compose everything:

Your bundle (my-app.yaml):


 ---
 bundle:
 name: my-app
 version: 1.0.0

 includes:
 - bundle: foundation # Gets tools, agents, hooks
 - bundle: amplifier-bundle-recipes # Adds recipes capability

 session:
 orchestrator:
 module: loop-streaming # Real-time responses
 context:
 module: context-persistent # Session resumption
 config:
 max_tokens: 200000

 providers:
 - module: provider-anthropic
 config:
 default_model: claude-sonnet-4-5

 # Foundation already provides these, so we don't need to repeat:
 # tools: [filesystem, bash, web, search, task]
 # agents: [zen-architect, bug-hunter, ...]
 # hooks: [logging, status, redaction, ...]

 # Recipes bundle adds:
 # tools: [recipes]
 # agents: [recipe-author, result-validator]
 ---

 # Your custom instructions
 You are a code review assistant specialized in Python development.


Result: You get a complete setup with:

 • Streaming orchestrator
 • Persistent context
 • All foundation tools and agents
 • Recipe execution capability
 • Logging and observability
 • Your custom instructions

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

Decision Framework

"What should I create?"

Question 1: Is this a repeatable multi-step workflow?

 • Yes → Create a Recipe
 • No → Continue...

Question 2: Does this provide a capability agents should actively use?

 • Yes → Create a Tool module
 • No → Continue...

Question 3: Does this need to observe/control execution automatically?

 • Yes → Create a Hook module
 • No → Continue...

Question 4: Does this change HOW the agent executes?

 • Yes, different loop strategy → Create an Orchestrator module
 • Yes, different memory strategy → Create a Context module
 • No → Continue...

Question 5: Is this a specialized agent configuration?

 • Yes → Create an Agent
 • No → You probably want a Bundle to package things together

"How should I package this?"

Create a Bundle when:

 • You have a collection of related agents, tools, and configuration
 • You want to share a complete capability (like recipes)
 • You want to compose multiple concerns together

Bundle includes:

 • Modules (tools, hooks, orchestrators, contexts)
 • Agents (agent definitions)
 • Context files (documentation, guidelines)
 • Configuration (providers, session setup)
 • Instructions (system prompts)

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

Resources

Official Repositories

Core:

 • amplifier - Main CLI and docs
 • amplifier-core - Kernel
 • amplifier-foundation - Foundation bundle library

Bundles:

 • amplifier-bundle-recipes - Recipe orchestration

Modules:

 • amplifier-module-loop-streaming - Streaming orchestrator
 • amplifier-module-tool-filesystem - Filesystem operations
 • amplifier-module-hooks-logging - Event logging

Key Documentation

Foundation:

 • docs/CONCEPTS.md - Core concepts and mental models
 • docs/PATTERNS.md - Common usage patterns
 • docs/BUNDLE_GUIDE.md - Creating bundles

Core:

 • docs/contracts/TOOL_CONTRACT.md - Tool module specification
 • docs/contracts/HOOK_CONTRACT.md - Hook module specification
 • docs/contracts/ORCHESTRATOR_CONTRACT.md - Orchestrator specification
 • docs/contracts/CONTEXT_CONTRACT.md - Context manager specification
 • docs/specs/MOUNT_PLAN_SPECIFICATION.md - Mount plan contract

Recipes:

 • docs/RECIPE_SCHEMA.md - Complete YAML specification
 • docs/RECIPES_GUIDE.md - Conceptual guide
 • docs/BEST_PRACTICES.md - Design patterns
 • examples/ - Working recipe examples

Getting Help

 • GitHub Issues: For bug reports and feature requests
 • GitHub Discussions: For questions and community support
 • Documentation: Start at https://github.com/microsoft/amplifier

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

Quick Reference

Primitives Summary


  What     Description             File Format                     Example
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Bundle   Configuration package   .yaml or .md with frontmatter   foundation, my-app
  Module   Pluggable component     Python package with mount()     tool-filesystem, hooks-logging
  Agent    Specialized AI config   .md with frontmatter            zen-architect, bug-hunter
  Recipe   Multi-step workflow     .yaml                           code-review.yaml


Module Types Summary


  Type           Quantity   Mount Point            Invoked By
 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Orchestrator   1          session.orchestrator   Session
  Context        1          session.context        Orchestrator
  Tool           0-many     tools.{name}           Agent (LLM)
  Hook           0-many     Event handlers         Events


Common Commands


 # Load a bundle
 amplifier run --bundle ./my-bundle.md "prompt"

 # Execute a recipe
 amplifier run "execute recipe.yaml with var=value"

 # Resume a recipe
 amplifier run "resume recipe session <session-id>"

 # List recipe sessions
 amplifier run "list recipe sessions"

 # Validate a recipe
 amplifier run "validate recipe recipe.yaml"



Go build an app that is just abour recipes. It's a sandbox that opens up all sorts of things you can do.
And it gives new users all sorts of value.
Not everything needs to be a chat experience. Amplifier can be a tool that an app uses under the covers.

Examples are a good way to see what is capable. Maybe they're jupyter notebooks.

A developer experience for making bundles and recipes.
A tool that allows users to give us their desired outcome, and we crate a solution for them.

Do we need the concept of an artifact? No, it doesn't need to hard-defined.