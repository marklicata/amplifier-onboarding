# GitHub OAuth Setup (Team/Admin Only)

This setup is done **ONCE** by the team/admin, not by end users.

## Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Amplifier
   - **Homepage URL**: `https://amplifier.dev` (or your production URL)
   - **Authorization callback URL**: `https://amplifier.dev/auth/callback`
   - For development, add: `http://localhost:3000/auth/callback`
4. Click "Register application"
5. Copy the **Client ID** (this is public)
6. Generate a **Client Secret** (keep this secure!)

## Configure Application

### Production (Azure)

Add to Azure Key Vault:
- `GITHUB_CLIENT_ID` (can also be in .env)
- `GITHUB_CLIENT_SECRET` (must be in Key Vault)

### Development

**Option 1: Shared Team Credentials** (Recommended)
- Share the dev OAuth app credentials securely with the team
- Each developer adds them to their local `.env` files

**Option 2: Personal Dev OAuth Apps**
- Each developer creates their own OAuth app for local testing
- Use `http://localhost:3000/auth/callback` as callback URL

### Environment Files

**Backend `.env`:**
```env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_client_id_here
# Note: Client ID is public, no secret needed in frontend
```

## End User Experience

End users simply:
1. Visit https://amplifier.dev
2. Click "Try the Playground"
3. Select their mode
4. Click "Continue with GitHub"
5. Authorize the Amplifier app (one-time)
6. Start using Amplifier!

**No OAuth app creation needed by users!**

## Multiple Environments

### Production
- OAuth App: "Amplifier"
- Callback: `https://amplifier.dev/auth/callback`

### Staging
- OAuth App: "Amplifier Staging"
- Callback: `https://staging.amplifier.dev/auth/callback`

### Development (Shared)
- OAuth App: "Amplifier Development"
- Callback: `http://localhost:3000/auth/callback`
- Credentials shared among dev team

## Security Notes

- ✅ Client ID is public (embedded in frontend)
- 🔒 Client Secret must be kept secure (backend only)
- 🔒 Never commit `.env` files to git
- 🔒 Use Azure Key Vault for production secrets
- ✅ JWT_SECRET should be a strong random string (generate once, reuse)
