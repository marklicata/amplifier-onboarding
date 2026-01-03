"""
FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.core.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Amplifier Onboarding API",
    description="Backend API for Amplifier web experience",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check():
    """
    Health check endpoint for monitoring and load balancers.
    Returns basic app status.
    """
    return JSONResponse(
        status_code=200,
        content={
            "status": "healthy",
            "version": "0.1.0",
            "service": "amplifier-onboarding-api"
        }
    )

# Root endpoint
@app.get("/", tags=["root"])
async def root():
    """
    API root endpoint with basic information.
    """
    return {
        "message": "Amplifier Onboarding API",
        "version": "0.1.0",
        "docs": "/api/docs",
        "health": "/health"
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("Starting Amplifier Onboarding API v0.1.0")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"CORS origins: {settings.ALLOWED_ORIGINS}")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Amplifier Onboarding API")

# Future route imports (Phase 1)
# from app.api.routes import recipes, execution, auth
# app.include_router(recipes.router, prefix="/api", tags=["recipes"])
