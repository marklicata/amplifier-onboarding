"""Pre-warmed Amplifier session pool"""

import asyncio
from datetime import datetime, timedelta
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)


class MockAmplifierSession:
    """Mock Amplifier session for Phase 0 (will be replaced with real Amplifier in Phase 1)"""

    def __init__(self, session_id: str):
        self.session_id = session_id
        self.created_at = datetime.utcnow()
        self.executions = 0

    async def execute(self, prompt: str, agent: Optional[str] = None) -> str:
        """Execute a prompt (mock implementation)"""
        self.executions += 1
        await asyncio.sleep(0.1)  # Simulate execution
        return f"Mock execution result for: {prompt[:50]}..."

    async def close(self):
        """Close session"""
        logger.info(f"Closing session {self.session_id}")


class SessionPool:
    """Maintain pool of warm Amplifier sessions for instant execution"""

    def __init__(self, pool_size: int = 5, max_executions: int = 10, max_age_minutes: int = 30):
        self.pool_size = pool_size
        self.max_executions = max_executions
        self.max_age_minutes = max_age_minutes
        self.available: asyncio.Queue = asyncio.Queue(maxsize=pool_size)
        self.in_use: Dict[str, dict] = {}
        self._maintenance_task: Optional[asyncio.Task] = None
        self._is_running = False

    async def start(self):
        """Pre-warm sessions on startup"""
        if self._is_running:
            logger.warning("Session pool already running")
            return

        logger.info(f"Starting session pool with {self.pool_size} sessions")
        self._is_running = True

        # Pre-warm sessions
        for i in range(self.pool_size):
            session_data = await self._create_session()
            await self.available.put(session_data)
            logger.info(f"Pre-warmed session {i + 1}/{self.pool_size}")

        # Start maintenance task
        self._maintenance_task = asyncio.create_task(self._maintain_pool())
        logger.info("Session pool started successfully")

    async def stop(self):
        """Stop the pool and close all sessions"""
        if not self._is_running:
            return

        logger.info("Stopping session pool...")
        self._is_running = False

        # Cancel maintenance task
        if self._maintenance_task:
            self._maintenance_task.cancel()
            try:
                await self._maintenance_task
            except asyncio.CancelledError:
                pass

        # Close all available sessions
        while not self.available.empty():
            session_data = await self.available.get()
            await session_data["session"].close()

        # Close all in-use sessions
        for session_data in self.in_use.values():
            await session_data["session"].close()

        self.in_use.clear()
        logger.info("Session pool stopped")

    async def _create_session(self) -> dict:
        """Create and prepare an Amplifier session"""
        session_id = f"session_{datetime.utcnow().timestamp()}"

        # TODO Phase 1: Replace with real Amplifier session
        # from amplifier_foundation import Bundle
        # bundle = await Bundle.from_yaml("foundation")
        # prepared = await bundle.prepare()
        # session = await prepared.create_session()

        session = MockAmplifierSession(session_id)

        return {
            "session": session,
            "session_id": session_id,
            "created_at": datetime.utcnow(),
            "executions": 0,
        }

    async def acquire(self, timeout: float = 30.0) -> tuple[MockAmplifierSession, str]:
        """Get a session from pool"""
        if not self._is_running:
            raise RuntimeError("Session pool is not running")

        try:
            session_data = await asyncio.wait_for(
                self.available.get(), timeout=timeout
            )
            session_id = session_data["session_id"]
            self.in_use[session_id] = session_data

            logger.debug(f"Acquired session {session_id}")
            return session_data["session"], session_id

        except asyncio.TimeoutError:
            logger.error("No sessions available (timeout)")
            raise Exception("No sessions available - all sessions are in use")

    async def release(self, session_id: str):
        """Return session to pool"""
        if session_id not in self.in_use:
            logger.warning(f"Attempted to release unknown session {session_id}")
            return

        session_data = self.in_use.pop(session_id)
        session_data["executions"] += 1

        # Check if session should be recreated
        should_recreate = (
            session_data["executions"] >= self.max_executions
            or (datetime.utcnow() - session_data["created_at"])
            > timedelta(minutes=self.max_age_minutes)
        )

        if should_recreate:
            logger.info(
                f"Recreating session {session_id} "
                f"(executions: {session_data['executions']}, "
                f"age: {(datetime.utcnow() - session_data['created_at']).seconds}s)"
            )
            await session_data["session"].close()
            session_data = await self._create_session()

        await self.available.put(session_data)
        logger.debug(f"Released session {session_id}")

    async def _maintain_pool(self):
        """Background task to keep pool healthy"""
        logger.info("Session pool maintenance task started")

        while self._is_running:
            try:
                await asyncio.sleep(60)  # Check every minute

                # Refresh old sessions in available pool
                current_available = []
                while not self.available.empty():
                    try:
                        session_data = self.available.get_nowait()
                        current_available.append(session_data)
                    except asyncio.QueueEmpty:
                        break

                # Check each session
                for session_data in current_available:
                    age = datetime.utcnow() - session_data["created_at"]

                    if age > timedelta(minutes=self.max_age_minutes):
                        logger.info(
                            f"Refreshing old session {session_data['session_id']} "
                            f"(age: {age.seconds}s)"
                        )
                        await session_data["session"].close()
                        session_data = await self._create_session()

                    await self.available.put(session_data)

                logger.debug(
                    f"Pool status: {self.available.qsize()} available, "
                    f"{len(self.in_use)} in use"
                )

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in pool maintenance: {e}")

        logger.info("Session pool maintenance task stopped")

    def get_stats(self) -> dict:
        """Get pool statistics"""
        return {
            "pool_size": self.pool_size,
            "available": self.available.qsize(),
            "in_use": len(self.in_use),
            "is_running": self._is_running,
        }


# Global pool instance
session_pool = SessionPool(
    pool_size=5, max_executions=10, max_age_minutes=30
)
