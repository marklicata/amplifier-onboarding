#!/usr/bin/env python3
"""
Execute an amplifier-foundation example with user inputs.

This script runs examples from the amplifier-foundation repository,
supporting different view modes and custom inputs.
"""

import sys, os
import json
import asyncio
import traceback
from pathlib import Path
from dotenv import load_dotenv
from amplifier_foundation import load_bundle

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

amplifier_session = None  # Global session placeholder

async def get_amplifier_session() -> object:
    """Get or create a global amplifier session."""
    
    global amplifier_session
    if amplifier_session is None:
        bundle_path = Path(__file__).parent / "playground_files/bundle.yaml"
        if not bundle_path.exists():
            raise FileNotFoundError("Foundation bundle not found at lib/playground_files/bundle.yaml")

        try:
            foundation = await load_bundle(f"file://{bundle_path.resolve()}")
        except Exception as e:
            raise RuntimeError(f"Failed to load foundation bundle: {str(e)}")
        
        prepared = await foundation.prepare()
        amplifier_session = await prepared.create_session()
    return amplifier_session

async def send_amplifier_message(session: object, message: str) -> str:
    """Send a message to the amplifier session and get the response."""

    if session is None:
            print("Amplifier session not initialized. Creating new amplifier session...", file=sys.stderr)
            session = await get_amplifier_session()
    
    if message.strip() == "" or message is None:
        raise ValueError("User message is empty.")

    try:
        print(f"Sending amplifier message...", file=sys.stderr)
        response = await session.execute(message)
        return response
    except Exception as e:
        print(f"Amplifier execution error: {e}", file=sys.stderr)
        return f"Amplifier execution error: {e}"


async def run_hello_world(inputs: dict, mode: str) -> dict:
    """
    Execute the Hello World example.
    
    This is the simplest Amplifier example - load foundation,
    compose with provider, and execute a prompt.
    """
    try:
        # Get shared session
        session = await get_amplifier_session()
        
        # Get prompt from inputs or use default
        prompt = inputs.get("prompt", "Write a Python function to check if a number is prime. Include docstring and type hints.")
        
        # Execute
        response = await send_amplifier_message(session, prompt)
        
        return {
            "output": response,
            "metadata": {
                "example_id": "01_hello_world",
                "mode": mode,
                "prompt": prompt
            }
        }
        
    except ImportError as e:
        return {
            "error": "Amplifier Foundation is not installed. Please run: pip install amplifier-foundation",
            "details": str(e)
        }
    except Exception as e:
        return {
            "error": f"Execution failed: {str(e)}",
            "traceback": traceback.format_exc()
        }


async def run_custom_configuration(inputs: dict, mode: str) -> dict:
    """
    Execute the Custom Configuration example.
    
    Demonstrates composition with different tools and configurations.
    """
    try:
        # Get shared session
        session = await get_amplifier_session()
        
        # Execute based on configuration type
        config_type = inputs.get("config_type", "basic")
        
        if config_type == "basic":
            prompt = "What tools do you have available?"
        elif config_type == "tools":
            prompt = "List the files in the current directory and tell me what you find."
        else:
            prompt = "Write a short poem about software modularity."
        
        response = await send_amplifier_message(session, prompt)
        
        return {
            "output": response,
            "metadata": {
                "example_id": "02_custom_configuration",
                "mode": mode,
                "config_type": config_type
            }
        }
        
    except Exception as e:
        return {
            "error": f"Execution failed: {str(e)}",
            "traceback": traceback.format_exc()
        }


async def run_meeting_notes(inputs: dict, mode: str) -> dict:
    """
    Execute the Meeting Notes to Action Items example.
    
    Transforms unstructured meeting notes into structured task lists.
    """
    try:
        # Get shared session
        session = await get_amplifier_session()
        
        # Get meeting notes from inputs or use sample
        meeting_notes = inputs.get("meeting_notes", """
Product Planning Meeting - Q1 2024 Launch
Date: January 15, 2024
Attendees: Sarah (PM), John (Eng), Maria (Design), Alex (Marketing)

Discussion Points:
- Reviewed the roadmap for Q1 launch
- Need to finalize the landing page design by end of week
- API documentation is incomplete and needs urgent attention
- Marketing campaign should start 2 weeks before launch

Action Items Discussed:
1. John will update the landing page by Friday
2. Sarah needs to review the API docs ASAP - this is blocking the beta release
3. Maria to create social media assets by next Monday
4. We should schedule a follow-up next week to discuss metrics
5. Alex mentioned he'll coordinate with the PR team about the press release

Notes:
- Budget approved for additional contractor if needed
- Launch date tentatively set for Feb 15
- Need to prioritize the API docs review - Sarah emphasized this is critical
        """.strip())
        
        # Craft extraction prompt
        prompt = f"""Analyze these meeting notes and extract all action items.

For each action item, identify:
- task: A clear, concise description of what needs to be done
- owner: The person responsible (if mentioned, otherwise "Unassigned")
- deadline: When it's due (if mentioned, otherwise "No deadline")
- priority: high/medium/low (infer from language like "ASAP", "urgent", "critical")

Meeting Notes:
{meeting_notes}

Return ONLY valid JSON in this exact format:
{{
  "action_items": [
    {{
      "task": "description",
      "owner": "name",
      "deadline": "date or relative time",
      "priority": "high|medium|low"
    }}
  ],
  "meeting_info": {{
    "title": "meeting title if mentioned",
    "date": "date if mentioned"
  }}
}}"""
        
        response = await send_amplifier_message(session, prompt)
        
        # Try to parse the JSON response
        try:
            # Extract JSON from response (might be wrapped in markdown)
            response_text = response.strip()
            start_idx = response_text.find("{")
            end_idx = response_text.rfind("}")
            
            if start_idx != -1 and end_idx != -1:
                json_text = response_text[start_idx:end_idx + 1]
                parsed_data = json.loads(json_text)
                
                # Format as markdown for display
                formatted_output = format_action_items(parsed_data)
                
                return {
                    "output": formatted_output,
                    "metadata": {
                        "example_id": "10_meeting_notes",
                        "mode": mode,
                        "action_items": parsed_data.get("action_items", [])
                    }
                }
            else:
                return {
                    "output": response,
                    "metadata": {
                        "example_id": "10_meeting_notes",
                        "mode": mode,
                        "warning": "Could not parse structured JSON, showing raw response"
                    }
                }
                
        except json.JSONDecodeError:
            return {
                "output": response,
                "metadata": {
                    "example_id": "10_meeting_notes",
                    "mode": mode,
                    "warning": "Could not parse JSON, showing raw response"
                }
            }
        
    except Exception as e:
        return {
            "error": f"Execution failed: {str(e)}",
            "traceback": traceback.format_exc()
        }


def format_action_items(data: dict) -> str:
    """Format action items as markdown checklist."""
    output = []
    
    # Meeting info
    meeting_info = data.get("meeting_info", {})
    if meeting_info.get("title"):
        output.append(f"# {meeting_info['title']}")
    if meeting_info.get("date"):
        output.append(f"**Date:** {meeting_info['date']}")
    
    output.append("\n## Action Items\n")
    
    # Action items
    action_items = data.get("action_items", [])
    
    if not action_items:
        output.append("*No action items found*")
        return "\n".join(output)
    
    # Group by priority
    high_priority = [item for item in action_items if item.get("priority") == "high"]
    medium_priority = [item for item in action_items if item.get("priority") == "medium"]
    low_priority = [item for item in action_items if item.get("priority") == "low"]
    
    # High priority items
    if high_priority:
        output.append("### 🔴 High Priority\n")
        for item in high_priority:
            owner = item.get("owner", "Unassigned")
            deadline = item.get("deadline", "No deadline")
            task = item.get("task", "")
            output.append(f"- [ ] {task}")
            output.append(f"  - **Owner:** {owner}")
            output.append(f"  - **Due:** {deadline}\n")
    
    # Medium priority items
    if medium_priority:
        output.append("### 🟡 Medium Priority\n")
        for item in medium_priority:
            owner = item.get("owner", "Unassigned")
            deadline = item.get("deadline", "No deadline")
            task = item.get("task", "")
            output.append(f"- [ ] {task}")
            output.append(f"  - **Owner:** {owner}")
            output.append(f"  - **Due:** {deadline}\n")
    
    # Low priority items
    if low_priority:
        output.append("### 🟢 Low Priority\n")
        for item in low_priority:
            owner = item.get("owner", "Unassigned")
            deadline = item.get("deadline", "No deadline")
            task = item.get("task", "")
            output.append(f"- [ ] {task}")
            output.append(f"  - **Owner:** {owner}")
            output.append(f"  - **Due:** {deadline}\n")
    
    return "\n".join(output)


async def run_custom_tool(inputs: dict, mode: str) -> dict:
    """
    Execute the Custom Tool example.
    
    Demonstrates building custom tools by using existing tools.
    """
    try:
        session = await get_amplifier_session()
        
        # For demo, show the agent using available tools
        prompt = "What tools do you have available? Please list them and explain what each one does."
        
        response = await send_amplifier_message(session, prompt)
        
        return {
            "output": f"**Custom Tool Example**\n\n{response}\n\n---\n\n*This example demonstrates the tool protocol. In the full version, you would see custom WeatherTool and DatabaseTool in action.*",
            "metadata": {
                "example_id": "03_custom_tool",
                "mode": mode
            }
        }
    except Exception as e:
        return {
            "error": f"Execution failed: {str(e)}",
            "traceback": traceback.format_exc()
        }


async def run_load_and_inspect(inputs: dict, mode: str) -> dict:
    """
    Execute the Load and Inspect example.
    
    Shows how to load and inspect bundle structure.
    """
    try:
        session = await get_amplifier_session()
        
        # Educational output showing bundle concepts
        prompt = "Explain what an Amplifier bundle is and what components it contains (providers, tools, hooks, orchestrators). Keep it concise."
        
        response = await send_amplifier_message(session, prompt)
        
        return {
            "output": f"**Bundle Structure Overview**\n\n{response}\n\n---\n\n*In the full example, you would see the actual bundle.yaml structure and mount plan.*",
            "metadata": {
                "example_id": "04_load_and_inspect",
                "mode": mode
            }
        }
    except Exception as e:
        return {
            "error": f"Execution failed: {str(e)}",
            "traceback": traceback.format_exc()
        }


async def run_composition(inputs: dict, mode: str) -> dict:
    """
    Execute the Composition example.
    
    Demonstrates bundle composition and merge rules.
    """
    try:
        session = await get_amplifier_session()
        
        # Educational output about composition
        prompt = "Explain how Amplifier bundles compose together. What happens when you compose two bundles - which settings override which? Keep it brief and clear."
        
        response = await send_amplifier_message(session, prompt)
        
        return {
            "output": f"**Bundle Composition Rules**\n\n{response}\n\n---\n\n*The full example shows concrete merge scenarios: session (deep merge), providers/tools (merge by module ID), instruction (replace).*",
            "metadata": {
                "example_id": "05_composition",
                "mode": mode
            }
        }
    except Exception as e:
        return {
            "error": f"Execution failed: {str(e)}",
            "traceback": traceback.format_exc()
        }


async def run_sources_and_registry(inputs: dict, mode: str) -> dict:
    """
    Execute the Sources and Registry example.
    
    Shows loading from different source formats.
    """
    try:
        session = await get_amplifier_session()
        
        # Educational output about sources
        prompt = "Explain the different ways you can load Amplifier bundles: from local paths, git URLs, and package names. What's the BundleRegistry for?"
        
        response = await send_amplifier_message(session, prompt)
        
        return {
            "output": f"**Module Sources and Registry**\n\n{response}\n\n---\n\n*The full example demonstrates loading from git URLs and using BundleRegistry for named bundle management.*",
            "metadata": {
                "example_id": "06_sources_and_registry",
                "mode": mode
            }
        }
    except Exception as e:
        return {
            "error": f"Execution failed: {str(e)}",
            "traceback": traceback.format_exc()
        }


async def run_full_workflow(inputs: dict, mode: str) -> dict:
    """
    Execute the Full Workflow example.
    
    Demonstrates the complete prepare() → create_session() → execute() flow.
    """
    try:
        session = await get_amplifier_session()
        
        # Show the workflow in action
        prompt = inputs.get("prompt", "Write a haiku about modular software architecture")
        
        response = await send_amplifier_message(session, prompt)
        
        return {
            "output": f"**Complete Amplifier Workflow**\n\n*You just saw the full workflow in action:*\n\n1. ✅ **Load** - Foundation bundle loaded\n2. ✅ **Compose** - Provider composed with foundation\n3. ✅ **Prepare** - Modules downloaded and activated\n4. ✅ **Create Session** - AI session created\n5. ✅ **Execute** - Your prompt processed\n\n---\n\n**Your Result:**\n\n{response}",
            "metadata": {
                "example_id": "07_full_workflow",
                "mode": mode,
                "prompt": prompt
            }
        }
    except Exception as e:
        return {
            "error": f"Execution failed: {str(e)}",
            "traceback": traceback.format_exc()
        }


async def run_example(example_id: str, inputs: dict, mode: str) -> dict:
    """
    Route to the appropriate example executor.
    
    Args:
        example_id: Example identifier (e.g., "01_hello_world")
        inputs: User-provided inputs
        mode: View mode (everyone, developers, experts)
    
    Returns:
        Dict with output and metadata, or error
    """
    # Route to example-specific handlers
    if example_id == "01_hello_world":
        return await run_hello_world(inputs, mode)
    elif example_id == "02_custom_configuration":
        return await run_custom_configuration(inputs, mode)
    elif example_id == "03_custom_tool":
        return await run_custom_tool(inputs, mode)
    elif example_id == "04_load_and_inspect":
        return await run_load_and_inspect(inputs, mode)
    elif example_id == "05_composition":
        return await run_composition(inputs, mode)
    elif example_id == "06_sources_and_registry":
        return await run_sources_and_registry(inputs, mode)
    elif example_id == "07_full_workflow":
        return await run_full_workflow(inputs, mode)
    elif example_id == "10_meeting_notes":
        return await run_meeting_notes(inputs, mode)
    else:
        return {
            "error": f"Example '{example_id}' is not implemented yet. Available: 01_hello_world, 02_custom_configuration, 03_custom_tool, 04_load_and_inspect, 05_composition, 06_sources_and_registry, 07_full_workflow, 10_meeting_notes"
        }


def main():
    """Main entry point."""
    try:
        # Read JSON from stdin (more reliable than command-line args)
        if not sys.stdin.isatty():
            # Read from stdin (when called from Node.js)
            input_data = sys.stdin.read()
        elif len(sys.argv) >= 2:
            # Read from command-line argument (for manual testing)
            input_data = sys.argv[1]
        else:
            print(json.dumps({"error": "No input provided"}))
            sys.exit(1)
        
        # Parse arguments from JSON
        args = json.loads(input_data)
        example_id = args.get("exampleId")
        inputs = args.get("inputs", {})
        mode = args.get("mode", "normie")
        
        if not example_id:
            print(json.dumps({"error": "exampleId is required"}))
            sys.exit(1)
        
        # Run example
        result = asyncio.run(run_example(example_id, inputs, mode))
        
        # Print result as JSON
        print(json.dumps(result))
        
    except json.JSONDecodeError as e:
        print(json.dumps({
            "error": f"Failed to parse arguments: {str(e)}",
            "traceback": traceback.format_exc()
        }))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({
            "error": f"Unexpected error: {str(e)}",
            "traceback": traceback.format_exc()
        }))
        sys.exit(1)


if __name__ == "__main__":
    main()
