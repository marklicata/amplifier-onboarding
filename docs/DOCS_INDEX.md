# Documentation Index

## Main Documentation

### Getting Started
- **[README.md](./README.md)** - Main project documentation, architecture, features
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick setup guide (5 minutes)

### Deployment
- **[DOCKER_OPTIMIZATION_GUIDE.md](./DOCKER_OPTIMIZATION_GUIDE.md)** - Docker build optimization tips

### Architecture & Implementation
- **[USER_IDENTITY_FLOW.md](./USER_IDENTITY_FLOW.md)** - User authentication and identity flow

### Testing
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Comprehensive testing guide (12 steps)
- **[QUICK_TEST_COMMANDS.md](./QUICK_TEST_COMMANDS.md)** - Copy-paste test commands
- **[TEST_COVERAGE_SUMMARY.md](./TEST_COVERAGE_SUMMARY.md)** - Test metrics and status

## Key Files

### Configuration
- `.env.example` - Environment variable template
- `.env` - Local environment configuration (not in git)
- `requirements.txt` - Python dependencies
- `requirements-test.txt` - Test dependencies
- `package.json` - Node.js dependencies

### Python Scripts
- `lib/amplifier/python/amplifier_api_client.py` - REST API client
- `lib/amplifier/python/amplifier-chat.py` - Chat implementation (API-based)
- `lib/amplifier/python/run-bundle.py` - Bundle executor (library-based)
- `lib/amplifier/python/run-bundle-stream.py` - Streaming bundle executor
- `lib/amplifier/python/validate-deps.py` - Dependency validation
- `lib/amplifier/python/test_api_client.py` - API client tests
- `lib/amplifier/python/convert_bundles.py` - YAML to JSON converter

### Bundles
- `lib/amplifier/bundles/*.yaml` - YAML bundle configurations (for library mode)
- `lib/amplifier/bundles/*.json` - JSON bundle configurations (for API mode)

## Quick Links

### Development
```bash
npm run dev                  # Start dev server
npm run validate:deps        # Check dependencies
npm run test:python          # Run Python tests
```

### Testing
```bash
# Quick test
npm run test:chat

# Full test suite
pytest lib/amplifier/python/test_api_client.py -v
```

### Docker
```bash
docker-compose build         # Build image
docker-compose up           # Start container
```

## Documentation Maintenance

### Keep Updated
- README.md - Main entry point
- QUICKSTART.md - Getting started guide
- USER_IDENTITY_FLOW.md - When auth changes
- TESTING_GUIDE.md - When adding new tests

### Generated/Temporary
- None currently - all temporary docs removed

## Migration Notes

The application now uses a hybrid architecture:
- **Chat** - Uses Amplifier REST API (amplifier_api_client.py)
- **Bundles/Recipes** - Use direct library imports (amplifier_core/foundation)

See README.md Architecture section for details.
