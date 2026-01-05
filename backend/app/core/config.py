"""Application configuration"""

from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings"""

    # Application
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    DEBUG: bool = Field(default=True, env="DEBUG")

    # CORS
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://127.0.0.1:3000"],
        env="CORS_ORIGINS"
    )

    # Database
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/amplifier",
        env="DATABASE_URL"
    )

    # GitHub OAuth
    GITHUB_CLIENT_ID: str = Field(default="", env="GITHUB_CLIENT_ID")
    GITHUB_CLIENT_SECRET: str = Field(default="", env="GITHUB_CLIENT_SECRET")
    GITHUB_CALLBACK_URL: str = Field(
        default="http://localhost:3000/auth/callback",
        env="GITHUB_CALLBACK_URL"
    )

    # JWT
    JWT_SECRET: str = Field(
        default="your-secret-key-change-in-production",
        env="JWT_SECRET"
    )
    JWT_ALGORITHM: str = Field(default="HS256", env="JWT_ALGORITHM")
    JWT_EXPIRATION_MINUTES: int = Field(default=1440, env="JWT_EXPIRATION_MINUTES")

    # Azure
    APPINSIGHTS_INSTRUMENTATIONKEY: str = Field(default="", env="APPINSIGHTS_INSTRUMENTATIONKEY")

    # Anthropic
    ANTHROPIC_API_KEY: str = Field(default="", env="ANTHROPIC_API_KEY")

    # Session Pool
    SESSION_POOL_SIZE: int = Field(default=5, env="SESSION_POOL_SIZE")
    SESSION_MAX_EXECUTIONS: int = Field(default=10, env="SESSION_MAX_EXECUTIONS")
    SESSION_MAX_AGE_MINUTES: int = Field(default=30, env="SESSION_MAX_AGE_MINUTES")

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
