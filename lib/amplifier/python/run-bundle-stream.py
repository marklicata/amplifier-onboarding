#!/usr/bin/env python3
"""
Amplifier bundle execution script with streaming support.
Runs a prompt using a specified bundle configuration and streams the output.
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


def stream_event(event_type: str, data: dict):
    """Send a streaming event to stdout"""
    print(f"STREAM:{json.dumps({'type': event_type, **data})}", flush=True)


class StreamingBundleRunner:
    """Execute prompts using Amplifier bundles with streaming output"""

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

        stream_event(
            "step",
            {
                "step": "loading_bundle",
                "status": "in_progress",
                "message": "Loading bundle configuration...",
            },
        )

        print(f"Loading bundle from: {full_bundle_path}", file=sys.stderr)

        # Load the bundle
        try:
            foundation = await load_bundle(f"file://{full_bundle_path.resolve()}")
            print("Bundle loaded successfully", file=sys.stderr)
        except Exception as e:
            print(
                f"ERROR loading bundle: {type(e).__name__}: {str(e)}", file=sys.stderr
            )
            import traceback

            traceback.print_exc(file=sys.stderr)
            stream_event(
                "step",
                {
                    "step": "loading_bundle",
                    "status": "error",
                    "message": f"Failed to load bundle: {str(e)}",
                },
            )
            raise

        stream_event(
            "step",
            {
                "step": "loading_bundle",
                "status": "complete",
                "message": "Bundle loaded",
            },
        )

        stream_event(
            "step",
            {
                "step": "preparing",
                "status": "in_progress",
                "message": "Preparing session (downloading modules if needed)...",
            },
        )

        # Prepare: resolves module sources, downloads if needed
        try:
            print(
                "Starting prepare() - this will download git modules...",
                file=sys.stderr,
            )
            prepared = await foundation.prepare()
            print("Prepare completed successfully", file=sys.stderr)
        except Exception as e:
            print(
                f"ERROR during prepare: {type(e).__name__}: {str(e)}", file=sys.stderr
            )
            import traceback

            traceback.print_exc(file=sys.stderr)
            stream_event(
                "step",
                {
                    "step": "preparing",
                    "status": "error",
                    "message": f"Failed to prepare: {str(e)}",
                },
            )
            raise

        stream_event(
            "step",
            {"step": "preparing", "status": "complete", "message": "Session prepared"},
        )

        # Create session
        try:
            stream_event(
                "step",
                {
                    "step": "initializing",
                    "status": "in_progress",
                    "message": "Initializing Amplifier session...",
                },
            )

            session = await prepared.create_session()

            stream_event(
                "step",
                {
                    "step": "initializing",
                    "status": "complete",
                    "message": "Session ready",
                },
            )

            print("Session created successfully", file=sys.stderr)
            return session
        except Exception as e:
            stream_event(
                "step",
                {
                    "step": "initializing",
                    "status": "error",
                    "message": f"Failed to initialize: {str(e)}",
                },
            )
            print(f"Error creating Amplifier session: {e}", file=sys.stderr)
            raise

    async def execute_prompt_streaming(self, prompt: str) -> str:
        """Execute a prompt using the initialized session with streaming"""

        # Initialize session on first use if not already initialized
        if AMPLIFIER_AVAILABLE and self.session is None:
            print("Initializing Amplifier session...", file=sys.stderr)
            self.session = await self.initialize_session()

        if not self.session:
            raise RuntimeError("Failed to initialize Amplifier session")

        try:
            stream_event(
                "step",
                {
                    "step": "executing",
                    "status": "in_progress",
                    "message": "Executing prompt...",
                },
            )

            print(f"Executing prompt: {prompt[:50]}...", file=sys.stderr)

            # Execute the full prompt and return the result
            response = await self.session.execute(prompt)

            # Send the response as chunks (simulating streaming)
            chunk_size = 100
            for i in range(0, len(response), chunk_size):
                chunk = response[i : i + chunk_size]
                stream_event("chunk", {"content": chunk})
                await asyncio.sleep(0.01)  # Small delay to simulate streaming

            stream_event(
                "step",
                {
                    "step": "executing",
                    "status": "complete",
                    "message": "Execution complete",
                },
            )

            return response
        except Exception as e:
            print(f"Amplifier execution error: {e}", file=sys.stderr)
            stream_event(
                "step",
                {
                    "step": "executing",
                    "status": "error",
                    "message": f"Execution failed: {str(e)}",
                },
            )
            raise


def main():
    """Main entry point for command-line execution"""

    # Read JSON input from stdin
    try:
        input_data = sys.stdin.read()
        params = json.loads(input_data)
        print(f"Received params: {params}", file=sys.stderr)
    except Exception as e:
        # Send error as a regular JSON output (not STREAM)
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
    runner = StreamingBundleRunner(bundle_path)

    try:
        result = asyncio.run(runner.execute_prompt_streaming(prompt))

        # Send final result as JSON (non-STREAM format)
        # The API will parse this as the final output
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

        error_trace = traceback.format_exc()
        print(f"Exception occurred: {error_trace}", file=sys.stderr)
        print(
            json.dumps(
                {
                    "error": f"Execution failed: {str(e)}",
                    "traceback": error_trace,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            )
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
