# Amplifier Onboarding - Backend API

**Status**: Skeleton only (Phase 0)  
**Framework**: FastAPI (Python 3.11+)  
**Deployment**: Azure Container Apps (Phase 1)

---

## Quick Start

### Local Development

1. **Install dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the server**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Test health check**:
   ```bash
   curl http://localhost:8000/health
   ```

4. **View API docs**:
   - Swagger UI: http://localhost:8000/api/docs
   - ReDoc: http://localhost:8000/api/redoc

---

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py        # Settings and configuration
│   ├── api/                 # Future: API routes (Phase 1)
│   │   └── routes/
│   ├── models/              # Future: Database models (Phase 1)
│   ├── schemas/             # Future: Pydantic schemas (Phase 1)
│   └── services/            # Future: Business logic (Phase 1)
│
├── tests/                   # Future: Backend tests (Phase 1)
├── requirements.txt         # Python dependencies
├── pyproject.toml          # Project metadata
├── .env.example            # Environment variables template
├── Dockerfile              # Container image definition
└── README.md               # This file
```

---

## Current Features

### Phase 0 (Current):
- ✅ Basic FastAPI application structure
- ✅ Health check endpoint (`GET /health`)
- ✅ CORS middleware configured for frontend
- ✅ Pydantic settings management
- ✅ Logging configured
- ✅ API documentation (auto-generated)

### Phase 1 (Planned):
- ⏳ Recipe execution engine (sandboxed)
- ⏳ WebSocket for real-time updates
- ⏳ Recipe gallery API (serve recipes from backend)
- ⏳ Execution logging and storage

### Phase 2+ (Future):
- ⏳ User authentication (GitHub OAuth)
- ⏳ Database (PostgreSQL)
- ⏳ Redis cache
- ⏳ Rate limiting
- ⏳ User-generated content storage

---

## API Endpoints

### Current:

- `GET /` - API information
- `GET /health` - Health check for monitoring

### Future (Phase 1):

- `GET /api/recipes` - List all recipes
- `GET /api/recipes/{id}` - Get recipe details
- `POST /api/execute` - Execute a recipe (requires auth in Phase 2)
- `GET /api/executions/{id}/stream` - WebSocket for real-time updates

---

## Environment Variables

See `.env.example` for all available configuration options.

**Required** (Phase 0):
- None (uses defaults)

**Optional** (Phase 0):
- `ENVIRONMENT` - development | staging | production
- `DEBUG` - true | false

**Required** (Phase 1+):
- Database, Redis, OAuth credentials (see .env.example)

---

## Development

### Run with auto-reload:
```bash
uvicorn app.main:app --reload
```

### Run with Docker (future):
```bash
docker build -t amplifier-api .
docker run -p 8000:8000 amplifier-api
```

### Run tests (Phase 1):
```bash
pytest
```

---

## Deployment

### Phase 0:
- Not deployed yet (skeleton only)
- Ready for Azure Container Apps deployment

### Phase 1:
Will deploy to **Azure Container Apps** linked to Static Web Apps frontend.

See `execution_plans/AZURE_STATIC_WEB_APPS.md` for deployment instructions.

---

## Contributing

This backend is intentionally minimal for Phase 0.

**Phase 1 additions** will include:
- Recipe execution logic
- Real-time streaming
- Sandbox management
- Logging and monitoring

See `CONTRIBUTING.md` in project root for contribution guidelines.

---

**Built with ❤️ by Microsoft**
