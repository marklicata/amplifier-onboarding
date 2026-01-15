/**
 * Telemetry Configuration
 * 
 * Centralized configuration for all telemetry features including
 * click tracking, privacy settings, and performance options.
 */

export interface TelemetryConfig {
  clickTracking: {
    enabled: boolean;
    debounceMs: number;
    sampleRate: number;
  };
  privacy: {
    sanitizeInputs: boolean;
    sanitizeUrls: boolean;
    maxTextLength: number;
    maxValueLength: number;
  };
  performance: {
    batchSize: number;
    flushIntervalMs: number;
  };
}

export const TELEMETRY_CONFIG: TelemetryConfig = {
  // Click tracking settings
  clickTracking: {
    enabled: true,
    debounceMs: 300,
    sampleRate: 1.0  // 1.0 = 100%, 0.5 = 50%, etc.
  },
  
  // Privacy settings
  privacy: {
    sanitizeInputs: true,
    sanitizeUrls: true,
    maxTextLength: 100,
    maxValueLength: 50
  },
  
  // Performance settings
  performance: {
    batchSize: 10,          // Number of events to batch before sending
    flushIntervalMs: 5000   // Flush interval in milliseconds
  }
};
