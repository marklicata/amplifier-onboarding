/**
 * User Identity Management
 * 
 * Manages user identification for telemetry tracking using a hybrid approach:
 * - Anonymous ID: Persistent across browser sessions (localStorage)
 * - Session ID: Unique per browser session (sessionStorage)
 * - User ID: Optional, set when user authenticates (future feature)
 */

export interface UserIdentity {
  anonymous_id: string;      // Persistent browser ID (UUID)
  session_id: string;        // Current session ID (UUID)
  user_id?: string;          // Optional authenticated user ID
  created_at: string;        // First visit timestamp (ISO 8601)
  last_seen: string;         // Most recent activity timestamp (ISO 8601)
}

/**
 * Get or create user identity
 * Handles both anonymous and authenticated users
 */
export const getOrCreateIdentity = (): UserIdentity => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // Server-side rendering - return a temporary identity
    return {
      anonymous_id: 'ssr-temporary',
      session_id: 'ssr-temporary',
      created_at: new Date().toISOString(),
      last_seen: new Date().toISOString()
    };
  }

  // Anonymous ID - persists across browser sessions
  let anonymousId = localStorage.getItem('amp_anonymous_id');
  if (!anonymousId) {
    anonymousId = crypto.randomUUID();
    localStorage.setItem('amp_anonymous_id', anonymousId);
    localStorage.setItem('amp_created_at', new Date().toISOString());
  }
  
  // Session ID - new for each browser session
  let sessionId = sessionStorage.getItem('amp_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('amp_session_id', sessionId);
  }
  
  // User ID - from authentication (GitHub OAuth, future feature)
  const userId = localStorage.getItem('amp_user_id');
  
  // Update last seen timestamp
  localStorage.setItem('amp_last_seen', new Date().toISOString());
  
  return {
    anonymous_id: anonymousId,
    session_id: sessionId,
    user_id: userId || undefined,
    created_at: localStorage.getItem('amp_created_at') || new Date().toISOString(),
    last_seen: new Date().toISOString()
  };
};

/**
 * Link anonymous ID to authenticated user
 * Call this after GitHub OAuth login (future feature)
 */
export const linkUserIdentity = (userId: string): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('amp_user_id', userId);
  
  // Track the linking event (appInsights will be available when called)
  if (typeof window !== 'undefined' && (window as any).appInsights) {
    (window as any).appInsights.trackEvent({
      name: 'user_identity_linked',
      properties: {
        anonymous_id: localStorage.getItem('amp_anonymous_id'),
        user_id: userId
      }
    });
  }
};

/**
 * Clear user identity (logout)
 */
export const clearUserIdentity = (): void => {
  if (typeof window === 'undefined') return;
  
  const anonymousId = localStorage.getItem('amp_anonymous_id');
  
  // Remove user ID but keep anonymous_id and session_id for tracking
  localStorage.removeItem('amp_user_id');
  
  // Track the logout event
  if (typeof window !== 'undefined' && (window as any).appInsights) {
    (window as any).appInsights.trackEvent({
      name: 'user_logged_out',
      properties: {
        anonymous_id: anonymousId
      }
    });
  }
};

/**
 * Check Do Not Track preference
 */
export const shouldTrack = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const dnt = navigator.doNotTrack || (window as any).doNotTrack || (navigator as any).msDoNotTrack;
  return dnt !== '1' && dnt !== 'yes';
};

/**
 * Check if user has given tracking consent
 * Returns true by default - implement cookie consent banner if needed
 */
export const hasTrackingConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // For now, assume consent unless explicitly denied
  // In the future, this should check for a consent banner acceptance
  const consent = localStorage.getItem('amp_tracking_consent');
  
  // If no consent value set, default to true (opt-out model)
  // Change to false for opt-in model + add consent banner
  return consent !== 'false';
};
