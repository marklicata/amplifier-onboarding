# Azure Resources Setup Guide

This guide walks through setting up all Azure resources needed for the Amplifier application.

## Prerequisites

- Azure CLI installed: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli
- Azure subscription with contributor access
- GitHub repository admin access (to add secrets)

## Login to Azure

```bash
az login
az account show  # Verify you're on the correct subscription
```

If you have multiple subscriptions:
```bash
az account list --output table
az account set --subscription "YOUR_SUBSCRIPTION_ID"
```

## Configuration Variables

Set these variables first (customize as needed):

```bash
# Resource naming
RESOURCE_GROUP="amplifier-rg"
LOCATION="eastus"
APP_NAME="amplifier"

# Database
DB_SERVER_NAME="${APP_NAME}-db"
DB_NAME="amplifier"
DB_ADMIN_USER="amplifieradmin"
DB_ADMIN_PASSWORD="<generate-strong-password>"  # Change this!

# Container Registry
ACR_NAME="${APP_NAME}acr"  # Must be globally unique, alphanumeric only

# Container App
CONTAINER_APP_ENV="${APP_NAME}-env"
CONTAINER_APP_NAME="${APP_NAME}-api"

# Static Web App
STATIC_WEB_APP_NAME="${APP_NAME}-web"

# Application Insights
APP_INSIGHTS_NAME="${APP_NAME}-insights"
```

## Step 1: Create Resource Group

```bash
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

## Step 2: Create Azure Database for PostgreSQL

### Create PostgreSQL Flexible Server

```bash
az postgres flexible-server create \
  --name $DB_SERVER_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --admin-user $DB_ADMIN_USER \
  --admin-password $DB_ADMIN_PASSWORD \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 15 \
  --public-access 0.0.0.0-255.255.255.255
```

### Create Database

```bash
az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $DB_SERVER_NAME \
  --database-name $DB_NAME
```

### Get Connection String

```bash
echo "postgresql://${DB_ADMIN_USER}:${DB_ADMIN_PASSWORD}@${DB_SERVER_NAME}.postgres.database.azure.com/${DB_NAME}?sslmode=require"
```

Save this connection string - you'll need it for GitHub secrets.

## Step 3: Create Azure Container Registry

```bash
az acr create \
  --name $ACR_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Basic \
  --admin-enabled true
```

### Get ACR Credentials

```bash
# Get registry URL
ACR_REGISTRY=$(az acr show --name $ACR_NAME --query loginServer --output tsv)
echo "ACR Registry: $ACR_REGISTRY"

# Get admin credentials
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv)

echo "ACR Username: $ACR_USERNAME"
echo "ACR Password: $ACR_PASSWORD"
```

Save these credentials for GitHub secrets.

## Step 4: Create Container App Environment

```bash
az containerapp env create \
  --name $CONTAINER_APP_ENV \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

## Step 5: Create Azure Container App (Backend)

First, build and push an initial Docker image (from your project root):

```bash
# Login to ACR
az acr login --name $ACR_NAME

# Build and push initial image
docker build -t $ACR_REGISTRY/amplifier-api:latest ./backend
docker push $ACR_REGISTRY/amplifier-api:latest
```

Create the Container App:

```bash
az containerapp create \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_APP_ENV \
  --image $ACR_REGISTRY/amplifier-api:latest \
  --target-port 8000 \
  --ingress external \
  --registry-server $ACR_REGISTRY \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --cpu 0.5 \
  --memory 1.0Gi \
  --min-replicas 1 \
  --max-replicas 3 \
  --env-vars \
    DATABASE_URL="<your-postgres-connection-string>" \
    GITHUB_CLIENT_ID="<your-github-client-id>" \
    GITHUB_CLIENT_SECRET="<your-github-client-secret>" \
    JWT_SECRET="<generate-random-string>" \
    ENVIRONMENT="production"
```

### Get Backend API URL

```bash
API_URL=$(az containerapp show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

echo "API URL: https://$API_URL"
```

Save this URL for GitHub secrets.

## Step 6: Create Azure Static Web App (Frontend)

```bash
az staticwebapp create \
  --name $STATIC_WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Free
```

### Get Static Web App Deployment Token

```bash
STATIC_WEB_APP_TOKEN=$(az staticwebapp secrets list \
  --name $STATIC_WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.apiKey \
  --output tsv)

echo "Static Web App Token: $STATIC_WEB_APP_TOKEN"
```

Save this token for GitHub secrets.

### Get Static Web App URL

```bash
FRONTEND_URL=$(az staticwebapp show \
  --name $STATIC_WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query defaultHostname \
  --output tsv)

echo "Frontend URL: https://$FRONTEND_URL"
```

## Step 7: Create Application Insights (Optional but Recommended)

```bash
az monitor app-insights component create \
  --app $APP_INSIGHTS_NAME \
  --location $LOCATION \
  --resource-group $RESOURCE_GROUP \
  --application-type web
```

### Get Instrumentation Key

```bash
APPINSIGHTS_KEY=$(az monitor app-insights component show \
  --app $APP_INSIGHTS_NAME \
  --resource-group $RESOURCE_GROUP \
  --query instrumentationKey \
  --output tsv)

echo "App Insights Key: $APPINSIGHTS_KEY"
```

## Step 8: Configure GitHub Secrets

Go to your GitHub repository: **Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

### Backend Secrets
- `ACR_REGISTRY`: `<your-acr-registry>` (e.g., amplifieracr.azurecr.io)
- `ACR_USERNAME`: `<your-acr-username>`
- `ACR_PASSWORD`: `<your-acr-password>`
- `CONTAINER_APP_NAME`: `amplifier-api` (or your value)
- `RESOURCE_GROUP`: `amplifier-rg` (or your value)

### Frontend Secrets
- `AZURE_STATIC_WEB_APPS_API_TOKEN`: `<your-static-web-app-token>`
- `API_URL`: `https://<your-container-app-url>`
- `GITHUB_CLIENT_ID`: `<your-github-oauth-client-id>`

### Optional
- `APPINSIGHTS_INSTRUMENTATION_KEY`: `<your-app-insights-key>`

## Step 9: Update GitHub OAuth Callback URL

Update your GitHub OAuth app (see SETUP_OAUTH.md) to include:

**Authorization callback URL:**
- `https://<your-frontend-url>/auth/callback`

Example: `https://amplifier-web.azurestaticapps.net/auth/callback`

## Step 10: Test Your Deployment

### Deploy Backend
1. Make a small change to backend code
2. Commit and push to main branch
3. Watch GitHub Actions workflow
4. Verify: `curl https://<your-api-url>/health`

### Deploy Frontend
1. Make a small change to frontend code
2. Commit and push to main branch
3. Watch GitHub Actions workflow
4. Visit: `https://<your-frontend-url>`

## Resource Summary

After setup, you'll have:

| Resource | Name | Purpose |
|----------|------|---------|
| Resource Group | amplifier-rg | Container for all resources |
| PostgreSQL | amplifier-db | Database |
| Container Registry | amplifieracr | Docker image storage |
| Container App | amplifier-api | Backend API |
| Static Web App | amplifier-web | Frontend |
| App Insights | amplifier-insights | Monitoring |

## Cost Estimates

Monthly costs (approximate):
- PostgreSQL Flexible Server (B1ms): ~$12
- Container App (0.5 vCPU, 1GB): ~$10-30 (depends on usage)
- Container Registry (Basic): ~$5
- Static Web App (Free tier): $0
- Application Insights: $0-5 (free tier covers most dev usage)

**Total**: ~$30-50/month for development

## Cleanup (if needed)

To delete all resources:

```bash
az group delete --name $RESOURCE_GROUP --yes --no-wait
```

## Troubleshooting

### Container App won't start
- Check logs: `az containerapp logs show --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP --follow`
- Verify environment variables are set correctly
- Check database connectivity

### Static Web App deployment fails
- Verify API token is correct
- Check build output in GitHub Actions logs
- Ensure `frontend/out` directory is generated

### Database connection issues
- Verify firewall rules allow your Container App
- Check connection string format
- Ensure SSL is enabled (`sslmode=require`)

## Next Steps

1. Test the complete OAuth flow end-to-end
2. Set up CI/CD monitoring
3. Configure custom domain (optional)
4. Set up staging environment (recommended)

## Support

For Azure-specific issues:
- Azure CLI docs: https://learn.microsoft.com/en-us/cli/azure/
- Container Apps docs: https://learn.microsoft.com/en-us/azure/container-apps/
- Static Web Apps docs: https://learn.microsoft.com/en-us/azure/static-web-apps/
