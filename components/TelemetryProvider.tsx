'use client';

/**
 * Telemetry Provider Component
 * 
 * Client-side component that initializes Application Insights telemetry.
 * Must be a client component since Application Insights runs in the browser.
 */

import { useEffect } from 'react';
import { initializeTelemetry, flushTelemetry, trackEvent } from '@/lib/telemetry';

export default function TelemetryProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize telemetry on mount
    const appInsights = initializeTelemetry();

    if (appInsights) {
      // Track page visibility changes
      const handleVisibilityChange = () => {
        if (document.hidden) {
          trackEvent('page_hidden', {
            page_path: window.location.pathname
          });
          // Flush telemetry before page might be unloaded
          flushTelemetry();
        } else {
          trackEvent('page_visible', {
            page_path: window.location.pathname
          });
        }
      };

      // Track before page unload
      const handleBeforeUnload = () => {
        flushTelemetry();
      };

      // Add event listeners
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', handleBeforeUnload);

      // Cleanup
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        flushTelemetry();
      };
    }
  }, []);

  return <>{children}</>;
}
