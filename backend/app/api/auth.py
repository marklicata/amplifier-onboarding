"""Authentication routes"""

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel

from app.core.auth import exchange_code_for_token, get_github_user, create_user_token
from app.core.analytics import analytics
from app.api.deps import get_current_user

router = APIRouter()


class GitHubCallbackRequest(BaseModel):
    """GitHub OAuth callback request"""
    code: str
    mode: str = "developer"  # User-selected mode


class AuthResponse(BaseModel):
    """Authentication response"""
    token: str
    user: dict


@router.post("/github/callback", response_model=AuthResponse)
async def github_callback(request: GitHubCallbackRequest):
    """Handle GitHub OAuth callback

    1. Exchange code for GitHub access token
    2. Get GitHub user information
    3. Create JWT token with user info and mode
    4. Track authentication event
    """
    try:
        # Exchange code for access token
        access_token = await exchange_code_for_token(request.code)

        # Get GitHub user
        github_user = await get_github_user(access_token)

        # Create JWT token with selected mode
        jwt_token = create_user_token(github_user, mode=request.mode)

        # Track authentication
        await analytics.track_auth_completed(
            user_id=str(github_user.id), mode=request.mode
        )

        return AuthResponse(
            token=jwt_token,
            user={
                "id": github_user.id,
                "username": github_user.login,
                "name": github_user.name,
                "email": github_user.email,
                "avatar_url": github_user.avatar_url,
                "mode": request.mode,
            },
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Authentication failed: {str(e)}",
        )


@router.get("/me")
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Get current user information"""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "name": current_user.name,
        "mode": current_user.mode,
    }
