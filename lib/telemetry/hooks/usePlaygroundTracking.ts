/**
 * Playground Tracking Hook
 * 
 * Custom React hook for tracking playground-specific events including
 * bundle/recipe selection, execution, and UI interactions.
 */

import { useMemo } from 'react';
import { trackEvent } from '../tracking';
import { getOrCreateIdentity } from '../identity';
import { TELEMETRY_EVENTS } from '../eventNaming';

export interface PlaygroundContext {
  itemId?: string;
  itemName?: string;
  itemType?: 'bundle' | 'recipe';
}

export interface PlaygroundTrackingFunctions {
  // Bundle tracking
  trackBundleSelected: (bundleId: string, bundleName: string) => void;
  trackBundleExecutionStart: (bundleId: string, bundleName: string) => number;
  trackBundleExecutionComplete: (bundleId: string, bundleName: string, startTime: number, success: boolean, error?: string) => void;
  
  // Recipe tracking
  trackRecipeSelected: (recipeId: string, recipeName: string) => void;
  trackRecipeExecutionStart: (recipeId: string, recipeName: string) => number;
  trackRecipeStepComplete: (recipeId: string, recipeName: string, stepName: string, stepIndex: number) => void;
  trackRecipeExecutionComplete: (recipeId: string, recipeName: string, startTime: number, success: boolean, error?: string) => void;
  
  // UI interaction tracking
  trackPromptSuggestionClicked: (suggestion: string) => void;
  trackYamlToggled: (isOpen: boolean) => void;
  trackParameterModified: (parameterName: string, parameterType: string) => void;
  trackSectionToggled: (sectionName: string, isOpen: boolean) => void;
}

/**
 * Custom hook for playground telemetry tracking
 * 
 * @param context - Optional context about the current item being viewed/executed
 * @returns Object with tracking functions
 * 
 * @example
 * ```tsx
 * const tracking = usePlaygroundTracking({
 *   itemId: 'my-bundle',
 *   itemName: 'My Bundle',
 *   itemType: 'bundle'
 * });
 * 
 * // Track bundle selection
 * tracking.trackBundleSelected('my-bundle', 'My Bundle');
 * 
 * // Track execution
 * const startTime = tracking.trackBundleExecutionStart('my-bundle', 'My Bundle');
 * // ... execute bundle ...
 * tracking.trackBundleExecutionComplete('my-bundle', 'My Bundle', startTime, true);
 * ```
 */
export const usePlaygroundTracking = (context?: PlaygroundContext): PlaygroundTrackingFunctions => {
  // Get identity once and memoize
  const identity = useMemo(() => getOrCreateIdentity(), []);
  const pagePath = typeof window !== 'undefined' ? window.location.pathname : '';

  // Base properties that are included in all events
  const baseProperties = useMemo(() => ({
    session_id: identity.session_id,
    page_path: pagePath,
    ...(context?.itemId && { context_item_id: context.itemId }),
    ...(context?.itemName && { context_item_name: context.itemName }),
    ...(context?.itemType && { context_item_type: context.itemType }),
  }), [identity.session_id, pagePath, context]);

  return useMemo(() => ({
    // Bundle tracking functions
    trackBundleSelected: (bundleId: string, bundleName: string) => {
      trackEvent(TELEMETRY_EVENTS.PLAYGROUND_BUNDLE_SELECTED, {
        ...baseProperties,
        bundle_id: bundleId,
        bundle_name: bundleName,
      });
    },

    trackBundleExecutionStart: (bundleId: string, bundleName: string): number => {
      const startTime = performance.now();
      trackEvent(TELEMETRY_EVENTS.PLAYGROUND_BUNDLE_EXECUTION_START, {
        ...baseProperties,
        bundle_id: bundleId,
        bundle_name: bundleName,
        start_time: startTime,
      });
      return startTime;
    },

    trackBundleExecutionComplete: (bundleId: string, bundleName: string, startTime: number, success: boolean, error?: string) => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      trackEvent(TELEMETRY_EVENTS.PLAYGROUND_BUNDLE_EXECUTION_COMPLETE, {
        ...baseProperties,
        bundle_id: bundleId,
        bundle_name: bundleName,
        duration_ms: Math.round(duration),
        success,
        ...(error && { error }),
      });
    },

    // Recipe tracking functions
    trackRecipeSelected: (recipeId: string, recipeName: string) => {
      trackEvent(TELEMETRY_EVENTS.PLAYGROUND_RECIPE_SELECTED, {
        ...baseProperties,
        recipe_id: recipeId,
        recipe_name: recipeName,
      });
    },

    trackRecipeExecutionStart: (recipeId: string, recipeName: string): number => {
      const startTime = performance.now();
      trackEvent(TELEMETRY_EVENTS.PLAYGROUND_RECIPE_EXECUTION_START, {
        ...baseProperties,
        recipe_id: recipeId,
        recipe_name: recipeName,
        start_time: startTime,
      });
      return startTime;
    },

    trackRecipeStepComplete: (recipeId: string, recipeName: string, stepName: string, stepIndex: number) => {
      trackEvent(TELEMETRY_EVENTS.PLAYGROUND_RECIPE_STEP_COMPLETE, {
        ...baseProperties,
        recipe_id: recipeId,
        recipe_name: recipeName,
        step_name: stepName,
        step_index: stepIndex,
      });
    },

    trackRecipeExecutionComplete: (recipeId: string, recipeName: string, startTime: number, success: boolean, error?: string) => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      trackEvent(TELEMETRY_EVENTS.PLAYGROUND_RECIPE_EXECUTION_COMPLETE, {
        ...baseProperties,
        recipe_id: recipeId,
        recipe_name: recipeName,
        duration_ms: Math.round(duration),
        success,
        ...(error && { error }),
      });
    },

    // UI interaction tracking functions
    trackPromptSuggestionClicked: (suggestion: string) => {
      trackEvent(TELEMETRY_EVENTS.PLAYGROUND_PROMPT_SUGGESTION_CLICKED, {
        ...baseProperties,
        suggestion,
      });
    },

    trackYamlToggled: (isOpen: boolean) => {
      trackEvent(TELEMETRY_EVENTS.PLAYGROUND_YAML_TOGGLED, {
        ...baseProperties,
        is_open: isOpen,
      });
    },

    trackParameterModified: (parameterName: string, parameterType: string) => {
      trackEvent(TELEMETRY_EVENTS.PLAYGROUND_PARAMETER_MODIFIED, {
        ...baseProperties,
        parameter_name: parameterName,
        parameter_type: parameterType,
      });
    },

    trackSectionToggled: (sectionName: string, isOpen: boolean) => {
      trackEvent(TELEMETRY_EVENTS.PLAYGROUND_SECTION_TOGGLED, {
        ...baseProperties,
        section_name: sectionName,
        is_open: isOpen,
      });
    },
  }), [baseProperties]);
};
