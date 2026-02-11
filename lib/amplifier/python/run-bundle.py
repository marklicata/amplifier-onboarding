#!/usr/bin/env python3
"""
Amplifier bundle execution script for the playground.
Runs a prompt using a specified bundle configuration.
"""

import sys
import json
import asyncio
from pathlib import Path
from datetime import datetime, timezone
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

# Try to import Amplifier Core and Foundation at module level
try:
    from amplifier_core import AmplifierSession
    from amplifier_foundation import load_bundle

    AMPLIFIER_AVAILABLE = True
except ImportError:
    AMPLIFIER_AVAILABLE = False
    AmplifierSession = None
    load_bundle = None


class BundleRunner:
    """Execute prompts using Amplifier bundles"""

    def __init__(self, bundle_path: str):
        self.bundle_path = bundle_path
        self.session = None

        if AMPLIFIER_AVAILABLE:
            print(f"Amplifier available, bundle path: {bundle_path}", file=sys.stderr)
        else:
            print("Amplifier not available", file=sys.stderr)

    async def initialize_session(self):
        """Initialize an Amplifier session with the specified bundle"""
        if not AMPLIFIER_AVAILABLE:
            raise RuntimeError("Amplifier is not available")

        # Resolve bundle path relative to lib/bundles
        # Navigate from python/ up to amplifier/ then to bundles/
        bundles_dir = Path(__file__).parent.parent / "bundles"
        full_bundle_path = bundles_dir / self.bundle_path

        if not full_bundle_path.exists():
            raise FileNotFoundError(f"Bundle not found: {full_bundle_path}")

        print(f"Loading bundle from: {full_bundle_path}", file=sys.stderr)

        # Load the bundle
        foundation = await load_bundle(f"file://{full_bundle_path.resolve()}")

        # Prepare: resolves module sources, downloads if needed
        prepared = await foundation.prepare()

        # Create session
        try:
            session = await prepared.create_session()
            print("Session created successfully", file=sys.stderr)
            return session
        except Exception as e:
            print(f"Error creating Amplifier session: {e}", file=sys.stderr)
            raise

    async def execute_prompt(self, prompt: str) -> str:
        """Execute a prompt using the initialized session"""

        # Initialize session on first use if not already initialized
        if AMPLIFIER_AVAILABLE and self.session is None:
            print("Initializing Amplifier session...", file=sys.stderr)
            self.session = await self.initialize_session()

        if not self.session:
            raise RuntimeError("Failed to initialize Amplifier session")

        try:
            print(f"Executing prompt: {prompt[:50]}...", file=sys.stderr)
            response = await self.session.execute(prompt)
            return response
        except Exception as e:
            print(f"Amplifier execution error: {e}", file=sys.stderr)
            raise


def main():
    """Main entry point for command-line execution"""

    # Read JSON input from stdin
    try:
        input_data = sys.stdin.read()
        params = json.loads(input_data)
    except Exception as e:
        print(
            json.dumps(
                {
                    "error": f"Failed to parse input: {str(e)}",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            )
        )
        sys.exit(1)

    bundle_id = params.get("bundleId")
    bundle_path = params.get("bundlePath")
    prompt = params.get("prompt")

    if not all([bundle_id, bundle_path, prompt]):
        print(
            json.dumps(
                {
                    "error": "Missing required parameters: bundleId, bundlePath, and prompt",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            )
        )
        sys.exit(1)

    if not AMPLIFIER_AVAILABLE:
        print(
            json.dumps(
                {
                    "error": "Amplifier is not installed. Please install amplifier-core and amplifier-foundation.",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            )
        )
        sys.exit(1)

    # Create runner and execute
    runner = BundleRunner(bundle_path)

    try:
        result = asyncio.run(runner.execute_prompt(prompt))
        print(
            json.dumps(
                {
                    "output": result,
                    "bundleId": bundle_id,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            )
        )
    except FileNotFoundError as e:
        print(
            json.dumps(
                {
                    "error": f"Bundle not found: {str(e)}",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            )
        )
        sys.exit(1)
    except Exception as e:
        import traceback

        print(
            json.dumps(
                {
                    "error": f"Execution failed: {str(e)}",
                    "traceback": traceback.format_exc(),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            )
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
