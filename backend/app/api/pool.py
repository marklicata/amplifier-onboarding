"""Session pool status routes"""

from fastapi import APIRouter

from app.core.session_pool import session_pool

router = APIRouter()


@router.get("/status")
async def get_pool_status():
    """Get session pool status"""
    stats = session_pool.get_stats()
    return {
        "pool_size": stats["pool_size"],
        "available": stats["available"],
        "in_use": stats["in_use"],
        "utilization": round((stats["in_use"] / stats["pool_size"]) * 100, 2)
        if stats["pool_size"] > 0
        else 0,
        "is_healthy": stats["is_running"] and stats["available"] > 0,
    }
