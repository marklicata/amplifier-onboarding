/**
 * Development Telemetry Logger
 * 
 * Logs telemetry events to console and accumulates them for export.
 * Only active in development mode.
 * 
 * Features:
 * - Console logging with color-coded formatting
 * - Accumulates events in sessionStorage as JSONL
 * - Export function to download events as .jsonl file
 * - Global window.telemetryDevTools for easy access
 */

interface TelemetryEvent {
  timestamp: string;
  event: string;
  properties: Record<string, any>;
}

const STORAGE_KEY = 'amplifier_telemetry_dev_log';
const DEBUG_KEY = 'amplifier_telemetry_debug';
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Get debug flag (defaults to false)
 */
export const isDebugEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const debugFlag = sessionStorage.getItem(DEBUG_KEY);
    return debugFlag === 'true';
  } catch {
    return false;
  }
};

/**
 * Set debug flag
 */
export const setDebug = (enabled: boolean) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(DEBUG_KEY, enabled.toString());
    console.log(`[DevLogger] Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  } catch (error) {
    console.error('[DevLogger] Failed to set debug flag:', error);
  }
};

/**
 * Log a telemetry event to console and sessionStorage
 * Only active in development mode
 */
export const logDevEvent = (eventName: string, properties: Record<string, any> = {}) => {
  if (!isDevelopment) return;

  const event: TelemetryEvent = {
    timestamp: new Date().toISOString(),
    event: eventName,
    properties,
  };

  // Only log to console if debug is enabled
  if (isDebugEnabled()) {
    console.log(
      `%c[Telemetry Event]%c ${eventName}`,
      'color: #4CAF50; font-weight: bold',
      'color: inherit',
      properties
    );
  }

  // Always accumulate in sessionStorage (regardless of debug flag)
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY) || '';
    const jsonLine = JSON.stringify(event);
    sessionStorage.setItem(STORAGE_KEY, existing + jsonLine + '\n');
  } catch (error) {
    // Only log error if debug is enabled
    if (isDebugEnabled()) {
      console.error('[DevLogger] Failed to store event:', error);
    }
  }
};

/**
 * Export accumulated telemetry events as a JSONL file download
 */
export const exportDevLogs = () => {
  if (!isDevelopment) {
    console.warn('[DevLogger] Export only available in development mode');
    return;
  }

  try {
    const logs = sessionStorage.getItem(STORAGE_KEY);
    if (!logs) {
      console.log('[DevLogger] No events to export');
      return;
    }

    // Create blob and trigger download
    const blob = new Blob([logs], { type: 'application/x-ndjson' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetry-events-${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('[DevLogger] Events exported to file');
  } catch (error) {
    console.error('[DevLogger] Failed to export logs:', error);
  }
};

/**
 * Clear accumulated telemetry events from sessionStorage
 */
export const clearDevLogs = () => {
  if (!isDevelopment) return;
  
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    console.log('[DevLogger] Event log cleared');
  } catch (error) {
    console.error('[DevLogger] Failed to clear logs:', error);
  }
};

/**
 * Get all accumulated telemetry events as an array
 */
export const getDevLogs = (): TelemetryEvent[] => {
  if (!isDevelopment) return [];

  try {
    const logs = sessionStorage.getItem(STORAGE_KEY);
    if (!logs) return [];

    return logs
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
  } catch (error) {
    console.error('[DevLogger] Failed to parse logs:', error);
    return [];
  }
};

/**
 * Get statistics about accumulated events
 */
export const getDevLogStats = () => {
  if (!isDevelopment) return null;

  try {
    const events = getDevLogs();
    const eventCounts: Record<string, number> = {};
    
    events.forEach(event => {
      eventCounts[event.event] = (eventCounts[event.event] || 0) + 1;
    });

    return {
      total: events.length,
      eventTypes: Object.keys(eventCounts).length,
      breakdown: eventCounts,
      firstEvent: events[0]?.timestamp,
      lastEvent: events[events.length - 1]?.timestamp,
    };
  } catch (error) {
    console.error('[DevLogger] Failed to get stats:', error);
    return null;
  }
};

// Expose to window for easy access in browser console
if (typeof window !== 'undefined' && isDevelopment) {
  (window as any).telemetryDevTools = {
    export: exportDevLogs,
    clear: clearDevLogs,
    getLogs: getDevLogs,
    getStats: getDevLogStats,
    setDebug: setDebug,
    isDebugEnabled: isDebugEnabled,
  };
  
  console.log(
    '%c[DevLogger]%c Telemetry dev tools available (debug mode: OFF by default)',
    'color: #2196F3; font-weight: bold',
    'color: inherit',
    '\n  window.telemetryDevTools.setDebug(true) - Enable console logging',
    '\n  window.telemetryDevTools.setDebug(false) - Disable console logging',
    '\n  window.telemetryDevTools.export() - Download events as JSONL',
    '\n  window.telemetryDevTools.clear() - Clear accumulated events',
    '\n  window.telemetryDevTools.getLogs() - Get all events as array',
    '\n  window.telemetryDevTools.getStats() - View event statistics'
  );
}
