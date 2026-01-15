/**
 * Application Insights Telemetry
 * 
 * Initializes and configures Azure Application Insights for comprehensive telemetry tracking.
 * Provides utilities for tracking custom events, metrics, and exceptions.
 */

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { getOrCreateIdentity, shouldTrack, hasTrackingConsent } from './identity';

// Global instance (singleton)
let appInsightsInstance: ApplicationInsights | null = null;

/**
 * Initialize Application Insights
 * Call this once at application startup (in layout.tsx)
 */
export const initializeTelemetry = (): ApplicationInsights | null => {
  // Only initialize in browser environment
  if (typeof window === 'undefined') {
    return null;
  }

  // Check if already initialized
  if (appInsightsInstance) {
    return appInsightsInstance;
  }

  // Check consent and DNT
  if (!hasTrackingConsent() || !shouldTrack()) {
    console.log('[Telemetry] Tracking disabled (consent or DNT)');
    return null;
  }

  // Get connection string from environment
  const connectionString = process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING;
  
  if (!connectionString) {
    console.warn('[Telemetry] No connection string found. Telemetry disabled.');
    return null;
  }

  try {
    // Initialize Application Insights
    const appInsights = new ApplicationInsights({
      config: {
        connectionString: connectionString,
        enableAutoRouteTracking: true,       // Track SPA route changes
        enableCorsCorrelation: true,         // Correlate CORS requests
        enableRequestHeaderTracking: true,   // Track request headers
        enableResponseHeaderTracking: true,  // Track response headers
        disableFetchTracking: false,         // Track fetch API calls
        disableAjaxTracking: false,          // Track AJAX calls
        disableExceptionTracking: false,     // Track JavaScript exceptions
        autoTrackPageVisitTime: true,        // Track time on page
        enableDebug: process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production', // Debug in dev
      }
    });

    appInsights.loadAppInsights();

    // Get user identity
    const identity = getOrCreateIdentity();
    
    // Set authenticated user context
    appInsights.setAuthenticatedUserContext(
      identity.user_id || identity.anonymous_id,
      undefined,
      true  // Store in session
    );

    // Add custom properties to all events via telemetry initializer
    appInsights.addTelemetryInitializer((envelope) => {
      if (!envelope.data) {
        envelope.data = {};
      }
      
      // Add identity info
      envelope.data.anonymous_id = identity.anonymous_id;
      envelope.data.session_id = identity.session_id;
      
      // Add app context
      envelope.data.app_version = process.env.NEXT_PUBLIC_APP_VERSION || '0.3.0';
      envelope.data.environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';
      
      return true; // Continue processing
    });

    // Store global instance
    appInsightsInstance = appInsights;
    
    // Make available globally for debugging
    if (typeof window !== 'undefined') {
      (window as any).appInsights = appInsights;
    }

    console.log('[Telemetry] Application Insights initialized');
    
    // Track app start
    appInsights.trackEvent({
      name: 'app_started',
      properties: {
        app_version: process.env.NEXT_PUBLIC_APP_VERSION,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT
      }
    });

    return appInsights;

  } catch (error) {
    console.error('[Telemetry] Failed to initialize Application Insights:', error);
    return null;
  }
};

/**
 * Get the Application Insights instance
 * Returns null if not initialized or disabled
 */
export const getAppInsights = (): ApplicationInsights | null => {
  return appInsightsInstance;
};

/**
 * Track a custom event
 */
export const trackEvent = (name: string, properties?: { [key: string]: any }) => {
  if (appInsightsInstance) {
    appInsightsInstance.trackEvent({
      name,
      properties: {
        ...properties,
        timestamp: new Date().toISOString()
      }
    });
  }
};

/**
 * Track a custom metric
 */
export const trackMetric = (name: string, value: number, properties?: { [key: string]: any }) => {
  if (appInsightsInstance) {
    appInsightsInstance.trackMetric({
      name,
      average: value,
      properties
    });
  }
};

/**
 * Track an exception/error
 */
export const trackException = (error: Error, properties?: { [key: string]: any }) => {
  if (appInsightsInstance) {
    appInsightsInstance.trackException({
      exception: error,
      properties: {
        ...properties,
        timestamp: new Date().toISOString()
      }
    });
  }
};

/**
 * Track a page view manually (automatic tracking is enabled by default)
 */
export const trackPageView = (name?: string, uri?: string, properties?: { [key: string]: any }) => {
  if (appInsightsInstance) {
    appInsightsInstance.trackPageView({
      name,
      uri,
      properties: {
        ...properties,
        timestamp: new Date().toISOString()
      }
    });
  }
};

/**
 * Flush telemetry immediately (useful before page unload)
 */
export const flushTelemetry = () => {
  if (appInsightsInstance) {
    appInsightsInstance.flush();
  }
};

// Export the instance for direct access if needed
export { appInsightsInstance as appInsights };
