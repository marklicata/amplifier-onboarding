#!/usr/bin/env python3
"""
Amplifier API HTTP Client with JWT Authentication

This client provides a Python interface to the amplifier-api REST service,
including JWT token management, config operations, session management, and messaging.
"""

import asyncio
import json
import os
import re
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import AsyncIterator, Dict, List, Optional, Any

import httpx
import jwt


class AmplifierAPIError(Exception):
    """Base exception for Amplifier API errors."""
    pass


class AmplifierAuthError(AmplifierAPIError):
    """Authentication-related errors."""
    pass


class AmplifierConfigError(AmplifierAPIError):
    """Config-related errors."""
    pass


class AmplifierSessionError(AmplifierAPIError):
    """Session-related errors."""
    pass


def substitute_env_vars(data: Any) -> Any:
    """
    Recursively substitute environment variables in the form ${VAR_NAME}.

    Args:
        data: Dictionary, list, string, or other data structure

    Returns:
        Data with environment variables substituted
    """
    if isinstance(data, dict):
        return {key: substitute_env_vars(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [substitute_env_vars(item) for item in data]
    elif isinstance(data, str):
        # Replace ${VAR_NAME} with environment variable value
        def replace_var(match):
            var_name = match.group(1)
            value = os.getenv(var_name)
            if value is None:
                print(f"Warning: Environment variable {var_name} not set", file=sys.stderr)
                return match.group(0)  # Keep original if not found
            return value

        return re.sub(r'\$\{([^}]+)\}', replace_var, data)
    else:
        return data


class AmplifierAPIClient:
    """
    HTTP client for the Amplifier API service.

    Handles JWT authentication, config management, session lifecycle, and messaging.
    """

    def __init__(
        self,
        base_url: Optional[str] = None,
        api_key: Optional[str] = None,
        app_id: Optional[str] = None,
        timeout: int = 60,
        user_id: Optional[str] = None
    ):
        """
        Initialize the Amplifier API client.

        Args:
            base_url: Base URL for the API (defaults to AMPLIFIER_API_URL env var)
            api_key: API key for authentication (defaults to AMPLIFIER_API_KEY env var)
            app_id: Application ID (defaults to AMPLIFIER_APP_ID env var)
            timeout: Request timeout in seconds
            user_id: User ID for JWT token (defaults to "default-user")
        """
        self.base_url = (base_url or os.getenv('AMPLIFIER_API_URL', 'https://localhost:8765')).rstrip('/')
        self.api_key = api_key or os.getenv('AMPLIFIER_API_KEY', '')
        self.app_id = app_id or os.getenv('AMPLIFIER_APP_ID', '')
        self.timeout = timeout
        self.user_id = user_id or "default-user"

        # JWT token cache
        self._jwt_token: Optional[str] = None
        self._jwt_expires_at: Optional[datetime] = None

        # HTTP client with connection pooling
        self._client: Optional[httpx.AsyncClient] = None

        # Token file path
        self._token_file = Path.home() / '.amplifier' / 'nexus-user-token.txt'

    async def __aenter__(self):
        """Async context manager entry."""
        await self._ensure_client()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.close()

    async def _ensure_client(self):
        """Ensure HTTP client is initialized."""
        if self._client is None:
            # Try to use HTTP/2 if available, fall back to HTTP/1.1
            try:
                self._client = httpx.AsyncClient(
                    timeout=self.timeout,
                    verify=False,  # Disable SSL verification for localhost
                    http2=True,
                    limits=httpx.Limits(max_keepalive_connections=10, max_connections=20)
                )
            except Exception:
                # Fall back to HTTP/1.1 if HTTP/2 not available
                self._client = httpx.AsyncClient(
                    timeout=self.timeout,
                    verify=False,
                    limits=httpx.Limits(max_keepalive_connections=10, max_connections=20)
                )

    async def close(self):
        """Close the HTTP client."""
        if self._client is not None:
            await self._client.aclose()
            self._client = None

    # ========== Authentication ==========

    def _generate_jwt_token(self) -> str:
        """
        Generate a new JWT token for the user.

        Uses the development secret key. In production, tokens should be
        obtained from the authentication service.
        """
        secret_key = "development-secret-key-change-in-production"

        payload = {
            "sub": self.user_id,
            "iat": datetime.now(timezone.utc),
            "exp": datetime.now(timezone.utc) + timedelta(days=30)
        }

        token = jwt.encode(payload, secret_key, algorithm="HS256")
        return token

    def _save_jwt_token(self, token: str):
        """Save JWT token to file."""
        try:
            self._token_file.parent.mkdir(parents=True, exist_ok=True)
            self._token_file.write_text(token, encoding='utf-8')
        except Exception as e:
            print(f"Warning: Could not save JWT token: {e}", file=sys.stderr)

    def _load_jwt_token(self) -> Optional[str]:
        """Load JWT token from file."""
        try:
            if self._token_file.exists():
                return self._token_file.read_text(encoding='utf-8').strip()
        except Exception as e:
            print(f"Warning: Could not load JWT token: {e}", file=sys.stderr)
        return None

    async def get_jwt_token(self) -> str:
        """
        Get a valid JWT token, generating or refreshing if necessary.

        Returns:
            Valid JWT token string
        """
        # Check if cached token is still valid
        if self._jwt_token and self._jwt_expires_at:
            if datetime.now(timezone.utc) < self._jwt_expires_at - timedelta(minutes=5):
                return self._jwt_token

        # Try to load from file
        token = self._load_jwt_token()

        # Verify token is valid
        if token:
            try:
                payload = jwt.decode(
                    token,
                    "development-secret-key-change-in-production",
                    algorithms=["HS256"]
                )
                exp = datetime.fromtimestamp(payload['exp'], tz=timezone.utc)

                # Check if token is still valid
                if datetime.now(timezone.utc) < exp - timedelta(minutes=5):
                    self._jwt_token = token
                    self._jwt_expires_at = exp
                    return token
            except jwt.InvalidTokenError:
                pass  # Token invalid, will generate new one

        # Generate new token
        token = self._generate_jwt_token()
        payload = jwt.decode(
            token,
            "development-secret-key-change-in-production",
            algorithms=["HS256"]
        )

        self._jwt_token = token
        self._jwt_expires_at = datetime.fromtimestamp(payload['exp'], tz=timezone.utc)

        # Save to file
        self._save_jwt_token(token)

        return token

    async def _get_headers(self) -> Dict[str, str]:
        """Get request headers with authentication."""
        jwt_token = await self.get_jwt_token()

        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {jwt_token}',
        }

        # Add API key (for amplifier-api authentication)
        if self.api_key:
            headers['X-API-Key'] = self.api_key

        # Add App ID (for application identification)
        if self.app_id:
            headers['X-App-ID'] = self.app_id

        return headers

    # ========== Health Check ==========

    async def health_check(self) -> bool:
        """
        Check if the API service is healthy.

        Returns:
            True if service is healthy, False otherwise
        """
        try:
            await self._ensure_client()
            response = await self._client.get(
                f"{self.base_url}/health",
                timeout=5.0
            )
            return response.status_code == 200
        except Exception as e:
            print(f"Health check failed: {e}", file=sys.stderr)
            return False

    # ========== Config Management ==========

    async def list_user_configs(self) -> List[Dict[str, Any]]:
        """
        List all configs for the authenticated user.

        The API automatically filters by user_id from the JWT token.

        Returns:
            List of config dictionaries
        """
        try:
            await self._ensure_client()
            headers = await self._get_headers()

            response = await self._client.get(
                f"{self.base_url}/configs",
                headers=headers
            )
            response.raise_for_status()

            result = response.json()

            # API returns: {"configs": [...], "total": N}
            # Extract the configs list
            if isinstance(result, dict) and 'configs' in result:
                configs = result['configs']
                return configs
            elif isinstance(result, list):
                # Direct list (fallback for different API versions)
                return result
            else:
                raise AmplifierConfigError(f"Unexpected response format: {type(result).__name__}")

        except httpx.HTTPStatusError as e:
            raise AmplifierConfigError(f"Failed to list configs (HTTP {e.response.status_code}): {e.response.text}")
        except json.JSONDecodeError as e:
            raise AmplifierConfigError(f"Invalid JSON response from API: {str(e)}")
        except Exception as e:
            raise AmplifierConfigError(f"Failed to list configs: {str(e)}")

    async def get_config_by_name(self, name: str) -> Optional[str]:
        """
        Get a config ID by name for the authenticated user.

        Args:
            name: Config name to search for

        Returns:
            Config ID if found, None otherwise
        """
        try:
            configs = await self.list_user_configs()

            for config in configs:
                # Ensure config is a dict
                if not isinstance(config, dict):
                    print(f"Warning: Config item is not a dict: {type(config)}", file=sys.stderr)
                    continue

                if config.get('name') == name:
                    # API returns 'config_id' not 'id'
                    config_id = config.get('config_id') or config.get('id')
                    return config_id

            return None

        except Exception as e:
            raise

    async def get_config(self, config_id: str) -> Dict[str, Any]:
        """
        Get a config by ID.

        Args:
            config_id: Config ID

        Returns:
            Config dictionary
        """
        try:
            await self._ensure_client()
            headers = await self._get_headers()

            response = await self._client.get(
                f"{self.base_url}/configs/{config_id}",
                headers=headers
            )
            response.raise_for_status()

            return response.json()
        except httpx.HTTPStatusError as e:
            raise AmplifierConfigError(f"Failed to get config: {e.response.text}")
        except Exception as e:
            raise AmplifierConfigError(f"Failed to get config: {str(e)}")

    async def create_config_from_json(self, json_path: str) -> str:
        """
        Create a new config from a JSON bundle file.

        Args:
            json_path: Path to JSON bundle file

        Returns:
            Created config ID
        """
        try:
            # Load JSON bundle
            bundle_path = Path(json_path)
            if not bundle_path.is_absolute():
                # Relative to bundles directory
                script_dir = Path(__file__).parent
                bundle_path = script_dir.parent / 'bundles' / json_path

            if not bundle_path.exists():
                raise AmplifierConfigError(f"Bundle file not found: {bundle_path}")

            with open(bundle_path, 'r', encoding='utf-8') as f:
                config_data = json.load(f)

            # Substitute environment variables (e.g., ${ANTHROPIC_API_KEY})
            config_data = substitute_env_vars(config_data)

            # Create config via API
            await self._ensure_client()
            headers = await self._get_headers()

            response = await self._client.post(
                f"{self.base_url}/configs",
                headers=headers,
                json=config_data
            )
            response.raise_for_status()

            result = response.json()

            # API might return different field names for the ID
            config_id = result.get('id') or result.get('config_id') or result.get('_id')

            if not config_id:
                raise AmplifierConfigError(f"No config ID in response: {result}")

            return config_id

        except httpx.HTTPStatusError as e:
            raise AmplifierConfigError(f"Failed to create config (HTTP {e.response.status_code}): {e.response.text}")
        except Exception as e:
            raise AmplifierConfigError(f"Failed to create config: {str(e)}")

    # ========== Session Management ==========

    async def create_session(
        self,
        config_id: str,
        tags: Optional[Dict[str, str]] = None
    ) -> str:
        """
        Create a new session from a config.

        Args:
            config_id: Config ID to use for the session
            tags: Optional tags for the session

        Returns:
            Created session ID
        """
        try:
            await self._ensure_client()
            headers = await self._get_headers()

            payload = {
                "config_id": config_id
            }

            if tags:
                payload["tags"] = tags

            response = await self._client.post(
                f"{self.base_url}/sessions",
                headers=headers,
                json=payload
            )
            response.raise_for_status()

            result = response.json()

            # API might return different field names
            session_id = result.get('session_id') or result.get('id') or result.get('_id')

            if not session_id:
                raise AmplifierSessionError(f"No session ID in response: {result}")

            return session_id

        except httpx.HTTPStatusError as e:
            raise AmplifierSessionError(f"Failed to create session: {e.response.text}")
        except Exception as e:
            raise AmplifierSessionError(f"Failed to create session: {str(e)}")

    async def get_session(self, session_id: str) -> Dict[str, Any]:
        """
        Get session details.

        Args:
            session_id: Session ID

        Returns:
            Session dictionary
        """
        try:
            await self._ensure_client()
            headers = await self._get_headers()

            response = await self._client.get(
                f"{self.base_url}/sessions/{session_id}",
                headers=headers
            )
            response.raise_for_status()

            return response.json()

        except httpx.HTTPStatusError as e:
            raise AmplifierSessionError(f"Failed to get session: {e.response.text}")
        except Exception as e:
            raise AmplifierSessionError(f"Failed to get session: {str(e)}")

    # ========== Messaging ==========

    async def send_message(self, session_id: str, message: str) -> str:
        """
        Send a message to a session and get the response.

        Args:
            session_id: Session ID
            message: User message

        Returns:
            Assistant response text
        """
        try:
            await self._ensure_client()
            headers = await self._get_headers()

            # API expects 'message' field, not 'content'
            payload = {
                "message": message
            }

            response = await self._client.post(
                f"{self.base_url}/sessions/{session_id}/messages",
                headers=headers,
                json=payload
            )
            response.raise_for_status()

            result = response.json()

            # API might return 'response', 'content', or 'message'
            return result.get('response', result.get('content', result.get('message', '')))

        except httpx.HTTPStatusError as e:
            raise AmplifierAPIError(f"Failed to send message: {e.response.text}")
        except Exception as e:
            raise AmplifierAPIError(f"Failed to send message: {str(e)}")

    async def stream_message(
        self,
        session_id: str,
        message: str
    ) -> AsyncIterator[Dict[str, Any]]:
        """
        Send a message to a session and stream the response.

        Args:
            session_id: Session ID
            message: User message

        Yields:
            Streaming chunks as dictionaries with 'type' and 'data' fields
        """
        try:
            await self._ensure_client()
            headers = await self._get_headers()
            headers['Accept'] = 'text/event-stream'

            payload = {
                "content": message,
                "stream": True
            }

            async with self._client.stream(
                'POST',
                f"{self.base_url}/sessions/{session_id}/messages",
                headers=headers,
                json=payload
            ) as response:
                response.raise_for_status()

                async for line in response.aiter_lines():
                    line = line.strip()

                    if not line or line.startswith(':'):
                        continue

                    if line.startswith('data: '):
                        data = line[6:]  # Remove 'data: ' prefix

                        if data == '[DONE]':
                            break

                        try:
                            chunk = json.loads(data)
                            yield chunk
                        except json.JSONDecodeError:
                            # Plain text chunk
                            yield {'type': 'chunk', 'data': data}

        except httpx.HTTPStatusError as e:
            raise AmplifierAPIError(f"Failed to stream message: {e.response.text}")
        except Exception as e:
            raise AmplifierAPIError(f"Failed to stream message: {str(e)}")

    # ========== Utilities ==========

    def _format_error(self, error: Exception) -> Dict[str, Any]:
        """Format an error as a JSON-compatible dictionary."""
        return {
            "error": str(error),
            "type": type(error).__name__,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }


# Convenience function for creating a client
async def create_client(
    base_url: Optional[str] = None,
    api_key: Optional[str] = None,
    timeout: int = 60,
    user_id: Optional[str] = None
) -> AmplifierAPIClient:
    """
    Create and initialize an Amplifier API client.

    Args:
        base_url: Base URL for the API
        api_key: API key for authentication
        timeout: Request timeout in seconds
        user_id: User ID for JWT token

    Returns:
        Initialized AmplifierAPIClient instance
    """
    client = AmplifierAPIClient(
        base_url=base_url,
        api_key=api_key,
        timeout=timeout,
        user_id=user_id
    )
    await client._ensure_client()
    return client
