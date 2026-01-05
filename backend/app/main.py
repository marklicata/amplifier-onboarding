"""Main FastAPI application"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.config import settings
from app.core.session_pool import session_pool
from app.core.database import init_db, close_db
from app.api import auth, pool

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Amplifier API",
    description="Backend API for Amplifier web experience",
    version="0.1.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(pool.router, prefix="/api/pool", tags=["pool"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Amplifier API",
        "version": "0.1.0",
        "status": "Phase 0: Foundation",
        "phase": "0",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    pool_stats = session_pool.get_stats()

    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "session_pool": {
            "available": pool_stats["available"],
            "in_use": pool_stats["in_use"],
            "is_running": pool_stats["is_running"],
        },
    }


# Lifecycle events
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("Starting Amplifier API...")

    try:
        # Initialize database
        await init_db()
        logger.info("Database initialized")

        # Start session pool
        await session_pool.start()
        logger.info("Session pool started")

        logger.info("Amplifier API started successfully")
    except Exception as e:
        logger.error(f"Failed to start Amplifier API: {e}")
        raise


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down Amplifier API...")

    try:
        # Stop session pool
        await session_pool.stop()
        logger.info("Session pool stopped")

        # Close database connections
        await close_db()
        logger.info("Database connections closed")

        logger.info("Amplifier API stopped successfully")
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")
