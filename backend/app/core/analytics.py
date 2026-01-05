"""Analytics tracking with Application Insights"""

import logging
from typing import Dict, Optional
from datetime import datetime

# Try to import Application Insights, but make it optional
try:
    from applicationinsights import TelemetryClient
    HAS_APPINSIGHTS = True
except ImportError:
    HAS_APPINSIGHTS = False

from app.core.config import settings

logger = logging.getLogger(__name__)


class Analytics:
    """Track events for analytics"""

    def __init__(self):
        self.telemetry_client = None
        if HAS_APPINSIGHTS and settings.APPINSIGHTS_INSTRUMENTATIONKEY:
            self.telemetry_client = TelemetryClient(
                settings.APPINSIGHTS_INSTRUMENTATIONKEY
            )
            logger.info("Application Insights telemetry enabled")
        else:
            logger.info("Application Insights telemetry disabled (no key or library)")

    async def track_event(
        self,
        event_name: str,
        properties: Optional[Dict[str, any]] = None,
        user_id: Optional[str] = None,
    ):
        """Track an event

        Args:
            event_name: Name of the event
            properties: Additional properties
            user_id: User identifier
        """
        props = {
            "timestamp": datetime.utcnow().isoformat(),
            "environment": settings.ENVIRONMENT,
            **(properties or {}),
        }

        if user_id:
            props["user_id"] = user_id

        # Log locally
        logger.info(f"Event: {event_name} | Properties: {props}")

        # Send to Application Insights if configured
        if self.telemetry_client:
            try:
                self.telemetry_client.track_event(event_name, properties=props)
                self.telemetry_client.flush()
            except Exception as e:
                logger.error(f"Failed to send telemetry: {e}")

    async def track_execution_started(
        self, execution_id: str, user_id: str, execution_type: str, **kwargs
    ):
        """Track execution start"""
        await self.track_event(
            "execution_started",
            properties={
                "execution_id": execution_id,
                "execution_type": execution_type,
                **kwargs,
            },
            user_id=user_id,
        )

    async def track_execution_completed(
        self, execution_id: str, user_id: str, duration_seconds: float, **kwargs
    ):
        """Track execution completion"""
        await self.track_event(
            "execution_completed",
            properties={
                "execution_id": execution_id,
                "duration_seconds": duration_seconds,
                **kwargs,
            },
            user_id=user_id,
        )

    async def track_execution_failed(
        self, execution_id: str, user_id: str, error: str, **kwargs
    ):
        """Track execution failure"""
        await self.track_event(
            "execution_failed",
            properties={"execution_id": execution_id, "error": error, **kwargs},
            user_id=user_id,
        )

    async def track_page_view(self, page: str, user_id: Optional[str] = None):
        """Track page view"""
        await self.track_event("page_view", properties={"page": page}, user_id=user_id)

    async def track_auth_completed(self, user_id: str, mode: str):
        """Track authentication completion"""
        await self.track_event(
            "github_auth_completed",
            properties={"mode": mode},
            user_id=user_id,
        )


# Global analytics instance
analytics = Analytics()
