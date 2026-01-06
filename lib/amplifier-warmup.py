#!/usr/bin/env python3
"""
Amplifier session warmup script.
Pre-initializes the Amplifier session to reduce first message latency.
"""

import sys
import json
import asyncio
from pathlib import Path
from datetime import datetime, timezone

# Try to import Amplifier Core and Foundation
try:
    from amplifier_core import AmplifierSession
    from amplifier_foundation import load_bundle
    AMPLIFIER_AVAILABLE = True
except ImportError:
    AMPLIFIER_AVAILABLE = False
    AmplifierSession = None
    load_bundle = None


async def warmup_session():
    """Initialize an Amplifier session to warm up caches and downloads"""

    if not AMPLIFIER_AVAILABLE:
        return json.dumps({
            "status": "skipped",
            "message": "amplifier-core not available",
            "timestamp": datetime.now(timezone.utc).isoformat()
        })

    try:
        print("Starting Amplifier session warmup...", file=sys.stderr)

        # Load bundle
        bundle_path = Path(__file__).parent / "amplifier_config_files/base_bundle.yaml"
        foundation = await load_bundle(f"file://{bundle_path.resolve()}")
        print("Bundle loaded", file=sys.stderr)

        # Prepare: resolves module sources, downloads if needed
        prepared = await foundation.prepare()
        print("Foundation prepared", file=sys.stderr)

        # Create session
        session = await prepared.create_session()
        print("Session created", file=sys.stderr)

        # Session will be cleaned up when process exits
        # No explicit close method available on AmplifierSession

        return json.dumps({
            "status": "success",
            "message": "Session warmed up successfully",
            "timestamp": datetime.now(timezone.utc).isoformat()
        })

    except Exception as e:
        print(f"Warmup error: {e}", file=sys.stderr)
        return json.dumps({
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat()
        })


if __name__ == "__main__":
    result = asyncio.run(warmup_session())
    print(result)
