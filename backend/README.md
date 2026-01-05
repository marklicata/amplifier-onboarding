# Amplifier Backend API

FastAPI backend for the Amplifier web experience.

## Development Setup

### Prerequisites
- Python 3.11+
- PostgreSQL 14+

### Installation

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run development server:
```bash
uvicorn app.main:app --reload --port 8000
```

API will be available at http://localhost:8000

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── api/            # API routes
│   ├── core/           # Core configuration
│   ├── schemas/        # Pydantic models
│   ├── services/       # Business logic
│   └── main.py         # FastAPI app
├── tests/              # Tests
├── Dockerfile          # Container image
└── requirements.txt    # Dependencies
```

## Phase 0 Tasks

Week 2 Backend Tasks:
- [ ] Pre-warmed session pool implementation
- [ ] GitHub OAuth integration
- [ ] JWT token generation/validation
- [ ] Rate limiter (PostgreSQL-based)
- [ ] Analytics tracking foundation
- [ ] Basic `/health` endpoint
