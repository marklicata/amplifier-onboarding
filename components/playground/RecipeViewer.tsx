'use client';

import { useState, useEffect } from 'react';
import { Recipe } from '@/lib/types/recipe';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { usePlaygroundTracking } from '@/lib/telemetry';

interface RecipeViewerProps {
  recipe: Recipe;
  onExecute: (inputs: Record<string, string>) => void;
  isExecuting: boolean;
}

export default function RecipeViewer({ recipe, onExecute, isExecuting }: RecipeViewerProps) {
  const [recipeYaml, setRecipeYaml] = useState<string>('');
  const [isLoadingYaml, setIsLoadingYaml] = useState(false);
  const [isYamlCollapsed, setIsYamlCollapsed] = useState(true); // Collapsed by default
  const [isBundlesCollapsed, setIsBundlesCollapsed] = useState(false);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  
  // Initialize telemetry tracking
  const playgroundTracking = usePlaygroundTracking({
    itemId: recipe.id,
    itemName: recipe.name,
    itemType: 'recipe'
  });

  // Load recipe YAML when recipe changes
  useEffect(() => {
    loadRecipeYaml();
    // Initialize inputs with empty values
    const initialInputs: Record<string, string> = {};
    recipe.inputs.forEach(input => {
      initialInputs[input.name] = '';
    });
    setInputs(initialInputs);
  }, [recipe.id]);

  const loadRecipeYaml = async () => {
    setIsLoadingYaml(true);
    try {
      const response = await fetch(`/api/playground/recipe-yaml?path=${encodeURIComponent(recipe.recipePath)}`);
      const data = await response.json();
      if (data.success) {
        setRecipeYaml(data.yaml);
      } else {
        setRecipeYaml(`# Error loading recipe\n# ${data.error}`);
      }
    } catch (error: any) {
      console.error('Error loading recipe YAML:', error);
      setRecipeYaml(`# Error loading recipe\n# ${error.message}`);
    } finally {
      setIsLoadingYaml(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setInputs(prev => ({ ...prev, [name]: value }));
    
    // Track parameter modification
    try {
      const input = recipe.inputs.find(i => i.name === name);
      playgroundTracking.trackParameterModified(name, input?.type || 'text');
    } catch (error) {
      console.error('Failed to track parameter modification:', error);
    }
  };

  const handleSuggestedInput = (inputName: string, value: string) => {
    setInputs(prev => ({ ...prev, [inputName]: value }));
    
    // Track suggested input selection as prompt suggestion
    try {
      playgroundTracking.trackPromptSuggestionClicked(value);
    } catch (error) {
      console.error('Failed to track suggested input click:', error);
    }
  };

  const handleExecute = () => {
    // Validate required inputs
    const missingInputs = recipe.inputs.filter(input => 
      input.required && !inputs[input.name]?.trim()
    );

    if (missingInputs.length > 0) {
      alert(`Please provide: ${missingInputs.map(i => i.label).join(', ')}`);
      return;
    }

    onExecute(inputs);
  };

  const allRequiredInputsFilled = recipe.inputs
    .filter(input => input.required)
    .every(input => inputs[input.name]?.trim());

  return (
    <div data-track-context="recipe-viewer">
      {/* Recipe Header */}
      <div className="bg-white rounded-lg shadow-sm border-2 border-purple-300 mb-6">
        <div className="border-b border-purple-200 px-6 py-4">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">{recipe.icon}</span>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {recipe.name}
              </h2>
              <p className="text-sm text-gray-600">{recipe.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300">
              RECIPE • {recipe.steps} steps • {recipe.bundles.length} bundles
            </div>
            <div className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
              {recipe.tier}
            </div>
            <div className="text-xs text-gray-500">
              ⏱️ ~{recipe.estimatedTimeMinutes} min
            </div>
          </div>
        </div>
      </div>

      {/* Recipe YAML Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <button
          onClick={() => {
            const newState = !isYamlCollapsed;
            setIsYamlCollapsed(newState);
            try {
              playgroundTracking.trackYamlToggled(!newState);
            } catch (error) {
              console.error('Failed to track YAML toggle:', error);
            }
          }}
          className="w-full text-left flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          data-track-label="yaml-toggle"
        >
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>📄</span>
            Recipe Configuration (YAML)
          </h3>
          <span className="text-gray-600 text-xl">
            {isYamlCollapsed ? '+' : '−'}
          </span>
        </button>
        {!isYamlCollapsed && (
          <div className="px-6 pb-6">
            {isLoadingYaml ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="text-sm text-gray-600 mt-2">Loading recipe configuration...</p>
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden">
                <SyntaxHighlighter
                  language="yaml"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                  }}
                  showLineNumbers={true}
                >
                  {recipeYaml}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bundles Used in This Recipe */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <button
          onClick={() => {
            const newState = !isBundlesCollapsed;
            setIsBundlesCollapsed(newState);
            try {
              playgroundTracking.trackSectionToggled('bundles', !newState);
            } catch (error) {
              console.error('Failed to track bundles section toggle:', error);
            }
          }}
          className="w-full text-left flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          data-track-label="bundles-toggle"
        >
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>🔧</span>
            Bundles Used in This Recipe
          </h3>
          <span className="text-gray-600 text-xl">
            {isBundlesCollapsed ? '+' : '−'}
          </span>
        </button>
        {!isBundlesCollapsed && (
          <div className="px-6 pb-6">
            <p className="text-sm text-gray-600 mb-4">
              This recipe uses {recipe.bundles.length} bundle{recipe.bundles.length !== 1 ? 's' : ''} across {recipe.steps} steps:
            </p>
            <div className="space-y-3">
              {recipe.bundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="border-2 border-gray-200 bg-white rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{bundle.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{bundle.name}</h4>
                      <p className="text-xs text-gray-600">
                        Used in: {bundle.usedInSteps.map((stepId, idx) => (
                          <span key={stepId}>
                            {idx > 0 && ', '}
                            <span className="font-medium">{stepId}</span>
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recipe Inputs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>✍️</span>
            Recipe Input
          </h3>
        </div>
        <div className="p-6">
          {recipe.inputs.map((input) => (
            <div key={input.name} className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {input.label}
                {input.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {/* Suggested inputs if available */}
              {input.name === 'topic' && recipe.suggestedInputs && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Quick topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {recipe.suggestedInputs.map((suggested, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedInput(input.name, suggested)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                          inputs[input.name] === suggested
                            ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-purple-400 hover:bg-purple-50'
                        }`}
                        data-track-label="suggested-input"
                      >
                        {suggested}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input field */}
              {input.type === 'textarea' ? (
                <textarea
                  value={inputs[input.name] || ''}
                  onChange={(e) => handleInputChange(input.name, e.target.value)}
                  placeholder={input.placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white resize-none font-mono text-sm"
                  rows={4}
                  data-track-label={`parameter-${input.name}`}
                />
              ) : (
                <input
                  type="text"
                  value={inputs[input.name] || ''}
                  onChange={(e) => handleInputChange(input.name, e.target.value)}
                  placeholder={input.placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
                  data-track-label={`parameter-${input.name}`}
                />
              )}
            </div>
          ))}

          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-500">
              {recipe.inputs.filter(i => i.required).every(i => inputs[i.name]?.trim()) 
                ? '✅ Ready to execute' 
                : '⚠️ Fill in required fields'}
            </p>
            <button
              onClick={handleExecute}
              disabled={!allRequiredInputsFilled || isExecuting}
              className={`px-8 py-3 rounded-lg font-bold text-white transition-all text-lg ${
                !allRequiredInputsFilled || isExecuting
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl'
              }`}
              data-track-label="execute-recipe"
            >
              {isExecuting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Executing...
                </span>
              ) : (
                '🚀 Execute Recipe'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
