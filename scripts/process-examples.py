#!/usr/bin/env python3
"""
Process amplifier-foundation examples into playground-ready JSON files.

This script:
1. Reads example .py files from amplifier-foundation
2. Extracts docstrings and metadata
3. Generates mode-specific content for 3 audiences (Everyone, Developers, Experts)
4. Creates JSON files matching the playground schema
"""

import asyncio
import json
import os
import re
from pathlib import Path
from typing import Any

# Import Amplifier Foundation for LLM access
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "lib"))

async def extract_docstring_metadata(file_path: Path) -> dict[str, Any]:
    """Extract metadata from example file docstring."""
    content = file_path.read_text()
    
    # Extract docstring (first triple-quoted string)
    docstring_match = re.search(r'"""(.*?)"""', content, re.DOTALL)
    if not docstring_match:
        return {}
    
    docstring = docstring_match.group(1).strip()
    
    # Parse structured sections
    metadata = {
        "raw_docstring": docstring,
        "full_code": content
    }
    
    # Extract VALUE PROPOSITION
    vp_match = re.search(r'VALUE PROPOSITION:(.*?)(?=\n\n|\nWHAT|$)', docstring, re.DOTALL)
    if vp_match:
        metadata["value_proposition"] = vp_match.group(1).strip()
    
    # Extract WHAT YOU'LL LEARN
    learn_match = re.search(r"WHAT YOU'LL LEARN:(.*?)(?=\n\n|REAL-WORLD|TIME|$)", docstring, re.DOTALL)
    if learn_match:
        metadata["what_you_learn"] = learn_match.group(1).strip()
    
    # Extract REAL-WORLD USE CASE
    usecase_match = re.search(r'REAL-WORLD USE CASE:(.*?)(?=\n\n|TIME|$)', docstring, re.DOTALL)
    if usecase_match:
        metadata["use_case"] = usecase_match.group(1).strip()
    
    # Extract TIME TO VALUE
    time_match = re.search(r'TIME TO VALUE:(.*?)(?=\n|$)', docstring)
    if time_match:
        time_str = time_match.group(1).strip()
        # Extract minutes from patterns like "10 minutes", "5-10 minutes"
        minutes_match = re.search(r'(\d+)(?:-\d+)?\s*min', time_str)
        if minutes_match:
            metadata["estimated_time_minutes"] = int(minutes_match.group(1))
    
    # Extract TEACHABLE MOMENT (for Tier 2 examples)
    teachable_match = re.search(r'TEACHABLE MOMENT:(.*?)(?=\n\n|$)', docstring, re.DOTALL)
    if teachable_match:
        metadata["teachable_moment"] = teachable_match.group(1).strip()
    
    return metadata


async def generate_audience_content(
    example_id: str,
    tier: int,
    metadata: dict[str, Any],
    audience: str
) -> dict[str, Any]:
    """Generate content tailored to specific audience using LLM."""
    
    # For now, create structured content based on metadata
    # In production, you'd use LLM to generate this
    
    if audience == "everyone":
        return generate_everyone_content(example_id, tier, metadata)
    elif audience == "developers":
        return generate_developers_content(example_id, tier, metadata)
    else:  # experts
        return generate_experts_content(example_id, tier, metadata)


def generate_everyone_content(example_id: str, tier: int, metadata: dict) -> dict:
    """Generate simplified content for non-technical audience."""
    
    # Extract simple title
    title_match = re.search(r'Example \d+: (.*?)(?:\n|$)', metadata.get("raw_docstring", ""))
    title = title_match.group(1) if title_match else "Amplifier Example"
    
    # Simplify value proposition
    value_prop = metadata.get("value_proposition", "Learn to work with AI agents")
    
    return {
        "title": title,
        "valueProposition": value_prop,
        "howItWorks": [
            "Set up your AI environment",
            "Configure the agent with the right capabilities",
            "Run the example and see results",
            "Understand what happened"
        ],
        "whatYouGet": [
            "Working example you can run",
            "Clear understanding of the concept",
            "Foundation for building more"
        ]
    }


def generate_developers_content(example_id: str, tier: int, metadata: dict) -> dict:
    """Generate technical content for developers."""
    
    # Extract title with file reference
    title_match = re.search(r'Example \d+: (.*?)(?:\n|$)', metadata.get("raw_docstring", ""))
    title = f"{example_id}.py - {title_match.group(1) if title_match else 'Example'}"
    
    # Parse what you'll learn into key concepts
    learn_text = metadata.get("what_you_learn", "")
    concepts = []
    for line in learn_text.split("\n"):
        line = line.strip()
        if line.startswith("- "):
            concepts.append(line[2:].strip())
    
    # Create code snippet from full code
    code = metadata.get("full_code", "")
    snippet = extract_code_snippet(code)
    
    return {
        "title": title,
        "valueProposition": metadata.get("value_proposition", ""),
        "howItWorks": metadata.get("teachable_moment", learn_text),
        "keyConcepts": concepts if concepts else [
            "Amplifier bundle system",
            "Module composition",
            "Session execution"
        ],
        "codeOverview": {
            "structure": extract_code_structure(code),
            "keyFunctions": extract_key_functions(code)
        },
        "codeSnippet": snippet
    }


def generate_experts_content(example_id: str, tier: int, metadata: dict) -> dict:
    """Generate detailed content for experts."""
    
    title_match = re.search(r'Example \d+: (.*?)(?:\n|$)', metadata.get("raw_docstring", ""))
    title = f"{example_id}.py - {title_match.group(1) if title_match else 'Example'}"
    
    return {
        "title": title,
        "complexity": f"Tier {tier} - {get_tier_name(tier)}",
        "sourceUrl": f"https://github.com/microsoft/amplifier-foundation/blob/main/examples/{example_id}.py",
        "architecture": metadata.get("teachable_moment", metadata.get("value_proposition", "")),
        "fullCode": metadata.get("full_code", ""),
        "advancedOptions": {
            "provider": ["anthropic-sonnet", "anthropic-opus", "openai-gpt4"],
            "streaming": False,
            "hooks": []
        }
    }


def extract_code_snippet(code: str) -> str:
    """Extract a meaningful code snippet (not full code)."""
    # Find the main async function
    main_match = re.search(r'async def (main|demo_\w+)\(.*?\):(.*?)(?=\n(?:async def|def|if __name__))', code, re.DOTALL)
    if main_match:
        snippet = main_match.group(0)
        # Limit to ~15 lines
        lines = snippet.split("\n")[:15]
        return "\n".join(lines)
    
    # Fallback: first 20 lines after imports
    lines = code.split("\n")
    start_idx = 0
    for i, line in enumerate(lines):
        if line.startswith("async def") or line.startswith("class"):
            start_idx = i
            break
    
    return "\n".join(lines[start_idx:start_idx+15])


def extract_code_structure(code: str) -> list[str]:
    """Extract high-level code structure."""
    structure = []
    
    # Look for key operations
    if "load_bundle" in code:
        structure.append("Load foundation and provider bundles")
    if ".compose(" in code:
        structure.append("Compose bundles together")
    if ".prepare()" in code:
        structure.append("Prepare modules (download if needed)")
    if "create_session" in code:
        structure.append("Create AI session")
    if "session.execute" in code:
        structure.append("Execute prompts and get responses")
    
    return structure if structure else ["Standard Amplifier workflow"]


def extract_key_functions(code: str) -> list[dict]:
    """Extract key function calls and their purposes."""
    functions = []
    
    # Common patterns
    patterns = {
        "load_bundle": "Loads a bundle from path or URL",
        "compose": "Combines multiple bundles",
        "prepare": "Downloads and activates modules",
        "create_session": "Creates an AI session",
        "execute": "Executes a prompt",
        "mount": "Registers a custom tool or component"
    }
    
    for func_name, description in patterns.items():
        if func_name in code:
            # Try to extract usage example
            pattern = rf'({func_name}\([^)]*\))'
            match = re.search(pattern, code)
            usage = match.group(1) if match else f"{func_name}(...)"
            
            functions.append({
                "name": func_name,
                "description": description,
                "usage": usage
            })
    
    return functions


def get_tier_name(tier: int) -> str:
    """Get tier name from tier number."""
    names = {
        1: "Quick Start",
        2: "Foundation Concepts",
        3: "Building Applications",
        4: "Real-World Applications"
    }
    return names.get(tier, "Unknown")


def get_category(tier: int) -> str:
    """Get category from tier."""
    categories = {
        1: "Quick Start",
        2: "Foundation Concepts",
        3: "Building Applications",
        4: "Real-World"
    }
    return categories.get(tier, "Examples")


def determine_tier(example_id: str) -> int:
    """Determine tier from example ID."""
    num = int(example_id.split("_")[0])
    if num <= 3:
        return 1
    elif num <= 7:
        return 2
    elif num <= 9:
        return 3
    else:
        return 4


def determine_difficulty(tier: int) -> str:
    """Determine difficulty level from tier."""
    if tier == 1:
        return "beginner"
    elif tier == 2:
        return "intermediate"
    elif tier == 3:
        return "intermediate"
    else:
        return "advanced"


async def process_example(example_file: Path) -> dict[str, Any]:
    """Process a single example file into JSON structure."""
    
    example_id = example_file.stem
    print(f"Processing {example_id}...")
    
    # Extract metadata from file
    metadata = await extract_docstring_metadata(example_file)
    
    # Determine tier and category
    tier = determine_tier(example_id)
    category = get_category(tier)
    difficulty = determine_difficulty(tier)
    
    # Extract title
    title_match = re.search(r'Example \d+: (.*?)(?:\n|$)', metadata.get("raw_docstring", ""))
    title = title_match.group(1).strip() if title_match else example_id.replace("_", " ").title()
    
    # Generate audience-specific content
    everyone_content = await generate_audience_content(example_id, tier, metadata, "everyone")
    developers_content = await generate_audience_content(example_id, tier, metadata, "developers")
    experts_content = await generate_audience_content(example_id, tier, metadata, "experts")
    
    # Build full JSON structure
    example_json = {
        "id": example_id,
        "title": title,
        "tier": tier,
        "category": category,
        "description": metadata.get("value_proposition", title)[:100],
        "estimatedTimeMinutes": metadata.get("estimated_time_minutes", 5),
        "minAudience": "everyone" if tier <= 2 else "developers",
        "isFeatured": tier == 1,
        "difficulty": difficulty,
        "tags": generate_tags(example_id, metadata),
        "githubUrl": f"https://github.com/microsoft/amplifier-foundation/blob/main/examples/{example_id}.py",
        "content": {
            "everyone": everyone_content,
            "developers": developers_content,
            "experts": experts_content
        },
        "execution": {
            "requiresInput": "input" in metadata.get("full_code", "").lower(),
            "defaultPrompt": extract_default_prompt(metadata.get("full_code", "")),
            "estimatedDuration": "2-5 seconds",
            "prerequisites": ["ANTHROPIC_API_KEY environment variable"]
        }
    }
    
    return example_json


def generate_tags(example_id: str, metadata: dict) -> list[str]:
    """Generate relevant tags for the example."""
    tags = []
    
    # Add tags based on content
    code = metadata.get("full_code", "").lower()
    
    if "tool" in example_id or "tool" in code:
        tags.append("tools")
    if "bundle" in code or "compose" in code:
        tags.append("composition")
    if "config" in example_id:
        tags.append("configuration")
    if "multi" in example_id or "agent" in example_id:
        tags.append("multi-agent")
    if "hook" in example_id or "hook" in code:
        tags.append("hooks")
    if tier := determine_tier(example_id):
        if tier == 1:
            tags.append("basics")
        elif tier == 2:
            tags.append("internals")
    
    return tags if tags else ["example"]


def extract_default_prompt(code: str) -> str | None:
    """Extract default prompt from code if present."""
    # Look for execute() calls with string literals
    match = re.search(r'execute\(["\'](.+?)["\']\)', code)
    if match:
        return match.group(1)
    return None


async def main():
    """Main processing function."""
    print("=" * 60)
    print("Processing Amplifier Foundation Examples")
    print("=" * 60)
    
    # Paths
    examples_dir = Path("/tmp/amplifier-foundation/examples")
    output_dir = Path(__file__).parent.parent / "public" / "examples"
    
    # Phase 2 examples to process (Tier 1 remaining + Tier 2)
    phase2_examples = [
        "03_custom_tool",
        "04_load_and_inspect",
        "05_composition",
        "06_sources_and_registry",
        "07_full_workflow"
    ]
    
    # Process each example
    processed_examples = []
    for example_id in phase2_examples:
        example_file = examples_dir / f"{example_id}.py"
        if not example_file.exists():
            print(f"⚠ Warning: {example_file} not found, skipping")
            continue
        
        try:
            example_json = await process_example(example_file)
            
            # Write to file
            output_file = output_dir / f"{example_id}.json"
            with open(output_file, "w") as f:
                json.dump(example_json, f, indent=2)
            
            print(f"✓ Created {output_file.name}")
            processed_examples.append({
                "id": example_json["id"],
                "title": example_json["title"],
                "tier": example_json["tier"],
                "category": example_json["category"],
                "description": example_json["description"],
                "estimatedTimeMinutes": example_json["estimatedTimeMinutes"],
                "minAudience": example_json["minAudience"],
                "isFeatured": example_json["isFeatured"],
                "difficulty": example_json["difficulty"],
                "tags": example_json["tags"]
            })
            
        except Exception as e:
            print(f"✗ Error processing {example_id}: {e}")
            import traceback
            traceback.print_exc()
    
    # Update index.json
    index_file = output_dir / "index.json"
    if index_file.exists():
        with open(index_file) as f:
            index_data = json.load(f)
    else:
        index_data = {"examples": [], "metadata": {}}
    
    # Add new examples (avoid duplicates)
    existing_ids = {ex["id"] for ex in index_data["examples"]}
    for example in processed_examples:
        if example["id"] not in existing_ids:
            index_data["examples"].append(example)
    
    # Sort by tier, then by ID
    index_data["examples"].sort(key=lambda x: (x["tier"], x["id"]))
    
    # Update metadata
    index_data["metadata"] = {
        "totalExamples": len(index_data["examples"]),
        "lastUpdated": "2026-01-07T00:00:00Z",
        "version": "1.0.0"
    }
    
    with open(index_file, "w") as f:
        json.dump(index_data, f, indent=2)
    
    print(f"\n✓ Updated {index_file.name}")
    print(f"\n{'=' * 60}")
    print(f"Processed {len(processed_examples)} examples")
    print(f"Total examples in playground: {len(index_data['examples'])}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    asyncio.run(main())
