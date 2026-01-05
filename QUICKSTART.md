# Quick Start Guide - Phase 0

## Prerequisites

- Node.js 20+
- Python 3.11+
- Docker Desktop (for PostgreSQL)
- GitHub account for authentication
- GitHub OAuth credentials (get from team lead - see SETUP_OAUTH.md)

## Important: OAuth Setup

**You do NOT need to create a GitHub OAuth app!**

The application uses a **shared OAuth app** that's already configured. Get the credentials from:
- Your team lead
- The team's shared password manager
- Azure Key Vault (for production)

If you're the first developer setting this up, see [SETUP_OAUTH.md](./SETUP_OAUTH.md) for one-time OAuth app creation.

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy example env file
copy .env.example .env

# Edit .env and add the SHARED team credentials:
# - GITHUB_CLIENT_ID=<get from team>
# - GITHUB_CLIENT_SECRET=<get from team>
# - JWT_SECRET=<generate a random string for your local dev>
```

**Note**: These are shared development credentials. Everyone on the team uses the same OAuth app.

### 3. Start PostgreSQL

```bash
# From project root
docker compose up -d postgres
```

### 4. Initialize Database

```bash
# Create tables (from backend directory)
alembic upgrade head
```

### 5. Run Backend

```bash
uvicorn app.main:app --reload
```

Backend will start at http://localhost:8000
- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GITHUB_CLIENT_ID=<same client ID from backend .env>
```

**Note**: Use the same `GITHUB_CLIENT_ID` that you put in the backend `.env` file.

### 3. Run Frontend

```bash
npm run dev
```

Frontend will start at http://localhost:3000

## Testing the Complete Flow

1. Open http://localhost:3000
2. Click "Try the Playground →"
3. Select your mode (Developer recommended for testing)
4. Click "Continue with GitHub"
5. Authorize the app on GitHub
6. You should be redirected to the Playground with your user info

## Phase 0 Features Implemented

### Backend
✅ Pre-warmed session pool (5 warm sessions ready)
✅ GitHub OAuth integration
✅ JWT token generation and validation
✅ Rate limiter (PostgreSQL-based)
✅ Analytics tracking foundation
✅ Database models and migrations
✅ Health check endpoints

### Frontend
✅ Mode selection UI (4 modes)
✅ GitHub OAuth flow
✅ Auth callback handler
✅ Playground page with user info
✅ Token storage and management

## API Endpoints

### Public
- `GET /` - API info
- `GET /health` - Health check with session pool status
- `POST /api/auth/github/callback` - GitHub OAuth callback

### Authenticated
- `GET /api/auth/me` - Get current user info
- `GET /api/pool/status` - Session pool statistics

## Development Commands

### Backend
```bash
# Run with auto-reload
uvicorn app.main:app --reload

# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Frontend
```bash
# Development mode
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `docker ps`
- Check .env file has correct values
- Check virtual environment is activated

### Frontend won't start
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check .env.local exists with correct values

### GitHub OAuth fails
- Verify you're using the correct shared OAuth credentials
- Check Client ID in both backend and frontend .env files match
- Check Client Secret in backend .env file (never in frontend!)
- Ensure OAuth app callback URL includes `http://localhost:3000/auth/callback`

### Database errors
- Ensure PostgreSQL container is running
- Run migrations: `alembic upgrade head`
- Check DATABASE_URL in backend .env

## Next Steps

Phase 0 is complete! Next up:

- **Phase 1 Week 3**: Gallery with 5 showcase recipes
- **Phase 1 Week 3**: Execution engine with WebSocket streaming
- **Phase 1 Week 4**: Polish and beta testing

## Architecture Highlights

### Pre-Warmed Session Pool
The session pool maintains 5 warm Amplifier sessions ready for instant execution:
- No Docker cold start overhead
- Sessions recycled after 10 uses or 30 minutes
- Automatic health monitoring and refresh

### Mode-Based Experience
Four user modes with different capabilities:
- **Normie**: Run pre-built recipes only
- **Explorer**: Run + configure recipes
- **Developer**: Run + configure + create recipes/bundles
- **Expert**: Full access including custom skills

### Rate Limiting
PostgreSQL-based rate limiting per user mode:
- Normie: 20 executions/hour
- Explorer: 40 executions/hour
- Developer: 100 executions/hour
- Expert: 200 executions/hour

## Support

For issues or questions, check:
- Backend logs in terminal
- Frontend console in browser DevTools
- API docs at http://localhost:8000/docs
