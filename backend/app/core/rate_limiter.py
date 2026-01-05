"""Rate limiting based on PostgreSQL execution log"""

from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.execution_log import ExecutionLog


class RateLimiter:
    """PostgreSQL-based rate limiting"""

    # Rate limits by mode (executions per hour)
    LIMITS = {
        "normie": 20,
        "explorer": 40,
        "developer": 100,
        "expert": 200,
    }

    @classmethod
    async def check_limit(
        cls, db: AsyncSession, user_id: str, mode: str
    ) -> tuple[bool, int]:
        """Check if user is within rate limit

        Returns:
            tuple: (allowed: bool, remaining: int)
        """
        limit = cls.LIMITS.get(mode, 20)
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)

        # Count recent executions
        stmt = select(func.count()).select_from(ExecutionLog).where(
            ExecutionLog.user_id == user_id,
            ExecutionLog.created_at > one_hour_ago,
        )
        result = await db.execute(stmt)
        count = result.scalar() or 0

        remaining = max(0, limit - count)
        allowed = count < limit

        return allowed, remaining

    @classmethod
    async def log_execution(
        cls, db: AsyncSession, user_id: str, execution_type: str = "prompt"
    ):
        """Log an execution for rate limiting"""
        log_entry = ExecutionLog(user_id=user_id, execution_type=execution_type)
        db.add(log_entry)
        await db.commit()

    @classmethod
    def get_limit_for_mode(cls, mode: str) -> int:
        """Get rate limit for a mode"""
        return cls.LIMITS.get(mode, 20)
