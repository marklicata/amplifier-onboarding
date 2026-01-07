#!/usr/bin/env python3
"""
Simple Amplifier chat script for Q&A about Amplifier itself.
Runs standalone from Next.js API routes using Amplifier Core.
"""

import sys
import json
import os
import asyncio
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional
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



class AmplifierChat:
    """Simple chat interface to Amplifier"""

    def __init__(self):
        self.session = None
        self.session_id = "amplifier-chat"
        
        if AMPLIFIER_AVAILABLE:
            print(f"amplifier-core library loaded", file=sys.stderr)
            # Session will be initialized lazily on first use
        else:
            print(f"amplifier-core library not found", file=sys.stderr)        


    async def get_amplifier_session(self):

        bundle_path = Path(__file__).parent / "chat_files/base_bundle.yaml"
        foundation = await load_bundle(f"file://{bundle_path.resolve()}")

        # Prepare: resolves module sources, downloads if needed
        prepared = await foundation.prepare()

        # Create session
        try:
            session = await prepared.create_session()
            return session
        except Exception as e:
            print(f"Error creating Amplifier session: {e}", file=sys.stderr)
            return None


    async def chat(self, user_message: str) -> json:
        """Chat with Amplifier using the provided user message"""
        
        # Initialize session on first use if not already initialized
        if AMPLIFIER_AVAILABLE and self.session is None:
            print(f"Initializing Amplifier session...", file=sys.stderr)
            self.session = await self.get_amplifier_session()
            if self.session:
                print(f"Amplifier session initialized.", file=sys.stderr)
            else:
                print(f"Failed to initialize Amplifier session.", file=sys.stderr)
                    
        if self.session:
            try:
                # Use real Amplifier session
                print(f"Sending message to Amplifier: {user_message}", file=sys.stderr)
                response = await self.session.execute(user_message)
                result = json.dumps({
                        "response": response,
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    })
            except Exception as e:
                print(f"Amplifier execution error: {e}", file=sys.stderr)
                # Fall back to error response
                return json.dumps({
                        "error": f"Amplifier execution error: {e}",
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    })
        else:
            # Amplifier not available or failed to initialize
            result = json.dumps({
                "error": "Amplifier session not available",
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
        
        return result


def main():
    """Main entry point for command-line execution"""
    if len(sys.argv) < 2:
        print(json.dumps({
            "error": "No message provided",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }))
        sys.exit(1)
    
    user_message = sys.argv[1]
    session_id = sys.argv[2] if len(sys.argv) > 2 else None
    
    # Create chat instance and process message
    chat = AmplifierChat()
    
    # Run async chat method
    try:
        result = asyncio.run(chat.chat(user_message))
        print(result)  # Print JSON result to stdout
    except Exception as e:
        print(json.dumps({
            "error": f"Chat execution failed: {str(e)}",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }))
        sys.exit(1)


if __name__ == "__main__":
    main()