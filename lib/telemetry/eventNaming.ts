/**
 * Telemetry Event Names
 * 
 * Centralized event name constants following the naming convention:
 * {domain}_{entity}_{action}
 * 
 * This ensures consistency across the application and makes it easier
 * to track and analyze user behavior.
 */

export const TELEMETRY_EVENTS = {
  // Generic events
  CLICK: 'click',
  PAGE_VIEW: 'page_view',
  PAGE_HIDDEN: 'page_hidden',
  PAGE_VISIBLE: 'page_visible',
  
  // Chat events
  CHAT_OPENED: 'chat_opened',
  CHAT_CLOSED: 'chat_closed',
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  CHAT_RESPONSE_RECEIVED: 'chat_response_received',
  CHAT_ERROR: 'chat_error',

  // Playground - Bundle events
  PLAYGROUND_BUNDLE_SELECTED: 'playground_bundle_selected',
  PLAYGROUND_BUNDLE_EXECUTION_START: 'playground_bundle_execution_start',
  PLAYGROUND_BUNDLE_EXECUTION_COMPLETE: 'playground_bundle_execution_complete',
  
  // Playground - Recipe events
  PLAYGROUND_RECIPE_SELECTED: 'playground_recipe_selected',
  PLAYGROUND_RECIPE_EXECUTION_START: 'playground_recipe_execution_start',
  PLAYGROUND_RECIPE_STEP_COMPLETE: 'playground_recipe_step_complete',
  PLAYGROUND_RECIPE_EXECUTION_COMPLETE: 'playground_recipe_execution_complete',
  
  // Playground - UI events
  PLAYGROUND_PROMPT_SUGGESTION_CLICKED: 'playground_prompt_suggestion_clicked',
  PLAYGROUND_YAML_TOGGLED: 'playground_yaml_toggled',
  PLAYGROUND_PARAMETER_MODIFIED: 'playground_parameter_modified',
  PLAYGROUND_SECTION_TOGGLED: 'playground_section_toggled',
  
  // Header events
  HEADER_DROPDOWN_OPENED: 'header_dropdown_opened',
  HEADER_DROPDOWN_CLOSED: 'header_dropdown_closed',
  HEADER_LINK_CLICKED: 'header_link_clicked',
} as const;

// Export type for TypeScript autocomplete
export type TelemetryEvent = typeof TELEMETRY_EVENTS[keyof typeof TELEMETRY_EVENTS];
