#!/usr/bin/env python3
"""
Amplifier recipe execution script with streaming support.
Runs a multi-step recipe and streams progress and output.
"""

import asyncio
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

# Try to import Amplifier Core and Foundation
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


def substitute_variables(text: str, variables: Dict[str, str]) -> str:
    """Replace {{variable}} placeholders in text"""
    for key, value in variables.items():
        text = text.replace(f"{{{{{key}}}}}", value)
    return text


class RecipeRunner:
    """Execute multi-step recipes with streaming output"""

    def __init__(self, recipe_path: str, inputs: Dict[str, str]):
        self.recipe_path = recipe_path
        self.inputs = inputs
        self.recipe_data = None
        self.step_results = {}  # Store results from each step

    def load_recipe(self) -> Dict[str, Any]:
        """Load and parse recipe YAML"""
        # Navigate from python/ up to amplifier/ then to recipes/
        recipes_dir = Path(__file__).parent.parent / "recipes"
        full_path = recipes_dir / self.recipe_path

        if not full_path.exists():
            raise FileNotFoundError(f"Recipe not found: {full_path}")

        # For MVP, use simple YAML parsing
        # In production, should use proper YAML parser
        import yaml

        with open(full_path, "r") as f:
            self.recipe_data = yaml.safe_load(f)

        return self.recipe_data

    def validate_bundles(self) -> List[str]:
        """Validate all bundle dependencies exist"""
        # Navigate from python/ up to amplifier/ then to bundles/
        bundles_dir = Path(__file__).parent.parent / "bundles"
        missing = []

        for step in self.recipe_data.get("steps", []):
            bundle_path = step.get("bundle", "")
            full_bundle_path = bundles_dir / bundle_path
            print(full_bundle_path, file=sys.stderr)

            if not full_bundle_path.exists():
                missing.append(bundle_path)

        return missing

    async def execute_step(self, step_index: int, step: Dict[str, Any]) -> str:
        """Execute a single recipe step"""
        step_id = step.get("id", f"step-{step_index}")
        step_name = step.get("name", f"Step {step_index + 1}")
        bundle_path = step.get("bundle", "")
        prompt_template = step.get("prompt", "")

        # Substitute input variables and previous step results
        context_vars = {**self.inputs, **self.step_results}
        prompt = substitute_variables(prompt_template, context_vars)

        # Extract bundle ID from path (e.g., "bundles/00-basic-bundle.yaml" -> "00-basic-bundle")
        bundle_id = Path(bundle_path).stem

        step_start_time = time.time()

        # Send step start event
        stream_event(
            "step_start",
            {
                "step": step_index + 1,
                "stepId": step_id,
                "stepName": step_name,
                "bundleId": bundle_id,
                "totalSteps": len(self.recipe_data.get("steps", [])),
            },
        )

        try:
            # Load bundle
            # Navigate from python/ up to amplifier/ then to bundles/
            bundles_dir = Path(__file__).parent.parent / "bundles"
            full_bundle_path = bundles_dir / bundle_path

            print(
                f"[Step {step_index + 1}] Loading bundle: {bundle_path}",
                file=sys.stderr,
            )
            foundation = await load_bundle(f"file://{full_bundle_path.resolve()}")

            print(f"[Step {step_index + 1}] Preparing bundle...", file=sys.stderr)
            prepared = await foundation.prepare()

            print(f"[Step {step_index + 1}] Creating session...", file=sys.stderr)
            session = await prepared.create_session()

            print(f"[Step {step_index + 1}] Executing prompt...", file=sys.stderr)

            # Execute and get response
            result = await session.execute(prompt)

            # Stream result in chunks
            chunk_size = 100
            for i in range(0, len(result), chunk_size):
                chunk = result[i : i + chunk_size]
                stream_event("chunk", {"content": chunk})
                await asyncio.sleep(0.01)

            # Calculate timing
            step_time = time.time() - step_start_time

            # Send step complete event
            stream_event(
                "step_complete",
                {
                    "step": step_index + 1,
                    "stepId": step_id,
                    "stepName": step_name,
                    "timing": round(step_time, 1),
                    "output": result,
                },
            )

            # Store result for next steps to use
            self.step_results[step_id] = result

            return result

        except Exception as e:
            import traceback

            error_trace = traceback.format_exc()
            print(f"[Step {step_index + 1}] Error: {error_trace}", file=sys.stderr)

            stream_event(
                "error",
                {
                    "error": f"Step {step_index + 1} failed: {str(e)}",
                    "step": step_index + 1,
                    "stepId": step_id,
                    "stepName": step_name,
                    "details": error_trace,
                },
            )
            raise

    async def execute(self):
        #         2RecipeExecutionPanel.tsx:189 [progress] Exception occurred: Traceback (most recent call last):
        #   File "C:\Users\malicata\source\amplifier-onboarding\lib\run-recipe-stream.py", line 248, in main
        #     asyncio.run(runner.execute())
        #     ~~~~~~~~~~~^^^^^^^^^^^^^^^^^^
        #   File "C:\Users\malicata\AppData\Local\Programs\Python\Python313\Lib\asyncio\runners.py", line 195, in run
        #     return runner.run(main)
        #            ~~~~~~~~~~^^^^^^
        #   File "C:\Users\malicata\AppData\Local\Programs\Python\Python313\Lib\asyncio\runners.py", line 118, in run
        #     return self._loop.run_until_complete(task)
        #            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^
        #   File "C:\Users\malicata\AppData\Local\Programs\Python\Python313\Lib\asyncio\base_events.py", line 725, in run_until_complete
        #     return future.result()
        #            ~~~~~~~~~~~~~^^
        #   File "C:\Users\malicata\source\amplifier-onboarding\lib\run-recipe-stream.py", line 193, in execute
        #     raise ValueError(f"Missing bundles: {', '.join(missing)}")
        # ValueError: Missing bundles: bundles/00-basic-bundle.yaml, bundles/01-chat-bundle.yaml, bundles/00-basic-bundle.yaml
        """Execute all recipe steps sequentially"""
        if not AMPLIFIER_AVAILABLE:
            raise RuntimeError("Amplifier is not installed")

        # Load recipe
        print("Loading recipe...", file=sys.stderr)
        self.load_recipe()

        # Validate bundle dependencies
        print("Validating bundle dependencies...", file=sys.stderr)
        missing = self.validate_bundles()
        if missing:
            raise ValueError(f"Missing bundles: {', '.join(missing)}")

        steps = self.recipe_data.get("steps", [])
        total_steps = len(steps)

        print(f"Executing recipe with {total_steps} steps...", file=sys.stderr)

        # Execute each step
        for i, step in enumerate(steps):
            await self.execute_step(i, step)

        print("Recipe execution complete!", file=sys.stderr)


def main():
    """Main entry point"""

    try:
        # Read JSON input from stdin
        input_data = sys.stdin.read()
        params = json.loads(input_data)
        print(f"Received params: {params}", file=sys.stderr)

    except Exception as e:
        error_msg = {
            "error": f"Failed to parse input: {str(e)}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        print(json.dumps(error_msg))
        sys.exit(1)

    recipe_id = params.get("recipeId")
    recipe_path = params.get("recipePath")
    inputs = params.get("inputs", {})

    if not recipe_id or not recipe_path:
        error_msg = {
            "error": "Missing required parameters: recipeId and recipePath",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        print(json.dumps(error_msg))
        sys.exit(1)

    if not AMPLIFIER_AVAILABLE:
        error_msg = {
            "error": "Amplifier is not installed. Please install amplifier-core and amplifier-foundation.",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        print(json.dumps(error_msg))
        sys.exit(1)

    # Create runner and execute
    runner = RecipeRunner(recipe_path, inputs)

    try:
        asyncio.run(runner.execute())

        # Success - no final JSON needed, complete event already sent via stream

    except FileNotFoundError as e:
        error_msg = {
            "error": f"Recipe or bundle not found: {str(e)}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        print(json.dumps(error_msg))
        sys.exit(1)

    except Exception as e:
        import traceback

        error_trace = traceback.format_exc()
        print(f"Exception occurred: {error_trace}", file=sys.stderr)
        error_msg = {
            "error": f"Recipe execution failed: {str(e)}",
            "traceback": error_trace,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        print(json.dumps(error_msg))
        sys.exit(1)


if __name__ == "__main__":
    main()
