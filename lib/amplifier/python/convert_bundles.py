#!/usr/bin/env python3
"""
Convert YAML bundle files to JSON format for amplifier-api compatibility.

This script converts all YAML bundles in the bundles directory to JSON format
that matches the amplifier-api config schema.
"""

import json
import sys
from pathlib import Path
from typing import Any, Dict

import yaml


def load_yaml_bundle(yaml_path: Path) -> Dict[str, Any]:
    """Load a YAML bundle file."""
    with open(yaml_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def convert_to_api_format(
    yaml_data: Dict[str, Any], bundle_name: str
) -> Dict[str, Any]:
    """
    Convert YAML bundle data to amplifier-api JSON config format.

    API expects:
    {
        "name": "bundle-name",
        "description": "...",
        "config_data": { original bundle data },
        "session": { ... },
        "providers": [ ... ],
        "tags": { ... }
    }
    """
    bundle_info = yaml_data.get("bundle", {})

    api_config = {
        "name": bundle_info.get("name", bundle_name),
        "description": bundle_info.get("description", f"{bundle_name} configuration"),
        "config_data": {"bundle": bundle_info},
        "tags": {"source": "onboarding-app", "type": "bundle"},
    }

    # Add session configuration if present
    if "session" in yaml_data:
        api_config["session"] = yaml_data["session"]

    # Add providers configuration if present
    if "providers" in yaml_data:
        api_config["providers"] = yaml_data["providers"]

    # Add tools if present
    if "tools" in yaml_data:
        api_config["tools"] = yaml_data["tools"]

    # Add hooks if present
    if "hooks" in yaml_data:
        api_config["hooks"] = yaml_data["hooks"]

    # Add context information if present
    if "context" in yaml_data:
        api_config["context"] = yaml_data["context"]

    # Add instruction if present
    if "instruction" in yaml_data:
        api_config["instruction"] = yaml_data["instruction"]

    return api_config


def convert_bundle(yaml_path: Path, output_dir: Path) -> bool:
    """Convert a single YAML bundle to JSON format."""
    try:
        print(f"Converting {yaml_path.name}...")

        # Load YAML
        yaml_data = load_yaml_bundle(yaml_path)

        # Extract bundle name from filename (e.g., "01-chat-bundle.yaml" -> "chat-bundle")
        bundle_name = yaml_path.stem

        # Convert to API format
        json_data = convert_to_api_format(yaml_data, bundle_name)

        # Write JSON file
        json_path = output_dir / f"{yaml_path.stem}.json"
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(json_data, f, indent=2, ensure_ascii=False)

        print(f"  [OK] Created {json_path.name}")
        return True

    except Exception as e:
        print(f"  [ERROR] Error converting {yaml_path.name}: {e}", file=sys.stderr)
        return False


def validate_json(json_path: Path) -> bool:
    """Validate that a JSON file is well-formed."""
    try:
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Check required fields
        required_fields = ["name", "description"]
        for field in required_fields:
            if field not in data:
                print(
                    f"  [WARN] Warning: {json_path.name} missing required field: {field}"
                )
                return False

        return True
    except Exception as e:
        print(f"  [ERROR] Invalid JSON in {json_path.name}: {e}", file=sys.stderr)
        return False


def main():
    """Convert all YAML bundles to JSON format."""
    # Determine paths
    script_dir = Path(__file__).parent
    bundles_dir = script_dir.parent / "bundles"

    if not bundles_dir.exists():
        print(f"Error: Bundles directory not found: {bundles_dir}", file=sys.stderr)
        return 1

    # Find all YAML files
    yaml_files = sorted(bundles_dir.glob("*.yaml"))
    if not yaml_files:
        print(f"Error: No YAML files found in {bundles_dir}", file=sys.stderr)
        return 1

    print(f"Found {len(yaml_files)} YAML bundles to convert\n")

    # Convert each bundle
    success_count = 0
    for yaml_path in yaml_files:
        if convert_bundle(yaml_path, bundles_dir):
            success_count += 1

    print(f"\n{'=' * 60}")
    print(f"Conversion complete: {success_count}/{len(yaml_files)} successful")

    # Validate converted files
    print(f"\n{'=' * 60}")
    print("Validating JSON files...\n")

    json_files = sorted(bundles_dir.glob("*.json"))
    valid_count = 0
    for json_path in json_files:
        if validate_json(json_path):
            print(f"  [OK] {json_path.name} is valid")
            valid_count += 1

    print(f"\n{'=' * 60}")
    print(f"Validation complete: {valid_count}/{len(json_files)} valid")

    return 0 if success_count == len(yaml_files) else 1


if __name__ == "__main__":
    sys.exit(main())
