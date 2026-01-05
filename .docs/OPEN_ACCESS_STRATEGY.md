# Open Access Strategy

## Goal
Make Amplifier onboarding available to **anyone on the web** while preventing abuse.

---

## Three-Tier Access Model

### Tier 1: Anonymous Browsing (No Auth)
**Anyone can:**
- ✅ View the home page
- ✅ Read documentation
- ✅ Browse the gallery (recipes, bundles, skills)
- ✅ View recipe details and YAML
- ✅ Read tutorials and learning content
- ✅ See execution examples (videos/screenshots)
- ✅ Copy YAML to clipboard
- ✅ Download recipes for local use

**Cannot:**
- ❌ Execute recipes in the playground
- ❌ Create custom recipes
- ❌ Save any data

**Implementation:**
- No authentication required
- All content served statically
- No backend calls needed
- Perfect for SEO and discovery

---

### Tier 2: Guest Executions (IP-Based Rate Limit)
**Optional enhancement for Phase 1+**

Allow limited anonymous executions before requiring GitHub:
- **3-5 free executions** per IP address per day
- Simple, non-sensitive recipes only
- Results shown but not saved
- After limit: "Sign in with GitHub for more"

**Benefits:**
- Try before you authenticate
- Reduces friction for first-time users
- Still prevents abuse (IP-based limits)

**Implementation:**
```python
# Rate limit by IP for anonymous users
async def check_anonymous_limit(ip_address: str) -> tuple[bool, int]:
    # Allow 5 executions per IP per day
    count = await get_execution_count(ip=ip_address, since=today())
    return count < 5, 5 - count
```

**Trade-offs:**
- ⚠️ VPN/proxy abuse possible
- ⚠️ Shared IPs (corporate, NAT) affect multiple users
- ⚠️ More complex rate limiting logic
- ✅ Lower barrier to entry
- ✅ Better conversion funnel

---

### Tier 3: Authenticated Users (GitHub OAuth)
**Current implementation**

Required for:
- ✅ Unlimited executions (within rate limits)
- ✅ Creating custom recipes (Developer+)
- ✅ Creating custom bundles (Developer+)
- ✅ Creating custom skills (Expert)
- ✅ Sharing creations

**Rate Limits (per hour):**
- Normie: 20 executions
- Explorer: 40 executions
- Developer: 100 executions
- Expert: 200 executions

**Why GitHub OAuth:**
- Developer-friendly (target audience)
- Sybil-resistant (hard to fake accounts)
- No password management
- Established identity
- Zero data stored by us

---

## Abuse Prevention Strategies

### 1. Rate Limiting (Current)
- Per GitHub user ID
- Time-windowed (per hour)
- Mode-based limits
- PostgreSQL-backed

### 2. Cost Control
- Execution timeout (10 minutes max)
- Resource limits (CPU, memory)
- Queue depth limits
- Concurrent execution limits

### 3. Content Moderation
- Flag suspicious prompts (Phase 2+)
- Rate of failed executions
- Unusual patterns (Phase 2+)

### 4. IP-Based Backup
- Additional IP rate limiting for defense-in-depth
- Catches VPN abuse
- Protects infrastructure

**Implementation:**
```python
# Dual rate limiting
async def check_execution_allowed(user_id: str, ip_address: str):
    # Check user-based limit
    user_allowed, user_remaining = await check_user_limit(user_id)

    # Check IP-based limit (backup)
    ip_allowed, ip_remaining = await check_ip_limit(ip_address)

    return user_allowed and ip_allowed, min(user_remaining, ip_remaining)
```

### 5. GitHub Account Requirements (Future)
- Account age > 30 days
- Public repos > 0
- Verified email
- 2FA enabled (optional bonus)

---

## Recommended Implementation Phases

### Phase 0 (Current) ✅
- Public site, anyone can browse
- GitHub OAuth required for execution
- Rate limiting per GitHub user
- No anonymous executions

**Pros:**
- Simple, proven pattern
- Prevents abuse effectively
- Zero friction after first auth

**Cons:**
- Can't try before authenticating
- Requires GitHub account

---

### Phase 1 Enhancement (Optional)
Add anonymous trial executions:
- 5 free executions per IP per day
- Simple recipes only
- "Sign in for more" after limit
- All other features require auth

**Implementation effort:** 1-2 days
**Value:** Reduces friction, better conversion

---

### Phase 2+ Enhancements
- **Multiple auth providers** (Google, Microsoft)
- **Email/password** (if GitHub isn't enough)
- **Anonymous sharing** (share execution results publicly)
- **Embed mode** (embed playground in docs)

---

## Privacy & Data Minimization

### What We Store
- GitHub user ID (hashed)
- Execution timestamps (for rate limiting)
- Aggregated analytics (anonymous)

### What We DON'T Store
- GitHub access tokens (used once, discarded)
- User profiles
- Email addresses
- Created recipes (user exports locally)
- Execution results
- Prompt content

### Compliance
- ✅ GDPR compliant (minimal data, user controls)
- ✅ No cookies (except auth token)
- ✅ No tracking across sites
- ✅ User can delete data anytime (just revoke GitHub OAuth)

---

## User Communication

### On Home Page
```
🌍 Free and open to everyone
🔐 Sign in with GitHub to start
⚡ No signup, no passwords, no data stored
```

### In Mode Selector
```
"Continue with GitHub"

Why GitHub?
- Prevents abuse while keeping it free
- No signup or password needed
- We don't store your data
- Revoke access anytime in GitHub settings
```

### In FAQ
**Q: Do I need to create an account?**
A: No! Just sign in with GitHub. We use it to identify you for rate limiting, but don't store any of your data.

**Q: Why do you need GitHub OAuth?**
A: To prevent abuse while keeping Amplifier free for everyone. We rate-limit per user to ensure fair access.

**Q: What data do you collect?**
A: Just your GitHub user ID and execution timestamps for rate limiting. No profiles, no history, no personal data.

**Q: Can I use it without GitHub?**
A: Currently, GitHub is required to execute recipes. You can browse everything without authenticating.

---

## Metrics to Track

### Funnel Analysis
1. Site visitors
2. Mode selector shown
3. "Continue with GitHub" clicked
4. GitHub authorization completed
5. First execution
6. Return visitors

### Abuse Monitoring
- Rate limit hits per user
- Failed authentication attempts
- Unusual execution patterns
- Error rates by user
- IP-based patterns

### Success Metrics
- Time to first execution
- Execution success rate
- User retention (return rate)
- Mode distribution
- Average executions per user

---

## Alternative: Fully Anonymous (Not Recommended)

**Could we skip auth entirely?**

Yes, but:
- ❌ Easy to abuse (VPN hopping, infinite IPs)
- ❌ High infrastructure cost (uncontrolled usage)
- ❌ Difficult to debug issues
- ❌ No way to help users
- ❌ Can't implement advanced features

**Why GitHub OAuth is better:**
- ✅ Fair rate limiting
- ✅ Cost control
- ✅ User context for support
- ✅ Foundation for features
- ✅ Industry standard

---

## Recommendations

### For Phase 0 (Current)
Keep current approach:
- Public browsing, no auth
- GitHub OAuth for execution
- Simple, proven, effective

### For Phase 1
Consider adding:
- Anonymous trial (5 executions per IP)
- Better onboarding flow
- Clear abuse prevention messaging

### For Phase 2+
Expand as needed:
- Multiple auth providers
- GitHub account requirements
- Advanced abuse detection
- Premium tiers for higher limits

---

## Bottom Line

**Current approach is PERFECT for open-source, public-facing tool:**
- ✅ Completely open (anyone can visit)
- ✅ Low friction (one-click GitHub auth)
- ✅ Abuse-resistant (rate limiting)
- ✅ Privacy-friendly (no data stored)
- ✅ Cost-controlled (fair limits)
- ✅ Standard pattern (everyone does this)

The GitHub OAuth requirement is not a barrier - it's a **best practice** for public developer tools.
