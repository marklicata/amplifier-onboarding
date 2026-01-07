# Docker UV Installation Fix

## Problem

When running examples on the /Playground page in the deployed Docker environment, users encountered this error:

```
Sorry, I encountered an error: Chat execution failed: Command '['uv', 'pip', 'install', '-e', '/root/.amplifier/cache/amplifier-module-loop-basic-2a73055919212040', '--python', '/usr/bin/python3', '--quiet']' returned non-zero exit status 2.
```

This error occurred when `amplifier-core` tried to install modules from GitHub using `uv pip install -e` (editable mode).

## Root Cause

The issue was caused by missing Python components and uv configuration in the Docker container:

1. **Missing `python3-venv`**: The uv package manager requires Python's venv module to properly handle virtual environments and editable installs
2. **Missing UV configuration**: UV needs specific environment variables to work correctly with system Python in a Docker container
3. **No writable cache directory**: UV needs a cache directory for storing package metadata

## Solution

Three changes were made to the `Dockerfile`:

### 1. Added `python3-venv` Package

```dockerfile
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    python3-venv \    # <-- ADDED
    git \
    curl \
    build-essential \
    ...
```

### 2. Configure UV Environment Variables

```dockerfile
# Configure uv to work with system Python and allow system package modifications
ENV UV_SYSTEM_PYTHON=1
ENV UV_PROJECT_ENVIRONMENT=/usr/local
```

- `UV_SYSTEM_PYTHON=1`: Tells UV to use the system Python instead of requiring a virtual environment
- `UV_PROJECT_ENVIRONMENT=/usr/local`: Sets the target installation directory for UV

### 3. Set UV Cache Directory

```dockerfile
# Use UV_CACHE_DIR to ensure uv has a writable cache directory
ENV UV_CACHE_DIR=/tmp/uv-cache
```

This ensures UV has a writable location for caching package metadata and downloads.

## Why This Fixes the Issue

When `amplifier-core` prepares a session, it downloads modules from GitHub to `/root/.amplifier/cache/` and then installs them using:

```bash
uv pip install -e /root/.amplifier/cache/amplifier-module-XXX --python /usr/bin/python3 --quiet
```

Without these changes:
- UV couldn't create the temporary virtual environment needed for installation
- UV didn't know where to cache packages
- UV wasn't configured to work with system Python

With these changes:
- UV can properly handle editable installs using system Python
- UV has a writable cache directory
- The required Python venv module is available

## Testing

To test this fix:

1. **Build the Docker image**:
   ```bash
   docker build -t amplifier-onboarding:test .
   ```

2. **Run the container**:
   ```bash
   docker run -d -p 3000:3000 \
     -e ANTHROPIC_API_KEY=your-key-here \
     amplifier-onboarding:test
   ```

3. **Test the playground**:
   - Navigate to http://localhost:3000/playground
   - Select any example (e.g., "01 - Hello World")
   - Click "Run Example"
   - Verify it executes without the UV installation error

## Related Documentation

- [UV Documentation - System Python](https://docs.astral.sh/uv/)
- [Amplifier Core - Module Installation](https://github.com/microsoft/amplifier-core)
- [Python venv Module](https://docs.python.org/3/library/venv.html)

## Next Steps

After deploying this fix:
1. Monitor for any other UV-related errors
2. Consider pre-installing common modules during build to improve cold-start time
3. Update CI/CD pipeline to test playground execution
