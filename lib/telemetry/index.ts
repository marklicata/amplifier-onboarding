/**
 * Telemetry Module
 * 
 * Central export point for all telemetry functionality.
 * Import everything from this single entry point.
 */

export {
  initializeTelemetry,
  getAppInsights,
  trackEvent,
  trackMetric,
  trackException,
  trackPageView,
  flushTelemetry,
  appInsights
} from './tracking';

export type { UserIdentity } from './identity';

export {
  getOrCreateIdentity,
  linkUserIdentity,
  clearUserIdentity,
  shouldTrack,
  hasTrackingConsent
} from './identity';

export {
  useTrackMount,
  useTrackPageView,
  useTrackUnmount
} from './hooks/useTelemetryTracking';

// Click tracking
export {
  setupClickTracking,
  shouldIgnoreElement,
  extractClickData,
  extractTextContent,
  sanitizeInputValue,
  findTrackingContext,
  getSimplifiedSelector,
  sanitizeUrl
} from './clickTracking';

export type { ClickTrackingOptions } from './clickTracking';

// Event naming
export { TELEMETRY_EVENTS } from './eventNaming';
export type { TelemetryEvent } from './eventNaming';

// Configuration
export { TELEMETRY_CONFIG } from './config';
export type { TelemetryConfig } from './config';

// Playground tracking hook
export { usePlaygroundTracking } from './hooks/usePlaygroundTracking';
export type { PlaygroundContext, PlaygroundTrackingFunctions } from './hooks/usePlaygroundTracking';

// Development logger
export {
  logDevEvent,
  exportDevLogs,
  clearDevLogs,
  getDevLogs,
  getDevLogStats,
  setDebug,
  isDebugEnabled
} from './devLogger';
