"""
Application Configuration
Loads settings from environment variables with sensible defaults.
"""

import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    
    # App Settings
    APP_NAME: str = "Amplifier Onboarding API"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # CORS Settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://amplifier-onboarding.azurestaticapps.net",
        # Add your custom domain when configured
    ]
    
    # Future settings (Phase 1+)
    # DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    # REDIS_URL: str = os.getenv("REDIS_URL", "")
    # GITHUB_CLIENT_ID: str = os.getenv("GITHUB_CLIENT_ID", "")
    # GITHUB_CLIENT_SECRET: str = os.getenv("GITHUB_CLIENT_SECRET", "")
    # JWT_SECRET: str = os.getenv("JWT_SECRET", "")
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
