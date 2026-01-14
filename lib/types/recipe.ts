/**
 * Recipe type definitions for the Amplifier Playground
 */

export interface Recipe {
  id: string;
  name: string;
  description: string;
  recipePath: string;
  icon: string;
  color: string;
  tier: 'beginner' | 'intermediate' | 'advanced';
  estimatedTimeMinutes: number;
  steps: number;
  bundles: RecipeBundle[];
  inputs: RecipeInput[];
  suggestedInputs?: string[];
}

export interface RecipeBundle {
  id: string;
  name: string;
  icon: string;
  usedInSteps: string[];
}

export interface RecipeInput {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface RecipeExecutionState {
  currentStep: number;
  totalSteps: number;
  steps: StepStatus[];
  isExecuting: boolean;
  error?: string;
  totalTimeMs?: number;
}

export interface StepStatus {
  id: string;
  name: string;
  bundleId: string;
  bundleIcon?: string;
  status: 'pending' | 'in_progress' | 'complete' | 'error';
  output?: string;
  timing?: number;
  error?: string;
}

export interface RecipeMetadata {
  recipes: Recipe[];
}

// Type guard to check if an item is a Recipe
export function isRecipe(item: any): item is Recipe {
  return item && 'recipePath' in item && 'steps' in item && 'bundles' in item;
}

// Type guard to check if an item is a Bundle
export function isBundle(item: any): item is Bundle {
  return item && 'bundlePath' in item && !('steps' in item);
}

// Bundle type for comparison (existing type from bundle-metadata.json)
export interface Bundle {
  id: string;
  name: string;
  description: string;
  bundlePath: string;
  icon: string;
  color: string;
  features: string[];
  suggestedPrompts: string[];
  tier: 'beginner' | 'intermediate' | 'advanced';
}
