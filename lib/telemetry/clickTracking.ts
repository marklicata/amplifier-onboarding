/**
 * Universal Click Tracking
 * 
 * Provides automatic click tracking with semantic information extraction,
 * privacy sanitization, and context-aware event enrichment.
 */

import { trackEvent } from './tracking';
import { getOrCreateIdentity } from './identity';

export interface ClickTrackingOptions {
  debounceMs?: number;
  sampleRate?: number;
  enabled?: boolean;
}

interface ClickData {
  element_type: string;
  element_id?: string;
  element_class?: string;
  element_text?: string;
  element_selector: string;
  link_url?: string;
  link_text?: string;
  button_text?: string;
  aria_label?: string;
  track_label?: string;
  track_context?: string;
  page_path: string;
  session_id: string;
}

// Sensitive input types that should not be tracked
const SENSITIVE_INPUT_TYPES = ['password', 'email', 'tel', 'credit-card', 'ssn'];

// URL parameters to sanitize
const SENSITIVE_URL_PARAMS = ['token', 'api_key', 'password', 'secret', 'auth', 'key'];

/**
 * Check if element is interactive and should be tracked
 */
const isInteractiveElement = (element: HTMLElement): boolean => {
  // Explicit tracking via data attribute
  if (element.dataset.trackLabel) {
    return true;
  }

  const tagName = element.tagName.toLowerCase();
  const role = element.getAttribute('role');

  // Interactive HTML elements
  const interactiveTags = ['a', 'button', 'input', 'select', 'textarea', 'summary', 'details'];
  if (interactiveTags.includes(tagName)) {
    return true;
  }

  // Elements with button/link roles
  const interactiveRoles = ['button', 'link', 'tab', 'menuitem', 'option', 'radio', 'checkbox', 'switch'];
  if (role && interactiveRoles.includes(role)) {
    return true;
  }

  // Elements with click handlers (has onclick attribute)
  if (element.hasAttribute('onclick')) {
    return true;
  }

  // Elements with cursor pointer (usually clickable)
  if (typeof window !== 'undefined') {
    const style = window.getComputedStyle(element);
    if (style.cursor === 'pointer') {
      return true;
    }
  }

  // Elements that are explicitly interactive via aria attributes
  if (element.hasAttribute('aria-pressed') || 
      element.hasAttribute('aria-expanded') ||
      element.hasAttribute('aria-selected')) {
    return true;
  }

  return false;
};

/**
 * Setup universal click tracking
 * Returns cleanup function to remove listener
 */
export const setupClickTracking = (options: ClickTrackingOptions = {}): (() => void) => {
  const {
    debounceMs = 300,
    sampleRate = 1.0,
    enabled = true
  } = options;

  if (!enabled) {
    return () => {};
  }

  let debounceTimer: NodeJS.Timeout | null = null;

  const handleClick = (event: MouseEvent) => {
    // Sample rate check
    if (Math.random() > sampleRate) {
      return;
    }

    const target = event.target as HTMLElement;
    if (!target) return;

    // Check for opt-out
    if (shouldIgnoreElement(target)) {
      return;
    }

    // Find the nearest interactive element (check target and up to 3 ancestors)
    let interactiveElement: HTMLElement | null = null;
    let current: HTMLElement | null = target;
    let depth = 0;
    const maxDepth = 3; // Check up to 3 ancestors

    while (current && depth < maxDepth) {
      if (isInteractiveElement(current)) {
        interactiveElement = current;
        break;
      }
      current = current.parentElement;
      depth++;
    }

    // If no interactive element found, ignore this click
    if (!interactiveElement) {
      return;
    }

    // Debounce
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      try {
        const clickData = extractClickData(interactiveElement!);
        trackEvent('click', clickData);
      } catch (error) {
        console.error('[ClickTracking] Error extracting click data:', error);
      }
    }, debounceMs);
  };

  // Attach global click listener
  document.addEventListener('click', handleClick, { capture: true });

  // Return cleanup function
  return () => {
    document.removeEventListener('click', handleClick, { capture: true });
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  };
};

/**
 * Check if element should be ignored
 */
export const shouldIgnoreElement = (element: HTMLElement): boolean => {
  // Check for explicit opt-out
  if (element.dataset.track === 'false') {
    return true;
  }

  // Walk up the tree to check ancestors
  let current: HTMLElement | null = element;
  while (current) {
    if (current.dataset.track === 'false') {
      return true;
    }
    current = current.parentElement;
  }

  return false;
};

/**
 * Extract semantic click data from element
 */
export const extractClickData = (element: HTMLElement): ClickData => {
  const identity = getOrCreateIdentity();
  
  const data: ClickData = {
    element_type: element.tagName.toLowerCase(),
    element_selector: getSimplifiedSelector(element),
    page_path: window.location.pathname,
    session_id: identity.session_id
  };

  // Element ID
  if (element.id) {
    data.element_id = element.id;
  }

  // Element classes (first 3 only)
  if (element.className && typeof element.className === 'string') {
    const classes = element.className.split(' ').filter(c => c).slice(0, 3);
    if (classes.length > 0) {
      data.element_class = classes.join(' ');
    }
  }

  // Track label (custom data attribute)
  if (element.dataset.trackLabel) {
    data.track_label = element.dataset.trackLabel;
  }

  // ARIA label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) {
    data.aria_label = ariaLabel;
  }

  // Text content
  const text = extractTextContent(element);
  if (text) {
    data.element_text = text;
  }

  // Link-specific data
  if (element.tagName === 'A') {
    const href = (element as HTMLAnchorElement).href;
    if (href) {
      data.link_url = sanitizeUrl(href);
      data.link_text = text || ariaLabel || '';
    }
  }

  // Button-specific data
  if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
    data.button_text = text || ariaLabel || '';
  }

  // Input-specific data (sanitized)
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    const input = element as HTMLInputElement;
    const sanitizedValue = sanitizeInputValue(input);
    if (sanitizedValue) {
      data.element_text = sanitizedValue;
    }
  }

  // Context from ancestors
  const context = findTrackingContext(element);
  if (context) {
    data.track_context = context;
  }

  return data;
};

/**
 * Extract text content from element (with length limit)
 */
export const extractTextContent = (element: HTMLElement, maxLength: number = 100): string | undefined => {
  let text = '';

  // Try innerText first (respects CSS visibility)
  if (element.innerText) {
    text = element.innerText;
  } else if (element.textContent) {
    text = element.textContent;
  }

  // Clean up whitespace
  text = text.trim().replace(/\s+/g, ' ');

  // Truncate if needed
  if (text.length > maxLength) {
    text = text.substring(0, maxLength) + '...';
  }

  return text || undefined;
};

/**
 * Sanitize input value for privacy
 */
export const sanitizeInputValue = (input: HTMLInputElement | HTMLTextAreaElement): string | undefined => {
  const type = input.type?.toLowerCase() || 'text';
  
  // Never track sensitive inputs
  if (SENSITIVE_INPUT_TYPES.includes(type)) {
    return '[REDACTED]';
  }

  // For checkboxes and radios, track checked state
  if (type === 'checkbox' || type === 'radio') {
    return (input as HTMLInputElement).checked ? 'checked' : 'unchecked';
  }

  // For other inputs, don't track the actual value (privacy)
  // Just track that an input was interacted with
  return input.value ? '[HAS_VALUE]' : '[EMPTY]';
};

/**
 * Find tracking context from ancestor elements
 * Looks for data-track-context attribute
 */
export const findTrackingContext = (element: HTMLElement): string | undefined => {
  let current: HTMLElement | null = element;
  
  while (current) {
    if (current.dataset.trackContext) {
      return current.dataset.trackContext;
    }
    current = current.parentElement;
  }
  
  return undefined;
};

/**
 * Generate simplified selector for position tracking
 * Format: "tagname > tagname#id > tagname.class"
 */
export const getSimplifiedSelector = (element: HTMLElement): string => {
  const parts: string[] = [];
  let current: HTMLElement | null = element;
  let depth = 0;
  const maxDepth = 5; // Limit depth to avoid overly long selectors

  while (current && depth < maxDepth) {
    let part = current.tagName.toLowerCase();
    
    // Add ID if present
    if (current.id) {
      part += `#${current.id}`;
      parts.unshift(part);
      break; // ID is unique, stop here
    }
    
    // Add first class if present
    if (current.className && typeof current.className === 'string') {
      const firstClass = current.className.split(' ').filter(c => c)[0];
      if (firstClass) {
        part += `.${firstClass}`;
      }
    }
    
    parts.unshift(part);
    current = current.parentElement;
    depth++;
  }

  return parts.join(' > ');
};

/**
 * Sanitize URL to remove sensitive parameters
 */
export const sanitizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    
    // Check and sanitize query parameters
    SENSITIVE_URL_PARAMS.forEach(param => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.set(param, '[REDACTED]');
      }
    });
    
    return urlObj.toString();
  } catch {
    // If URL parsing fails, return as-is
    return url;
  }
};
