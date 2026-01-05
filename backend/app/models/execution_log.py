"""Execution log model for rate limiting"""

from sqlalchemy import Column, String, Index
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.models.base import Base, TimestampMixin


class ExecutionLog(Base, TimestampMixin):
    """Track execution for rate limiting"""

    __tablename__ = "execution_log"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False, index=True)
    execution_type = Column(String(50))  # 'prompt' or 'recipe'

    __table_args__ = (
        Index('idx_execution_user_created', 'user_id', 'created_at'),
    )

    def __repr__(self):
        return f"<ExecutionLog(id={self.id}, user_id={self.user_id}, type={self.execution_type})>"
