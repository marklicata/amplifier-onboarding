#!/usr/bin/env python3
"""
Validate that all required system dependencies are installed.
Run this at container startup to catch missing dependencies early.
"""

import sys
import os
import subprocess
import importlib.util
import asyncio
from pathlib import Path

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    # Go from lib/amplifier/python/ up to project root
    project_root = Path(__file__).parent.parent.parent.parent
    env_path = project_root / ".env"
    if env_path.exists():
        load_dotenv(env_path)
except ImportError:
    pass  # dotenv will be checked later


def check_command(cmd, display_name=None):
    """Check if a command exists in PATH."""
    display = display_name or cmd
    try:
        result = subprocess.run(
            [cmd, "--version"], capture_output=True, text=True, timeout=5
        )
        if result.returncode == 0:
            version = result.stdout.strip().split("\n")[0]
            print(f"[OK] {display}: {version}")
            return True
    except FileNotFoundError:
        print(f"[ERROR] {display}: NOT FOUND")
        return False
    except Exception as e:
        print(f"[ERROR] {display}: ERROR - {e}")
        return False


def check_python_package(package_name):
    """Check if a Python package is installed."""
    spec = importlib.util.find_spec(package_name)
    if spec is not None:
        print(f"[OK] Python package '{package_name}': installed")
        return True
    else:
        print(f"[ERROR] Python package '{package_name}': NOT FOUND")
        return False


def check_env_variable(var_name, required=True):
    """Check if an environment variable is set."""
    value = os.getenv(var_name)
    if value:
        # Mask API keys and tokens
        if 'KEY' in var_name or 'TOKEN' in var_name:
            masked_value = value[:8] + '...' if len(value) > 8 else '***'
            print(f"[OK] Environment variable '{var_name}': {masked_value}")
        else:
            print(f"[OK] Environment variable '{var_name}': {value}")
        return True
    else:
        level = "[ERROR]" if required else "[WARN]"
        print(f"{level} Environment variable '{var_name}': NOT SET")
        return not required  # Return True if optional


async def check_api_health(base_url):
    """Check if the Amplifier API service is reachable."""
    try:
        import httpx
        async with httpx.AsyncClient(verify=False, timeout=5.0) as client:
            response = await client.get(f"{base_url}/health")
            if response.status_code == 200:
                print(f"[OK] Amplifier API health check: {base_url}")
                return True
            else:
                print(f"[WARN] Amplifier API returned status {response.status_code}")
                return False
    except ImportError:
        print("[WARN] httpx not available, skipping API health check")
        return False
    except Exception as e:
        print(f"[WARN] Amplifier API health check failed: {e}")
        return False


async def main_async():
    print("=" * 60)
    print("Validating System Dependencies")
    print("=" * 60)

    all_ok = True

    # System commands
    print("\n[System Commands]")
    all_ok &= check_command("python3", "Python 3")
    all_ok &= check_command("pip3", "pip3")
    all_ok &= check_command("git", "Git")
    all_ok &= check_command("uv", "uv (Python package manager)")
    all_ok &= check_command("node", "Node.js")
    all_ok &= check_command("npm", "npm")

    # Python packages (critical ones)
    print("\n[Python Packages - Core]")
    all_ok &= check_python_package("anthropic")
    all_ok &= check_python_package("dotenv")

    # Python packages for API client
    print("\n[Python Packages - API Client]")
    api_packages_ok = True
    api_packages_ok &= check_python_package("httpx")
    api_packages_ok &= check_python_package("jwt")

    if not api_packages_ok:
        print("\n[WARN] API client packages missing. Run: pip install httpx pyjwt")

    # Try importing amplifier packages (still needed for bundles/recipes)
    print("\n[Amplifier Libraries - For Bundles/Recipes]")
    try:
        import amplifier_core
        print("[OK] amplifier_core: installed")
    except ImportError as e:
        print(f"[ERROR] amplifier_core: NOT FOUND - {e}")
        all_ok = False

    try:
        import amplifier_foundation
        print("[OK] amplifier_foundation: installed")
    except ImportError as e:
        print(f"[ERROR] amplifier_foundation: NOT FOUND - {e}")
        all_ok = False

    # Check environment variables
    print("\n[Environment Variables]")
    use_api = os.getenv('AMPLIFIER_USE_API', 'true').lower() == 'true'
    print(f"[OK] AMPLIFIER_USE_API: {use_api} (API mode: {'enabled' if use_api else 'disabled'})")

    if use_api:
        # These are only required when using API mode
        all_ok &= check_env_variable('AMPLIFIER_API_URL', required=True)
        all_ok &= check_env_variable('AMPLIFIER_API_KEY', required=True)
        check_env_variable('AMPLIFIER_APP_ID', required=False)

        # Check API health
        api_url = os.getenv('AMPLIFIER_API_URL')
        if api_url and api_packages_ok:
            print("\n[API Health Check]")
            # Note: Health check failure is a warning, not a hard failure
            await check_api_health(api_url)

    print("\n" + "=" * 60)
    if all_ok:
        print("[OK] All critical dependencies validated successfully!")
        print("=" * 60)
        return 0
    else:
        print("[ERROR] Some critical dependencies are missing!")
        print("=" * 60)
        return 1


def main():
    """Main entry point."""
    exit_code = asyncio.run(main_async())
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
