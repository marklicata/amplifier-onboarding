"""Authentication with GitHub OAuth and JWT"""

import httpx
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt

from app.core.config import settings


class GitHubUser:
    """GitHub user model"""

    def __init__(self, id: int, login: str, name: str, email: Optional[str], avatar_url: str):
        self.id = id
        self.login = login
        self.name = name
        self.email = email
        self.avatar_url = avatar_url


async def exchange_code_for_token(code: str) -> str:
    """Exchange GitHub OAuth code for access token"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            json={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
            },
            headers={"Accept": "application/json"},
        )
        response.raise_for_status()
        data = response.json()
        return data["access_token"]


async def get_github_user(access_token: str) -> GitHubUser:
    """Get GitHub user information"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json",
            },
        )
        response.raise_for_status()
        data = response.json()

        return GitHubUser(
            id=data["id"],
            login=data["login"],
            name=data.get("name", data["login"]),
            email=data.get("email"),
            avatar_url=data["avatar_url"],
        )


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    """Decode JWT access token"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise ValueError("Invalid token")


def create_user_token(github_user: GitHubUser, mode: str = "developer") -> str:
    """Create JWT token for user with mode"""
    return create_access_token(
        {
            "sub": str(github_user.id),
            "github_id": github_user.id,
            "username": github_user.login,
            "name": github_user.name,
            "mode": mode,
        }
    )
