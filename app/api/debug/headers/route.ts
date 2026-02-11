import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Debug endpoint to inspect Azure Container Apps EasyAuth headers
 *
 * Access this at: /api/debug/headers
 *
 * This will show you what authentication headers Azure is injecting
 * after a user signs in with their Microsoft account.
 */
export async function GET(request: NextRequest) {
  // Get all headers
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Extract Azure EasyAuth specific headers
  const azureHeaders = {
    principalId: request.headers.get('x-ms-client-principal-id'),
    principalName: request.headers.get('x-ms-client-principal-name'),
    principalIdp: request.headers.get('x-ms-client-principal-idp'),
    principal: request.headers.get('x-ms-client-principal'),
  };

  // Decode the principal if it exists
  let decodedPrincipal = null;
  if (azureHeaders.principal) {
    try {
      const decoded = Buffer.from(azureHeaders.principal, 'base64').toString('utf-8');
      decodedPrincipal = JSON.parse(decoded);
    } catch (error) {
      decodedPrincipal = { error: 'Failed to decode principal' };
    }
  }

  return Response.json({
    authenticated: !!azureHeaders.principalId,
    azureAuthHeaders: azureHeaders,
    decodedPrincipal: decodedPrincipal,
    allHeaders: headers,
    timestamp: new Date().toISOString(),
    instructions: {
      message: azureHeaders.principalId
        ? '✅ Azure authentication is working! Use principalId as your userId.'
        : '⚠️ No Azure auth headers found. Either EasyAuth is not enabled or you are not signed in.',
      nextSteps: azureHeaders.principalId
        ? 'You can now use this principalId in your chat API route as the userId.'
        : 'Enable EasyAuth in Azure Container Apps and ensure users must authenticate.'
    }
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}