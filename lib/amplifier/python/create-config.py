#!/usr/bin/env python3
"""
Create a config in amplifier-app-api from a bundle JSON file.

Usage:
    python create-config.py <bundle_json_path> <user_id>

Returns JSON:
    {"config_id": "...", "success": true}
    or
    {"error": "...", "success": false}
"""

import asyncio
import json
import sys

# Import the API client
from amplifier_api_client import AmplifierAPIClient


async def main():
    if len(sys.argv) < 3:
        print(
            json.dumps(
                {
                    "error": "Usage: create-config.py <bundle_json_path> <user_id>",
                    "success": False,
                }
            )
        )
        sys.exit(1)

    bundle_path = sys.argv[1]
    user_id = sys.argv[2]

    try:
        # Load the bundle JSON
        with open(bundle_path, "r", encoding="utf-8") as f:
            bundle_data = json.load(f)

        # Create API client
        async with AmplifierAPIClient(user_id=user_id) as client:
            # Check if API is healthy
            is_healthy = await client.health_check()
            if not is_healthy:
                print(
                    json.dumps(
                        {"error": "amplifier-app-api is not healthy", "success": False}
                    ),
                    file=sys.stderr,
                )
                sys.exit(1)

            # Ensure client is initialized
            await client._ensure_client()

            # Create config from bundle data
            # The API expects the bundle data directly
            if client._client is None:
                raise RuntimeError("HTTP client not initialized")

            response = await client._client.post(
                f"{client.base_url}/configs",
                headers=await client._get_headers(),
                json=bundle_data,
            )
            response.raise_for_status()

            result = response.json()

            # Extract config ID
            config_id = result.get("id") or result.get("config_id") or result.get("_id")

            if not config_id:
                print(
                    json.dumps(
                        {
                            "error": "No config ID in API response",
                            "success": False,
                            "response": result,
                        }
                    )
                )
                sys.exit(1)

            # Success
            print(
                json.dumps(
                    {"config_id": config_id, "success": True, "user_id": user_id}
                )
            )

    except FileNotFoundError:
        print(
            json.dumps(
                {"error": f"Bundle file not found: {bundle_path}", "success": False}
            )
        )
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(
            json.dumps(
                {"error": f"Invalid JSON in bundle file: {str(e)}", "success": False}
            )
        )
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e), "success": False, "type": type(e).__name__}))
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
