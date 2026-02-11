#!/usr/bin/env python3
"""
Unit and integration tests for the Amplifier API client.

Run with: pytest test_api_client.py -v
Or: python test_api_client.py
"""

import asyncio
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

# Import the client
from amplifier_api_client import (
    AmplifierAPIClient,
    AmplifierAPIError,
    AmplifierAuthError,
    AmplifierConfigError,
    AmplifierSessionError,
)


# ========== Fixtures ==========

@pytest.fixture
def mock_env(monkeypatch):
    """Set up test environment variables."""
    monkeypatch.setenv('AMPLIFIER_API_URL', 'https://localhost:8765')
    monkeypatch.setenv('AMPLIFIER_API_KEY', 'test-api-key')
    monkeypatch.setenv('AMPLIFIER_APP_ID', 'test-app-id')


@pytest.fixture
async def client(mock_env):
    """Create a test client."""
    client = AmplifierAPIClient(
        base_url='https://localhost:8765',
        api_key='test-api-key',
        user_id='test-user'
    )
    await client._ensure_client()
    yield client
    await client.close()


# ========== Unit Tests ==========

class TestJWTTokenManagement:
    """Test JWT token generation and management."""

    @pytest.mark.asyncio
    async def test_generate_jwt_token(self, client):
        """Test JWT token generation."""
        token = client._generate_jwt_token()
        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0

    @pytest.mark.asyncio
    async def test_jwt_token_contains_user_id(self, client):
        """Test that JWT token contains the user ID."""
        import jwt as jwt_lib

        token = client._generate_jwt_token()
        payload = jwt_lib.decode(
            token,
            "development-secret-key-change-in-production",
            algorithms=["HS256"]
        )

        assert payload['sub'] == 'test-user'
        assert 'iat' in payload
        assert 'exp' in payload

    @pytest.mark.asyncio
    async def test_get_jwt_token_caching(self, client):
        """Test that JWT tokens are cached."""
        token1 = await client.get_jwt_token()
        token2 = await client.get_jwt_token()

        assert token1 == token2  # Should return same cached token

    @pytest.mark.asyncio
    async def test_jwt_token_save_and_load(self, client, tmp_path):
        """Test saving and loading JWT tokens."""
        # Override token file path to use temp directory
        client._token_file = tmp_path / "test-token.txt"

        # Generate and save token
        token = await client.get_jwt_token()

        # Verify file was created
        assert client._token_file.exists()

        # Load token from file
        loaded_token = client._load_jwt_token()
        assert loaded_token == token


class TestConfigManagement:
    """Test config management operations."""

    @pytest.mark.asyncio
    async def test_list_user_configs_success(self, client):
        """Test listing user configs."""
        with patch.object(client._client, 'get') as mock_get:
            mock_response = MagicMock()
            mock_response.status_code = 200
            mock_response.json.return_value = [
                {'id': 'config-1', 'name': 'test-config'},
                {'id': 'config-2', 'name': 'another-config'}
            ]
            mock_get.return_value = mock_response

            configs = await client.list_user_configs()

            assert len(configs) == 2
            assert configs[0]['name'] == 'test-config'

    @pytest.mark.asyncio
    async def test_get_config_by_name_found(self, client):
        """Test getting config by name when it exists."""
        with patch.object(client, 'list_user_configs') as mock_list:
            mock_list.return_value = [
                {'id': 'config-1', 'name': 'chat-bundle'},
                {'id': 'config-2', 'name': 'other-bundle'}
            ]

            config_id = await client.get_config_by_name('chat-bundle')

            assert config_id == 'config-1'

    @pytest.mark.asyncio
    async def test_get_config_by_name_not_found(self, client):
        """Test getting config by name when it doesn't exist."""
        with patch.object(client, 'list_user_configs') as mock_list:
            mock_list.return_value = [
                {'id': 'config-1', 'name': 'other-bundle'}
            ]

            config_id = await client.get_config_by_name('nonexistent')

            assert config_id is None

    @pytest.mark.asyncio
    async def test_create_config_from_json_success(self, client, tmp_path):
        """Test creating config from JSON file."""
        # Create test JSON file
        test_bundle = {
            "name": "test-bundle",
            "description": "Test bundle",
            "session": {},
            "providers": []
        }
        json_file = tmp_path / "test-bundle.json"
        json_file.write_text(json.dumps(test_bundle))

        with patch.object(client._client, 'post') as mock_post:
            mock_response = MagicMock()
            mock_response.status_code = 201
            mock_response.json.return_value = {'id': 'new-config-id'}
            mock_post.return_value = mock_response

            config_id = await client.create_config_from_json(str(json_file))

            assert config_id == 'new-config-id'

    @pytest.mark.asyncio
    async def test_create_config_file_not_found(self, client):
        """Test creating config when file doesn't exist."""
        with pytest.raises(AmplifierConfigError, match="Bundle file not found"):
            await client.create_config_from_json("/nonexistent/file.json")


class TestSessionManagement:
    """Test session management operations."""

    @pytest.mark.asyncio
    async def test_create_session_success(self, client):
        """Test creating a session."""
        with patch.object(client._client, 'post') as mock_post:
            mock_response = MagicMock()
            mock_response.status_code = 201
            mock_response.json.return_value = {'id': 'session-123'}
            mock_post.return_value = mock_response

            session_id = await client.create_session(
                'config-id',
                tags={'type': 'test'}
            )

            assert session_id == 'session-123'

    @pytest.mark.asyncio
    async def test_get_session_success(self, client):
        """Test getting session details."""
        with patch.object(client._client, 'get') as mock_get:
            mock_response = MagicMock()
            mock_response.status_code = 200
            mock_response.json.return_value = {
                'id': 'session-123',
                'config_id': 'config-id',
                'created_at': '2026-02-11T00:00:00Z'
            }
            mock_get.return_value = mock_response

            session = await client.get_session('session-123')

            assert session['id'] == 'session-123'


class TestMessaging:
    """Test messaging operations."""

    @pytest.mark.asyncio
    async def test_send_message_success(self, client):
        """Test sending a message."""
        with patch.object(client._client, 'post') as mock_post:
            mock_response = MagicMock()
            mock_response.status_code = 200
            mock_response.json.return_value = {
                'response': 'Test response',
                'timestamp': '2026-02-11T00:00:00Z'
            }
            mock_post.return_value = mock_response

            response = await client.send_message('session-123', 'Test message')

            assert response == 'Test response'

    @pytest.mark.asyncio
    async def test_send_message_with_content_field(self, client):
        """Test sending message when response uses 'content' field."""
        with patch.object(client._client, 'post') as mock_post:
            mock_response = MagicMock()
            mock_response.status_code = 200
            mock_response.json.return_value = {
                'content': 'Test content response'
            }
            mock_post.return_value = mock_response

            response = await client.send_message('session-123', 'Test message')

            assert response == 'Test content response'


class TestErrorHandling:
    """Test error handling."""

    @pytest.mark.asyncio
    async def test_config_error_on_http_error(self, client):
        """Test that HTTP errors in config operations raise AmplifierConfigError."""
        with patch.object(client._client, 'get') as mock_get:
            import httpx
            mock_get.side_effect = httpx.HTTPStatusError(
                'Error',
                request=MagicMock(),
                response=MagicMock(status_code=404, text='Not found')
            )

            with pytest.raises(AmplifierConfigError):
                await client.list_user_configs()

    @pytest.mark.asyncio
    async def test_session_error_on_http_error(self, client):
        """Test that HTTP errors in session operations raise AmplifierSessionError."""
        with patch.object(client._client, 'post') as mock_post:
            import httpx
            mock_post.side_effect = httpx.HTTPStatusError(
                'Error',
                request=MagicMock(),
                response=MagicMock(status_code=400, text='Bad request')
            )

            with pytest.raises(AmplifierSessionError):
                await client.create_session('invalid-config-id')


class TestHealthCheck:
    """Test health check functionality."""

    @pytest.mark.asyncio
    async def test_health_check_success(self, client):
        """Test health check when API is healthy."""
        with patch.object(client._client, 'get') as mock_get:
            mock_response = MagicMock()
            mock_response.status_code = 200
            mock_get.return_value = mock_response

            is_healthy = await client.health_check()

            assert is_healthy is True

    @pytest.mark.asyncio
    async def test_health_check_failure(self, client):
        """Test health check when API is unhealthy."""
        with patch.object(client._client, 'get') as mock_get:
            mock_response = MagicMock()
            mock_response.status_code = 503
            mock_get.return_value = mock_response

            is_healthy = await client.health_check()

            assert is_healthy is False

    @pytest.mark.asyncio
    async def test_health_check_connection_error(self, client):
        """Test health check when connection fails."""
        with patch.object(client._client, 'get') as mock_get:
            mock_get.side_effect = Exception("Connection failed")

            is_healthy = await client.health_check()

            assert is_healthy is False


# ========== Integration Tests ==========

class TestIntegration:
    """
    Integration tests that require the actual API service.

    These tests will be skipped if the API is not available.
    Set AMPLIFIER_API_INTEGRATION_TESTS=1 to run these tests.
    """

    @pytest.mark.skipif(
        os.getenv('AMPLIFIER_API_INTEGRATION_TESTS') != '1',
        reason="Integration tests disabled (set AMPLIFIER_API_INTEGRATION_TESTS=1 to enable)"
    )
    @pytest.mark.asyncio
    async def test_full_workflow(self):
        """Test complete workflow: config → session → message."""
        client = AmplifierAPIClient()
        await client._ensure_client()

        try:
            # Check health
            is_healthy = await client.health_check()
            assert is_healthy, "API service is not healthy"

            # Get or create config
            config_id = await client.get_config_by_name('chat-bundle')
            if not config_id:
                config_id = await client.create_config_from_json('01-chat-bundle.json')

            assert config_id is not None

            # Create session
            session_id = await client.create_session(config_id, tags={'type': 'test'})
            assert session_id is not None

            # Send message
            response = await client.send_message(session_id, 'Hello, this is a test')
            assert response is not None
            assert len(response) > 0

            print(f"\nIntegration test response: {response[:100]}...")

        finally:
            await client.close()


# ========== Main (for running without pytest) ==========

async def run_basic_tests():
    """Run basic tests without pytest."""
    print("=" * 60)
    print("Running Basic API Client Tests")
    print("=" * 60)

    client = AmplifierAPIClient(user_id='test-user')

    try:
        print("\n[Test 1] JWT Token Generation")
        token = await client.get_jwt_token()
        print(f"  Token generated: {token[:20]}...")

        print("\n[Test 2] Client Initialization")
        await client._ensure_client()
        print("  Client initialized successfully")

        print("\n[Test 3] Health Check")
        is_healthy = await client.health_check()
        print(f"  Health check: {'PASS' if is_healthy else 'FAIL (expected if API not running)'}")

        if is_healthy:
            print("\n[Test 4] List Configs")
            try:
                configs = await client.list_user_configs()
                print(f"  Found {len(configs)} configs")
            except Exception as e:
                print(f"  Error: {e}")

        print("\n" + "=" * 60)
        print("Basic tests completed")
        print("=" * 60)

    finally:
        await client.close()


if __name__ == '__main__':
    # Check if pytest is available
    try:
        import pytest
        # Run with pytest
        sys.exit(pytest.main([__file__, '-v']))
    except ImportError:
        # Run basic tests without pytest
        print("pytest not available, running basic tests only")
        asyncio.run(run_basic_tests())
