# Azure Static Web Apps Deployment - Simple & Right-Sized

**Goal**: Deploy Amplifier web experience to Azure with minimal complexity and maximum capability

**Philosophy**: Use the right tool for the job - Static Web Apps is purpose-built for this exact use case

---

## Why Azure Static Web Apps?

**Perfect fit for your application:**
- ✅ Static frontend with planned backend integration
- ✅ Free tier during development ($0/month)
- ✅ Auto-deploy from GitHub (zero config)
- ✅ Custom domain + free SSL included
- ✅ Built-in global CDN
- ✅ PR preview environments automatically
- ✅ Easy to link Container Apps backend later
- ✅ Integrated authentication (GitHub OAuth ready)

**Cost**: $0 (Free tier) → $9/month (Standard tier when needed)

---

## Deployment Path

### Phase 0 (Current): Static Site Only
**Azure Static Web Apps Free Tier**
- HTML, CSS, JavaScript served globally
- Auto-build and deploy from GitHub
- Free SSL certificate
- Custom domain support

### Phase 1+: Add Backend API
**Static Web Apps + Azure Container Apps**
- Frontend: Static Web Apps (same)
- Backend: Container Apps linked as managed backend
- Database: PostgreSQL (Azure or Supabase)
- Redis: Upstash free tier

### Phase 2+: Scale (If Needed)
**Evaluate based on traffic:**
- Stay on Static Web Apps (handles most apps fine)
- OR migrate to Front Door only if you need advanced features

---

## Part 1: Initial Deployment (10 minutes)

### Increment 1: Create Static Web App (5 minutes)

**Prerequisites**:
- Azure account with active subscription
- Azure CLI installed: `az --version`
- Logged in: `az login`
- GitHub personal access token (for repository connection)

**Steps**:

```bash
# Set variables (customize these)
SUBSCRIPTION_ID="<your-subscription-id>"
RESOURCE_GROUP="amplifier-rg"
LOCATION="eastus2"  # or westus2, centralus, etc.
APP_NAME="amplifier-onboarding"  # Must be globally unique
GITHUB_REPO_URL="https://github.com/yourusername/amplifier-onboarding"
GITHUB_TOKEN="<your-github-pat>"  # Create at github.com/settings/tokens

# 1. Set subscription
az account set --subscription "$SUBSCRIPTION_ID"

# 2. Create resource group
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION"

# 3. Create Static Web App (this does everything!)
az staticwebapp create \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --source "$GITHUB_REPO_URL" \
  --branch "main" \
  --app-location "/" \
  --output-location "/" \
  --token "$GITHUB_TOKEN"

# 4. Get the auto-generated URL
az staticwebapp show \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "defaultHostname" \
  --output tsv

# This outputs: <app-name>.azurestaticapps.net
```

**What just happened:**
1. ✅ Static Web App created
2. ✅ GitHub Actions workflow auto-created in your repo
3. ✅ First deployment triggered automatically
4. ✅ Free SSL certificate provisioned
5. ✅ Global CDN enabled

**Verification**:
- Check your GitHub repo → `.github/workflows/` for new workflow file
- Workflow runs and completes successfully
- Visit `https://<app-name>.azurestaticapps.net`
- Site loads correctly

**Commit**: Not needed - Azure created the workflow for you!

---

### Increment 2: Configure Build Settings (5 minutes)

**Current state**: Basic deployment  
**Target**: Optimized build process

The auto-generated workflow looks like this:

**.github/workflows/azure-static-web-apps-<random>.yml** (auto-created)

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/" # Root directory
          output_location: "/" # No build step initially
```

**If you add a build step later** (when you use npm/vite/etc):
```yaml
app_location: "/"
api_location: ""  # Leave empty for now
output_location: "dist"  # After running build
```

**Verification**:
- Workflow file exists in repo
- Commits to main trigger deployment
- PR opens trigger preview deployment

**Commit**: "Configure Static Web Apps build settings" (if you modify workflow)

---

## Part 2: Custom Domain & HTTPS (15 minutes - OPTIONAL)

### Increment 3: Add Custom Domain (15 minutes)

**Current state**: Using `*.azurestaticapps.net`  
**Target**: Custom domain with free SSL

**Steps**:

```bash
# 1. Add custom domain to Static Web App
az staticwebapp hostname set \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --hostname "amplifier.dev"

# 2. Azure will give you validation instructions
# You'll need to add DNS records:

# Option A: CNAME (recommended for subdomains)
#   Name: www
#   Type: CNAME
#   Value: <app-name>.azurestaticapps.net

# Option B: ALIAS/ANAME (for apex domain like amplifier.dev)
#   Name: @
#   Type: ALIAS
#   Value: <app-name>.azurestaticapps.net

# Option C: TXT record for validation (if CNAME not possible)
#   Name: _dnsauth
#   Type: TXT
#   Value: <provided-by-azure>

# 3. Verify domain
az staticwebapp hostname show \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --hostname "amplifier.dev"

# SSL certificate is automatically provisioned once DNS validates
```

**Verification**:
- DNS resolves to Static Web App
- HTTPS works on custom domain
- Certificate is valid

**Commit**: Not needed (infrastructure only)

---

## Part 3: Link Backend (Phase 1 - Weeks 3-6)

### Increment 4: Azure Container Apps as Backend (1 hour)

**Current state**: Static site only  
**Target**: Backend API linked

**Two approaches:**

#### Approach A: Managed Functions (Simpler for Simple APIs)

```bash
# Static Web Apps can have built-in Functions
# Just create /api directory with functions

# Example: /api/recipes/function.json
# Automatically deployed with your static app
```

**Best for**: Simple CRUD APIs, webhooks, scheduled tasks

#### Approach B: Linked Container Apps (Better for Complex Backend)

```bash
# 1. Create Container Apps environment
az containerapp env create \
  --name "amplifier-env" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION"

# 2. Create container app
az containerapp create \
  --name "amplifier-api" \
  --resource-group "$RESOURCE_GROUP" \
  --environment "amplifier-env" \
  --image "<your-acr>.azurecr.io/amplifier-api:latest" \
  --target-port 8000 \
  --ingress internal \
  --cpu 0.25 \
  --memory 0.5Gi

# 3. Link to Static Web App
az staticwebapp backends link \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --backend-resource-id "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/containerApps/amplifier-api" \
  --backend-region "$LOCATION"
```

**Result**: 
- Frontend calls `/api/*` routes
- Static Web Apps proxies to Container Apps
- Container Apps is NOT publicly accessible (ingress: internal)
- Automatic authentication passthrough

**Best for**: FastAPI backend, complex orchestration, your use case

**Verification**:
- Frontend can call `/api/health`
- Backend logs show requests
- Backend is not publicly accessible directly

**Commit**: "Link Container Apps backend to Static Web App"

---

## Part 4: Database & Cache (Phase 1)

### Increment 5: Add PostgreSQL (30 minutes)

**Recommended: Supabase (Free tier)**

```bash
# 1. Go to https://supabase.com
# 2. Create project: "amplifier-onboarding"
# 3. Get connection string from Settings → Database
# 4. Add to Container App environment variables

az containerapp update \
  --name "amplifier-api" \
  --resource-group "$RESOURCE_GROUP" \
  --set-env-vars \
    "DATABASE_URL=secretref:database-url"

az containerapp secret set \
  --name "amplifier-api" \
  --resource-group "$RESOURCE_GROUP" \
  --secrets "database-url=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres"
```

**Alternative: Azure PostgreSQL Flexible Server** (if you prefer all-Azure)

```bash
# More expensive ($25/month) but fully Azure-native
az postgres flexible-server create \
  --name "amplifier-db" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --admin-user "amplifieradmin" \
  --admin-password "<secure-password>" \
  --sku-name "Standard_B1ms" \
  --tier "Burstable" \
  --version "15" \
  --storage-size 32 \
  --public-access "0.0.0.0"

# Add connection string to Container App secrets
```

**Verification**:
- Backend can connect to database
- Migrations run successfully

**Commit**: "Add PostgreSQL database connection"

---

### Increment 6: Add Redis Cache (30 minutes)

**Recommended: Upstash (Free tier)**

```bash
# 1. Go to https://console.upstash.com
# 2. Create Redis database: "amplifier-cache"
# 3. Get connection string (starts with rediss://)
# 4. Add to Container App secrets

az containerapp secret set \
  --name "amplifier-api" \
  --resource-group "$RESOURCE_GROUP" \
  --secrets "redis-url=rediss://default:[password]@[endpoint].upstash.io:6380"

az containerapp update \
  --name "amplifier-api" \
  --resource-group "$RESOURCE_GROUP" \
  --set-env-vars "REDIS_URL=secretref:redis-url"
```

**Alternative: Azure Cache for Redis** (if you prefer all-Azure, $15/month)

**Verification**:
- Backend can connect to Redis
- Rate limiting works

**Commit**: "Add Redis cache for rate limiting and sessions"

---

## Complete Architecture (Phase 1+)

```
┌─────────────────────────────────────────────────────────────────┐
│ GitHub Repository (main branch)                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Auto-deploy via GitHub Actions
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Azure Static Web Apps                                           │
│ ┌─────────────────────┐  ┌───────────────────────────────────┐ │
│ │ Frontend (Static)   │  │ Backend Proxy (/api/*)            │ │
│ │ - HTML/CSS/JS       │  │ - Routes to Container Apps        │ │
│ │ - Global CDN        │  │ - Auth passthrough                │ │
│ │ - Free SSL          │  │ - Request filtering               │ │
│ └─────────────────────┘  └───────────────┬───────────────────┘ │
│                                           │                     │
│ URL: amplifier.dev (custom) or *.azurestaticapps.net          │
└───────────────────────────────────────────┼─────────────────────┘
                                           │
                                           │ Internal ingress only
                                           ↓
                          ┌─────────────────────────────────────┐
                          │ Azure Container Apps                │
                          │ - FastAPI backend                   │
                          │ - Auto-scaling (0-3 replicas)       │
                          │ - NOT publicly accessible           │
                          └──────────┬──────────────┬───────────┘
                                     │              │
                                     ↓              ↓
                          ┌──────────────┐  ┌──────────────────┐
                          │ PostgreSQL   │  │ Redis (Upstash)  │
                          │ (Supabase)   │  │ - Free tier      │
                          │ - Free tier  │  │                  │
                          └──────────────┘  └──────────────────┘
```

**Security**: Backend is private (internal ingress), only accessible through Static Web Apps

---

## Quick Start: Deploy Now (10 minutes)

### Step 1: Get GitHub Token (2 minutes)

1. Go to https://github.com/settings/tokens/new
2. Select scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
3. Generate token
4. Copy token (you'll use it once)

### Step 2: Run Deployment Script (5 minutes)

Save this as `deploy-to-azure.sh` or run directly:

```bash
#!/usr/bin/env bash
set -euo pipefail

# ========================
# CONFIGURATION (EDIT THESE)
# ========================
SUBSCRIPTION_ID="your-subscription-id"
RESOURCE_GROUP="amplifier-rg"
LOCATION="eastus2"
APP_NAME="amplifier-onboarding"  # Must be globally unique
GITHUB_REPO_URL="https://github.com/yourusername/amplifier-onboarding"
GITHUB_TOKEN="ghp_xxxxxxxxxxxx"  # Your GitHub PAT

# ========================
# DEPLOYMENT
# ========================

echo "Setting subscription..."
az account set --subscription "$SUBSCRIPTION_ID"

echo "Creating resource group..."
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --output none

echo "Creating Azure Static Web App..."
echo "This will:"
echo "  1. Create the Static Web App in Azure"
echo "  2. Add GitHub Actions workflow to your repo"
echo "  3. Trigger initial deployment"
echo ""

az staticwebapp create \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --source "$GITHUB_REPO_URL" \
  --branch "main" \
  --app-location "/" \
  --output-location "/" \
  --login-with-github \
  --token "$GITHUB_TOKEN"

echo ""
echo "✅ Deployment initiated!"
echo ""

# Get the URL
APP_URL=$(az staticwebapp show \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "defaultHostname" \
  --output tsv)

echo "Your app will be available at:"
echo "  https://$APP_URL"
echo ""
echo "GitHub Actions workflow created at:"
echo "  .github/workflows/azure-static-web-apps-*.yml"
echo ""
echo "Monitor deployment:"
echo "  https://github.com/yourusername/amplifier-onboarding/actions"
echo ""
echo "Next steps:"
echo "  1. Wait for GitHub Actions to complete (~2 minutes)"
echo "  2. Visit https://$APP_URL"
echo "  3. (Optional) Add custom domain"
```

### Step 3: Verify Deployment (3 minutes)

1. **Check GitHub Actions**:
   - Go to your repo → Actions tab
   - Should see "Azure Static Web Apps CI/CD" workflow running
   - Wait for it to complete (1-2 minutes)

2. **Visit your site**:
   - Open `https://<app-name>.azurestaticapps.net`
   - Should see your landing page

3. **Check auto-created workflow**:
   - Look at `.github/workflows/azure-static-web-apps-*.yml`
   - This is now your deployment pipeline

**Verification checklist**:
- ✅ Static Web App shows "Ready" status in Azure Portal
- ✅ GitHub Actions workflow completed successfully
- ✅ Site accessible at Azure URL
- ✅ All assets (HTML, CSS, images) loading correctly

---

## Advanced Configuration (Optional)

### Custom Domain Setup (10 minutes)

**Prerequisites**: You own a domain and have DNS access

```bash
# Add custom domain
az staticwebapp hostname set \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --hostname "www.amplifier.dev"

# Azure will provide validation instructions
# Add DNS CNAME record:
#   Name: www
#   Type: CNAME  
#   Value: <app-name>.azurestaticapps.net
#   TTL: 3600

# Wait for DNS propagation (5-60 minutes)
# Then verify:
az staticwebapp hostname show \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --hostname "www.amplifier.dev"

# SSL certificate automatically provisioned within 1 hour
```

**For apex domain (amplifier.dev without www)**:
- Some DNS providers support ALIAS/ANAME records
- Or use Azure DNS for native support
- Or redirect apex → www via DNS provider

---

### Environment Variables (Phase 1+)

**Frontend configuration**:
```bash
# Add environment variables visible to frontend build
az staticwebapp appsettings set \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --setting-names \
    "VITE_API_URL=/api" \
    "VITE_ENVIRONMENT=production"
```

**Backend secrets** (when you add Container Apps):
- Stored in Container Apps secrets
- Accessed via Static Web Apps backend integration

---

### Authentication Configuration (Phase 1+)

Static Web Apps has **built-in authentication** for GitHub, Azure AD, Twitter, etc.

**Configure authentication providers**:

Create `staticwebapp.config.json` in your repo root:

```json
{
  "auth": {
    "identityProviders": {
      "github": {
        "registration": {
          "clientIdSettingName": "GITHUB_CLIENT_ID",
          "clientSecretSettingName": "GITHUB_CLIENT_SECRET"
        }
      }
    }
  },
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["authenticated"]
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

**Add secrets**:
```bash
az staticwebapp appsettings set \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --setting-names \
    "GITHUB_CLIENT_ID=your_client_id" \
    "GITHUB_CLIENT_SECRET=your_client_secret"
```

**Authentication endpoints automatically available**:
- `/.auth/login/github` - Login with GitHub
- `/.auth/logout` - Logout
- `/.auth/me` - Get current user

---

## Migration from GitHub Pages (5 minutes)

If you've already deployed to GitHub Pages:

### Step 1: Keep Both Running During Migration (5 minutes)

```bash
# Deploy to Azure Static Web Apps (as above)
# GitHub Pages continues working

# Test Azure deployment thoroughly
# When ready, update DNS to point to Azure
```

### Step 2: Update DNS (1 minute)

```bash
# Change CNAME from:
#   www -> yourusername.github.io

# To:
#   www -> <app-name>.azurestaticapps.net
```

### Step 3: Deprecate GitHub Pages (Optional)

```bash
# Disable GitHub Pages in repo settings
# Or keep as backup/fallback
```

**Total migration time**: 5 minutes  
**Downtime**: Zero (both run in parallel during migration)

---

## Cost Breakdown

### Free Tier (Perfect for Phase 0-1)
- **Bandwidth**: 100 GB/month
- **Builds**: 10 GB/month
- **Functions API calls**: 10,000/month (if using functions)
- **Custom domain**: ✅ Included
- **SSL certificate**: ✅ Included
- **Preview environments**: ✅ Included
- **Cost**: **$0/month**

### Standard Tier (When you outgrow free)
- **Price**: $9/month base
- **Bandwidth**: 100 GB included, then $0.15/GB
- **Builds**: Unlimited
- **Functions**: Pay-per-use beyond free tier
- **Custom domains**: Unlimited
- **When to upgrade**: When you hit free tier limits

### Additional Costs (Phase 1+)
- **Container Apps**: $15-30/month (0.25 CPU, 0.5GB RAM)
- **PostgreSQL**: $0 (Supabase) or $25/month (Azure)
- **Redis**: $0 (Upstash) or $15/month (Azure)

**Total Phase 0**: $0/month  
**Total Phase 1**: $15-70/month (depending on choices)

---

## CI/CD Pipeline Details

### Auto-Generated GitHub Actions Workflow

The workflow Azure creates handles:
- ✅ **Main branch**: Build and deploy to production
- ✅ **Pull requests**: Build and deploy to staging environment
- ✅ **PR closed**: Tear down staging environment
- ✅ **Preview URLs**: Each PR gets unique URL

**Example PR Preview**:
```
PR #42: Add recipe gallery
Preview URL: https://yellow-water-42.azurestaticapps.net
```

### Customizing the Build

**If using npm build process**, edit the auto-generated workflow:

```yaml
- name: Build And Deploy
  uses: Azure/static-web-apps-deploy@v1
  with:
    azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
    repo_token: ${{ secrets.GITHUB_TOKEN }}
    action: "upload"
    app_location: "/"
    api_location: ""
    output_location: "dist"  # Changed from "/"
```

**Then add build commands** to your package.json:

```json
{
  "scripts": {
    "build": "vite build",  // or your build command
    "preview": "vite preview"
  }
}
```

---

## Monitoring & Logs

### Built-in Insights

**View logs**:
```bash
# Stream logs in real-time
az staticwebapp logs show \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --follow

# Or view in Azure Portal:
# Static Web App → Monitoring → Logs
```

**Metrics (automatically collected)**:
- Page views
- Response times
- Error rates
- Bandwidth usage
- Build success/failure

### Application Insights Integration (Optional)

```bash
# Create Application Insights
az monitor app-insights component create \
  --app "amplifier-insights" \
  --location "$LOCATION" \
  --resource-group "$RESOURCE_GROUP"

# Link to Static Web App (via staticwebapp.config.json)
{
  "tracing": {
    "enabled": true
  }
}
```

---

## Troubleshooting

### Issue: Deployment fails in GitHub Actions

**Check**:
1. Workflow file syntax is valid
2. `AZURE_STATIC_WEB_APPS_API_TOKEN` secret exists
3. Build succeeds locally

**Solution**:
```bash
# Get new deployment token
az staticwebapp secrets list \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP"

# Update GitHub secret
```

---

### Issue: Site shows 404 for routes

**Cause**: SPA routing not configured

**Solution**: Add to `staticwebapp.config.json`:
```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/api/*", "/assets/*"]
  }
}
```

---

### Issue: Custom domain SSL pending

**Cause**: DNS not fully propagated or validation incomplete

**Check**:
```bash
# Verify DNS
nslookup www.amplifier.dev

# Check validation status
az staticwebapp hostname show \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --hostname "www.amplifier.dev"
```

**Solution**: Wait up to 48 hours for DNS + SSL validation

---

## Comparison: Static Web Apps vs Alternatives

| Feature | Static Web Apps | Storage + Front Door | GitHub Pages |
|---------|----------------|---------------------|--------------|
| **Setup time** | 10 minutes | 3 hours | 2 minutes |
| **Cost (Phase 0)** | $0 | $40/month | $0 |
| **Custom domain** | ✅ Free SSL | ✅ Via Front Door | ✅ Free |
| **Auto-deploy** | ✅ Built-in | ⚠️ Need to configure | ✅ Built-in |
| **Backend integration** | ✅ Easy (Functions or Container Apps) | ⚠️ Separate | ❌ Not supported |
| **Preview environments** | ✅ Automatic PR previews | ❌ Manual | ❌ Not supported |
| **Authentication** | ✅ Built-in | ⚠️ Custom | ❌ Not supported |
| **Global CDN** | ✅ Included | ✅ Via Front Door | ✅ Via GitHub CDN |
| **WAF** | ⚠️ Basic (upgrade to Front Door later) | ✅ Advanced | ❌ Not available |

**Winner for your use case**: Azure Static Web Apps

---

## Security Configuration

### Static Web Apps Security (Built-in)

**Already included**:
- ✅ HTTPS enforced
- ✅ DDoS protection (Azure platform)
- ✅ Custom headers support
- ✅ Request filtering

**Add via config**:

`staticwebapp.config.json`:
```json
{
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": "default-src 'self'",
    "Strict-Transport-Security": "max-age=31536000"
  },
  "routes": [
    {
      "route": "/api/*",
      "headers": {
        "X-Robots-Tag": "noindex, nofollow"
      }
    }
  ]
}
```

### When to Add Front Door + WAF

Only when you need:
- Advanced rate limiting (beyond basic throttling)
- Geo-blocking by country
- Bot protection (beyond basic)
- Custom WAF rules
- Multiple origin regions with failover

**Typical trigger**: 10,000+ daily active users OR specific compliance requirements

---

## Commands Cheat Sheet

### View app details
```bash
az staticwebapp show \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "{url:defaultHostname,status:sku.tier}" \
  --output table
```

### List environment variables
```bash
az staticwebapp appsettings list \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP"
```

### View deployment history
```bash
az staticwebapp show \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "buildProperties" \
  --output json
```

### Force rebuild
```bash
# Re-run the GitHub Actions workflow
# Or trigger via CLI:
az staticwebapp deploy \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --source "$GITHUB_REPO_URL" \
  --branch "main"
```

### Delete everything (cleanup)
```bash
az group delete \
  --name "$RESOURCE_GROUP" \
  --yes \
  --no-wait
```

---

## Implementation Timeline

### Phase 0 (Now - Weeks 1-2)
**Deploy**: Increment 1 + 2 (10 minutes)
- ✅ Static Web App created
- ✅ Auto-deploy configured
- ✅ Site live at *.azurestaticapps.net

**Optional**: Increment 3 (15 minutes)
- ⏭️ Custom domain
- ⏭️ Free SSL

**Cost**: $0/month

### Phase 1 (Weeks 3-6)
**Add Backend**: Increment 4 + 5 + 6 (2 hours)
- ⏸️ Container Apps backend
- ⏸️ PostgreSQL database
- ⏸️ Redis cache
- ⏸️ Link backend to Static Web App

**Cost**: $15-30/month (with free tier database/redis)

### Phase 2+ (Months 3-6)
**Scale Only If Needed**: Evaluate Front Door
- ⏸️ Only if traffic demands it
- ⏸️ Only if compliance requires it
- ⏸️ Migration effort: 1-2 hours

**Cost**: $50-80/month (if you add Front Door)

---

## Decision: When to Upgrade to Front Door

**Stay on Static Web Apps if:**
- ✅ <100k requests/day
- ✅ Single-region origin is fine
- ✅ Basic security is sufficient
- ✅ Cost-conscious development

**Migrate to Front Door when:**
- ❗ >100k requests/day consistently
- ❗ Need multi-region with failover
- ❗ Advanced WAF rules required
- ❗ Custom caching policies needed
- ❗ Compliance requires specific security controls

**Reality**: Most SaaS apps never need Front Door. Static Web Apps scales surprisingly far.

---

## What Makes This "Simple"

**One command creates everything:**
- Infrastructure (Static Web App)
- CI/CD pipeline (GitHub Actions)
- SSL certificate (automatic)
- Global CDN (built-in)
- Preview environments (automatic)

**No complex concepts:**
- No origin groups
- No routing rules (initially)
- No WAF policies (initially)
- No certificate management

**Add complexity only when needed:**
- Backend? → Link Container Apps (one command)
- Custom domain? → Add CNAME (one DNS record)
- Advanced security? → Migrate to Front Door (when traffic justifies it)

---

## Recommended Execution Order

### Today (Phase 0 Start)
1. ✅ Run the Quick Start script (10 minutes)
2. ✅ Verify deployment works
3. ✅ Start building features (Phase 0 Increment 1.1)

### Week 3 (Phase 1 Start)
4. ⏸️ Add Container Apps backend
5. ⏸️ Link to Static Web App
6. ⏸️ Add database + Redis

### Month 3+ (Phase 2 - If Needed)
7. ⏸️ Evaluate traffic and requirements
8. ⏸️ Add Front Door only if justified

---

## Summary

**Azure Static Web Apps is the sweet spot:**
- Simple enough for rapid iteration (like GitHub Pages)
- Powerful enough for production (like Front Door)
- Free during development
- Easy backend integration when ready
- Upgrade path to Front Door exists (but rarely needed)

**Setup effort**: 10 minutes  
**Monthly cost**: $0 → $9 → maybe $50 (only if you truly scale)  
**Rework effort if you add Front Door later**: 1-2 hours of config changes, zero code changes

**This is the right choice for starting fresh.**

Ready to run the deployment script?
