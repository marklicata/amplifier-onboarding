#!/usr/bin/env python3
"""
Simple Amplifier chat script for Q&A about Amplifier itself.
Runs standalone from Next.js API routes using Amplifier REST API.
Runs standalone from Next.js API routes using Amplifier REST API.
"""

import sys
import json
import asyncio
import os
import os
from pathlib import Path
from datetime import datetime, timezone
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

# Import the Amplifier API client
# Import the Amplifier API client
try:
    from amplifier_api_client import (
        AmplifierAPIClient,
        AmplifierAPIError,
        AmplifierAuthError,
        AmplifierConfigError,
        AmplifierSessionError
    )
    API_CLIENT_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Could not import amplifier_api_client: {e}", file=sys.stderr)
    API_CLIENT_AVAILABLE = False
    from amplifier_api_client import (
        AmplifierAPIClient,
        AmplifierAPIError,
        AmplifierAuthError,
        AmplifierConfigError,
        AmplifierSessionError
    )
    API_CLIENT_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Could not import amplifier_api_client: {e}", file=sys.stderr)
    API_CLIENT_AVAILABLE = False


class AmplifierChat:
    """Simple chat interface to Amplifier via REST API"""
    """Simple chat interface to Amplifier via REST API"""

    def __init__(self, user_id: str = None, session_id: str = None):
        """
        Initialize the chat client.

        Args:
            user_id: User identifier (anonymous_id or authenticated user_id)
            session_id: Existing session ID to reuse (optional)
        """
        self.user_id = user_id or "anonymous"
        self.client = None
        self.config_id = None
        self.session_id = session_id  # Reuse existing session if provided
        self.use_api = os.getenv('AMPLIFIER_USE_API', 'true').lower() == 'true'

        if API_CLIENT_AVAILABLE and self.use_api:
            if self.session_id:
                print(f"Reusing session {self.session_id} for user {self.user_id}", file=sys.stderr)
            else:
                print(f"Amplifier API client loaded for user: {self.user_id}", file=sys.stderr)
    def __init__(self, user_id: str = None, session_id: str = None):
        """
        Initialize the chat client.

        Args:
            user_id: User identifier (anonymous_id or authenticated user_id)
            session_id: Existing session ID to reuse (optional)
        """
        self.user_id = user_id or "anonymous"
        self.client = None
        self.config_id = None
        self.session_id = session_id  # Reuse existing session if provided
        self.use_api = os.getenv('AMPLIFIER_USE_API', 'true').lower() == 'true'

        if API_CLIENT_AVAILABLE and self.use_api:
            if self.session_id:
                print(f"Reusing session {self.session_id} for user {self.user_id}", file=sys.stderr)
            else:
                print(f"Amplifier API client loaded for user: {self.user_id}", file=sys.stderr)
        else:
            print("Amplifier API client not available or disabled", file=sys.stderr)

    async def _ensure_client(self):
        """Ensure the API client is initialized."""
        if self.client is None:
            self.client = AmplifierAPIClient(user_id=self.user_id)
            await self.client._ensure_client()

    async def _ensure_config(self):
        """Ensure we have a config ID, creating one if necessary."""
        if self.config_id is not None:
            return

        await self._ensure_client()

        # Try to get existing config by name
        print("Looking up chat-bundle config...", file=sys.stderr)
        self.config_id = await self.client.get_config_by_name("chat-bundle")

        # If not found, create from JSON bundle
        if not self.config_id:
            print("Config not found, creating from JSON bundle...", file=sys.stderr)
            try:
                self.config_id = await self.client.create_config_from_json(
                    "01-chat-bundle.json"
                )
                print(f"Created config: {self.config_id}", file=sys.stderr)
            except Exception as e:
                print(f"Failed to create config: {e}", file=sys.stderr)
                raise
        else:
            print(f"Found existing config: {self.config_id}", file=sys.stderr)

    async def _ensure_session(self):
        """Ensure we have a session ID, creating one if necessary."""
        # Always ensure client and config are initialized
        await self._ensure_config()

        if self.session_id is not None:
            # Session already exists (reusing from previous call)
            return

        # Create a new session
        print("Creating new session...", file=sys.stderr)
        try:
            self.session_id = await self.client.create_session(
                self.config_id,
                tags={
                    "type": "chat",
                    "source": "onboarding-app",
                    "user_id": self.user_id
                }
            )
            print(f"Created session: {self.session_id}", file=sys.stderr)
        except Exception as e:
            print(f"Failed to create session: {e}", file=sys.stderr)
            raise
            print(f"Failed to create session: {e}", file=sys.stderr)
            raise

    async def chat(self, user_message: str) -> str:
        """
        Chat with Amplifier using the provided user message.

        Args:
            user_message: The user's message

        Returns:
            JSON string with response or error
        """
        if not API_CLIENT_AVAILABLE or not self.use_api:
            return json.dumps({
                "error": "Amplifier API client not available or disabled",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })

        try:
            # Ensure we have a client, config, and session
            await self._ensure_session()

            # Send message to session
            print(f"Sending message to Amplifier API: {user_message}", file=sys.stderr)
            try:
                response = await self.client.send_message(self.session_id, user_message)
            except (AttributeError, AmplifierSessionError, AmplifierAPIError) as e:
                # Check if it's a session not found error
                error_msg = str(e).lower()
                if "session not found" in error_msg or isinstance(e, (AttributeError, AmplifierSessionError)):
                    # If reused session is invalid or client wasn't properly initialized,
                    # reset and create a new session
                    old_session_id = self.session_id
                    print(f"Session not found or invalid (session_id: {old_session_id}): {e}", file=sys.stderr)
                    print("Automatically creating new session to recover...", file=sys.stderr)
                    self.session_id = None
                    await self._ensure_session()
                    print(f"New session created: {self.session_id}", file=sys.stderr)
                    response = await self.client.send_message(self.session_id, user_message)
                else:
                    # Re-raise other API errors
                    raise

            return json.dumps({
                "response": response,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "session_id": self.session_id
            })

        except AmplifierAuthError as e:
            print(f"Authentication error: {e}", file=sys.stderr)
            return json.dumps({
                "error": f"Authentication error: {str(e)}",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })

        except AmplifierConfigError as e:
            print(f"Config error: {e}", file=sys.stderr)
            return json.dumps({
                "error": f"Config error: {str(e)}",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })

        except AmplifierSessionError as e:
            print(f"Session error: {e}", file=sys.stderr)
            # Reset session ID and try again on next call
            self.session_id = None
            return json.dumps({
                "error": f"Session error: {str(e)}",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })

        except AmplifierAPIError as e:
            print(f"API error: {e}", file=sys.stderr)
            return json.dumps({
                "error": f"API error: {str(e)}",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })

        except Exception as e:
            print(f"Unexpected error: {e}", file=sys.stderr)
            return json.dumps({
                "error": f"Unexpected error: {str(e)}",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })

    async def close(self):
        """Close the API client."""
        if self.client:
            await self.client.close()


async def main_async():
    """Async main entry point."""
    if len(sys.argv) < 2:
        print(
            json.dumps(
                {
                    "error": "No message provided",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            )
        )
        print(
            json.dumps(
                {
                    "error": "No message provided",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            )
        )
        sys.exit(1)


    user_message = sys.argv[1]
    existing_session_id = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] else None
    user_id = sys.argv[3] if len(sys.argv) > 3 else "anonymous"

    # Create chat instance with user_id and existing session
    chat = AmplifierChat(user_id=user_id, session_id=existing_session_id)

    existing_session_id = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] else None
    user_id = sys.argv[3] if len(sys.argv) > 3 else "anonymous"

    # Create chat instance with user_id and existing session
    chat = AmplifierChat(user_id=user_id, session_id=existing_session_id)

    try:
        result = await chat.chat(user_message)
        result = await chat.chat(user_message)
        print(result)  # Print JSON result to stdout
    except Exception as e:
        print(
            json.dumps(
                {
                    "error": f"Chat execution failed: {str(e)}",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            )
        )
        print(
            json.dumps(
                {
                    "error": f"Chat execution failed: {str(e)}",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            )
        )
        sys.exit(1)
    finally:
        await chat.close()


def main():
    """Main entry point for command-line execution."""
    asyncio.run(main_async())
    finally:
        await chat.close()


def main():
    """Main entry point for command-line execution."""
    asyncio.run(main_async())


if __name__ == "__main__":
    main()

