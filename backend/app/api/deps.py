"""API dependencies"""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.auth import decode_access_token

security = HTTPBearer()


class CurrentUser:
    """Current authenticated user"""

    def __init__(self, user_id: str, username: str, mode: str, name: str):
        self.id = user_id
        self.username = username
        self.mode = mode
        self.name = name


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> CurrentUser:
    """Get current authenticated user from JWT token"""
    try:
        token = credentials.credentials
        payload = decode_access_token(token)

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )

        return CurrentUser(
            user_id=user_id,
            username=payload.get("username", ""),
            mode=payload.get("mode", "normie"),
            name=payload.get("name", ""),
        )

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
) -> Optional[CurrentUser]:
    """Get current user if authenticated, otherwise None"""
    if not credentials:
        return None

    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None
