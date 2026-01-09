#!/usr/bin/env python3
"""
Validate that all required system dependencies are installed.
Run this at container startup to catch missing dependencies early.
"""
import sys
import subprocess
import importlib.util

def check_command(cmd, display_name=None):
    """Check if a command exists in PATH."""
    display = display_name or cmd
    try:
        result = subprocess.run(
            [cmd, "--version"],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            version = result.stdout.strip().split('\n')[0]
            print(f"✓ {display}: {version}")
            return True
    except FileNotFoundError:
        print(f"✗ {display}: NOT FOUND")
        return False
    except Exception as e:
        print(f"✗ {display}: ERROR - {e}")
        return False

def check_python_package(package_name):
    """Check if a Python package is installed."""
    spec = importlib.util.find_spec(package_name)
    if spec is not None:
        print(f"✓ Python package '{package_name}': installed")
        return True
    else:
        print(f"✗ Python package '{package_name}': NOT FOUND")
        return False

def main():
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
    print("\n[Python Packages]")
    all_ok &= check_python_package("anthropic")
    all_ok &= check_python_package("dotenv")

    # Try importing amplifier packages
    try:
        import amplifier_core
        print(f"✓ amplifier_core: installed")
    except ImportError as e:
        print(f"✗ amplifier_core: NOT FOUND - {e}")
        all_ok = False

    try:
        import amplifier_foundation
        print(f"✓ amplifier_foundation: installed")
    except ImportError as e:
        print(f"✗ amplifier_foundation: NOT FOUND - {e}")
        all_ok = False

    print("\n" + "=" * 60)
    if all_ok:
        print("✓ All dependencies validated successfully!")
        print("=" * 60)
        sys.exit(0)
    else:
        print("✗ Some dependencies are missing!")
        print("=" * 60)
        sys.exit(1)

if __name__ == "__main__":
    main()
