# End User Flow

This is what **end users** experience when using Amplifier - no setup required!

## User Journey

### 1. Discover Amplifier
User visits **https://amplifier.dev**

Sees:
- Hero: "Program Intelligence, Not Just Code"
- Value proposition
- Big CTA: "Try the Playground →"

### 2. Select Mode
User clicks "Try the Playground" and sees mode selector:

**"What brings you to Amplifier?"**

- 🎯 **Get things done** (Normie Mode) - Use AI for specific tasks
- 🔍 **Explore and analyze** (Explorer Mode) - Investigate systems
- 💻 **Build and develop** (Developer Mode) - AI-powered development
- 🚀 **Customize and extend** (Expert Mode) - Full platform access

User selects their mode and clicks **"Continue with GitHub"**

### 3. Authenticate with GitHub
User is redirected to GitHub OAuth:

```
https://github.com/login/oauth/authorize?client_id=...
```

GitHub shows: **"Amplifier wants to access your account"**

Permissions requested:
- Read your user profile
- Read your email address

User clicks **"Authorize Amplifier"** (one-time)

### 4. Welcome to Playground
User is redirected back to Amplifier:

```
https://amplifier.dev/auth/callback?code=...
```

Backend:
- Exchanges code for GitHub token
- Fetches user profile
- Creates JWT with user info + selected mode
- Returns token to frontend

Frontend:
- Stores token in localStorage
- Redirects to `/playground`

User sees:
- Header with their name, avatar, and mode badge
- Welcome message
- Phase-appropriate features based on mode

### 5. Using Amplifier

**Normie Mode Users See:**
- Gallery of pre-built recipes
- "Run" button on each recipe
- Simple configuration forms
- Execution results

**Explorer Mode Users See:**
- Everything Normie sees +
- Advanced configuration options
- Detailed logs and analysis
- Filter and search capabilities

**Developer Mode Users See:**
- Everything Explorer sees +
- "Create Recipe" button
- Visual recipe builder
- YAML editor
- Export/download functionality

**Expert Mode Users See:**
- Everything Developer sees +
- "Create Skill" option
- Bundle composer
- Advanced orchestration tools
- Package and publish features

### 6. Rate Limiting

Each mode has different rate limits (per hour):
- Normie: 20 executions
- Explorer: 40 executions
- Developer: 100 executions
- Expert: 200 executions

When limit reached:
- User sees: "Rate limit reached. Try again in X minutes."
- Remaining quota shown in UI

### 7. Session Management

**Tokens:**
- JWT valid for 24 hours
- Stored in localStorage
- Auto-refresh on page load

**Logout:**
- User clicks "Logout"
- Token removed from localStorage
- Redirected to home page

**Next Visit:**
- If token still valid → Auto-redirect to playground
- If token expired → Show mode selector again

## Key Points

✅ **No account creation** - Just GitHub authentication
✅ **No password** - Uses GitHub OAuth
✅ **No email verification** - GitHub handles that
✅ **No OAuth setup** - ONE app for everyone
✅ **No installation** - Everything runs in browser
✅ **No payment** - Free to use (rate limited by mode)

❌ **No data persistence** - Users export their work
❌ **No saved sessions** - Ephemeral execution only
❌ **No team workspaces** - Individual use (for now)

## Privacy & Security

**What we store:**
- Execution timestamps (for rate limiting)
- GitHub user ID (for rate limiting)
- Nothing else!

**What we don't store:**
- User profiles
- User sessions
- Created recipes/bundles
- Execution history
- Personal information

**Data flow:**
1. User → GitHub OAuth → Access token
2. Backend → GitHub API → User profile (temporary)
3. Backend → JWT → Signed token
4. Frontend → localStorage → Token storage
5. User exports → Downloads → Local storage

All user-created content stays client-side or gets downloaded. Zero persistence in our backend (except rate limit counters).

## Analytics (Anonymous)

We track:
- Page views
- Button clicks
- Execution starts/completions/failures
- Mode distribution
- Error rates

We **don't** track:
- Personal information
- Prompt content
- Generated code
- File contents
- GitHub activity

All events use GitHub user ID as identifier (no names, emails, etc.).

## Support

If users have issues:
- Check GitHub settings → Applications → Amplifier
- Revoke and re-authorize if needed
- Contact support (link in footer)
- Check status page for outages

## Future Enhancements (Post-Launch)

- **Mode upgrades**: "You're using Explorer features - upgrade to Developer?"
- **Usage insights**: "You've run 50 recipes this month!"
- **Social features**: Share recipes with URL
- **Team features**: Shared rate limits for organizations
- **Premium modes**: Higher rate limits for paid tiers
