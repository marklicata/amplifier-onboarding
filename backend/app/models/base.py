"""Base model class"""

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, DateTime
from sqlalchemy.sql import func

Base = declarative_base()


class TimestampMixin:
    """Mixin for created_at timestamp"""
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
