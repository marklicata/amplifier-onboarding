'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWindow from '@/components/ChatWindow';
import bundleMetadata from '@/lib/amplifier/bundle-metadata.json';
import recipeMetadata from '@/lib/amplifier/recipe-metadata.json';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import RecipeCard from '@/components/playground/RecipeCard';
import RecipeViewer from '@/components/playground/RecipeViewer';
import RecipeExecutionPanel from '@/components/playground/RecipeExecutionPanel';
import { Recipe, Bundle, isRecipe, isBundle } from '@/lib/types/recipe';
import { usePlaygroundTracking } from '@/lib/telemetry';

type PlaygroundItem = Bundle | Recipe;

export default function PlaygroundPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PlaygroundItem | null>(null);
  const [bundleYaml, setBundleYaml] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [isLoadingYaml, setIsLoadingYaml] = useState(false);
  const [isYamlCollapsed, setIsYamlCollapsed] = useState(false);
  const [isPromptCollapsed, setIsPromptCollapsed] = useState(false);
  const [executionStatus, setExecutionStatus] = useState<string>('');
  const [recipeInputs, setRecipeInputs] = useState<Record<string, string>>({});
  const [isExecutingRecipe, setIsExecutingRecipe] = useState(false);
  const [bundlesSectionCollapsed, setBundlesSectionCollapsed] = useState(false);
  const [recipesSectionCollapsed, setRecipesSectionCollapsed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Initialize telemetry tracking
  const playgroundTracking = usePlaygroundTracking();

  // Separate bundles and recipes
  const bundles = bundleMetadata.bundles as Bundle[];
  const recipes = recipeMetadata.recipes as Recipe[];

  // Auto-scroll to bottom when new content arrives
  useEffect(() => {
    if (resultRef.current && isExecuting) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [executionResult, isExecuting]);

  // Load YAML content when bundle is selected
  useEffect(() => {
    if (selectedItem && isBundle(selectedItem)) {
      loadBundleYaml(selectedItem.bundlePath);
    }
  }, [selectedItem]);

  const loadBundleYaml = async (bundlePath: string) => {
    setIsLoadingYaml(true);
    try {
      const response = await fetch(`/api/playground/bundle-yaml?path=${encodeURIComponent(bundlePath)}`);
      const data = await response.json();
      if (data.success) {
        setBundleYaml(data.yaml);
      } else {
        setBundleYaml(`# Error loading bundle\n# ${data.error}`);
      }
    } catch (error: any) {
      console.error('Error loading YAML:', error);
      setBundleYaml(`# Error loading bundle\n# ${error.message}`);
    } finally {
      setIsLoadingYaml(false);
    }
  };

  const handleSelectItem = (item: PlaygroundItem) => {
    setSelectedItem(item);
    setCustomPrompt('');
    setExecutionResult(null);
    setExecutionError(null);
    setIsYamlCollapsed(false);
    setIsPromptCollapsed(false);
    setIsExecutingRecipe(false);
    
    // Track selection
    try {
      if (isBundle(item)) {
        playgroundTracking.trackBundleSelected(item.id, item.name);
      } else if (isRecipe(item)) {
        playgroundTracking.trackRecipeSelected(item.id, item.name);
      }
    } catch (error) {
      console.error('Failed to track item selection:', error);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setCustomPrompt(prompt);
    
    // Track prompt suggestion click
    try {
      playgroundTracking.trackPromptSuggestionClicked(prompt);
    } catch (error) {
      console.error('Failed to track prompt suggestion click:', error);
    }
  };

  const handleExecuteBundle = async () => {
    if (!selectedItem || !isBundle(selectedItem) || !customPrompt.trim()) return;

    // Collapse bundle and prompt boxes when execution starts
    setIsYamlCollapsed(true);
    setIsPromptCollapsed(true);

    setIsExecuting(true);
    setExecutionResult('');
    setExecutionError(null);
    setExecutionStatus('Initializing...');

    // Track execution start
    let startTime: number | null = null;
    try {
      startTime = playgroundTracking.trackBundleExecutionStart(selectedItem.id, selectedItem.name);
    } catch (error) {
      console.error('Failed to track bundle execution start:', error);
    }

    try {
      const response = await fetch('/api/playground/execute-bundle-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bundleId: selectedItem.id,
          bundlePath: selectedItem.bundlePath,
          prompt: customPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            const eventLines = line.split('\n');
            const eventLine = eventLines.find(l => l.startsWith('event: '));
            const dataLine = eventLines.find(l => l.startsWith('data: '));

            if (eventLine && dataLine) {
              const eventType = eventLine.substring(7).trim();
              const dataStr = dataLine.substring(6).trim();
              try {
                const data = JSON.parse(dataStr);
                handleStreamEvent(eventType, data);
              } catch (e) {
                console.error('Failed to parse SSE data:', dataStr);
              }
            }
          }
        }
      }
      
      // Track successful completion
      if (startTime !== null) {
        try {
          playgroundTracking.trackBundleExecutionComplete(selectedItem.id, selectedItem.name, startTime, true);
        } catch (error) {
          console.error('Failed to track bundle execution complete:', error);
        }
      }
    } catch (error: any) {
      console.error('Execution error:', error);
      setExecutionError(`Failed to execute: ${error.message}`);
      setIsExecuting(false);
      setExecutionStatus('');
      
      // Track failed completion
      if (startTime !== null) {
        try {
          playgroundTracking.trackBundleExecutionComplete(selectedItem.id, selectedItem.name, startTime, false, error.message);
        } catch (trackError) {
          console.error('Failed to track bundle execution failure:', trackError);
        }
      }
    }
  };

  const handleStreamEvent = (eventType: string, data: any) => {
    switch (eventType) {
      case 'status':
        setExecutionStatus(data.message || 'Processing...');
        break;

      case 'chunk':
        setExecutionResult(prev => (prev || '') + data.content);
        break;

      case 'step':
        setExecutionStatus(data.message || data.step);
        break;

      case 'progress':
        setExecutionStatus(data.message);
        break;

      case 'complete':
        setIsExecuting(false);
        setExecutionStatus('');
        if (data.output && !executionResult) {
          setExecutionResult(data.output);
        }
        break;

      case 'error':
        setIsExecuting(false);
        setExecutionStatus('');
        setExecutionError(data.error);
        break;
    }
  };

  const handleExecuteRecipe = (inputs: Record<string, string>) => {
    setRecipeInputs(inputs);
    setIsExecutingRecipe(true);
    
    // Track recipe execution start
    if (selectedItem && isRecipe(selectedItem)) {
      try {
        playgroundTracking.trackRecipeExecutionStart(selectedItem.id, selectedItem.name);
      } catch (error) {
        console.error('Failed to track recipe execution start:', error);
      }
    }
  };

  const handleRecipeRunAgain = () => {
    // Reset to recipe viewer, keeping recipe selected
    setIsExecutingRecipe(false);
    setRecipeInputs({});
  };

  return (
    <>
      <Header onOpenChat={() => setIsChatOpen(true)} />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-2">
              Amplifier Playground
            </h1>
            <p className="text-lg text-blue-100">
              Explore bundles and recipes - single-step agents or multi-step workflows
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content Area - 2/3 width */}
            <div className="flex-1" style={{ minWidth: 0 }}>
              {selectedItem ? (
                <>
                  {/* Show Recipe Viewer for recipes */}
                  {isRecipe(selectedItem) ? (
                    <>
                      {isExecutingRecipe ? (
                        <RecipeExecutionPanel
                          recipe={selectedItem}
                          inputs={recipeInputs}
                          onComplete={() => setIsExecutingRecipe(false)}
                          onRunAgain={handleRecipeRunAgain}
                        />
                      ) : (
                        <RecipeViewer
                          recipe={selectedItem}
                          onExecute={handleExecuteRecipe}
                          isExecuting={isExecutingRecipe}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      {/* Bundle YAML Display Box */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{selectedItem.icon}</span>
                            <div>
                              <h2 className="text-xl font-bold text-gray-900">
                                {selectedItem.name}
                              </h2>
                              <p className="text-sm text-gray-600">{selectedItem.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
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
                            className="w-full text-left flex items-center justify-between mb-3 hover:bg-gray-50 p-2 rounded transition-colors"
                          >
                            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <span>📄</span>
                              Bundle Configuration (YAML)
                            </h3>
                            <span className="text-gray-600 text-xl">
                              {isYamlCollapsed ? '+' : '−'}
                            </span>
                          </button>
                          {!isYamlCollapsed && (
                            isLoadingYaml ? (
                              <div className="bg-gray-50 rounded-lg p-8 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <p className="text-sm text-gray-600 mt-2">Loading bundle configuration...</p>
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
                                  {bundleYaml}
                                </SyntaxHighlighter>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Prompt Box */}
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <button
                          onClick={() => setIsPromptCollapsed(!isPromptCollapsed)}
                          className="w-full border-b border-gray-200 px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <span>✍️</span>
                            Your Prompt
                          </h3>
                          <span className="text-gray-600 text-xl">
                            {isPromptCollapsed ? '+' : '−'}
                          </span>
                        </button>
                        {!isPromptCollapsed && (
                          <div className="p-6">
                          {/* Encouragement Box */}
                          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg p-4 mb-4">
                            <p className="text-orange-900 font-bold text-lg mb-2">
                              🔥 Try to Break Amplifier!
                            </p>
                            <p className="text-orange-800 text-sm">
                              Don't hold back! Test edge cases, ask weird questions, push the limits. 
                              This is your chance to explore what Amplifier can (and can't) do. 
                              The more creative you get, the more you'll learn!
                            </p>
                          </div>

                          {/* Suggested Prompts */}
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Quick Start Prompts:</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedItem.suggestedPrompts?.map((prompt, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handlePromptSelect(prompt)}
                                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                    customPrompt === prompt
                                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                                      : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                                  }`}
                                >
                                  {prompt.substring(0, 50)}{prompt.length > 50 ? '...' : ''}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Prompt Textarea */}
                          <textarea
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder="Type your prompt here... or click a suggested prompt above"
                            className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white resize-none font-mono text-sm"
                          />
                          
                          <div className="flex justify-between items-center mt-4">
                            <p className="text-sm text-gray-500">
                              {customPrompt.length} characters
                            </p>
                            <button
                              onClick={handleExecuteBundle}
                              disabled={!customPrompt.trim() || isExecuting}
                              className={`px-8 py-3 rounded-lg font-bold text-white transition-all text-lg ${
                                !customPrompt.trim() || isExecuting
                                  ? 'bg-gray-300 cursor-not-allowed'
                                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                              }`}
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
                                '🚀 Execute'
                              )}
                            </button>
                          </div>
                        </div>
                        )}
                      </div>

                      {/* Results Section - Separate Box */}
                      {(executionResult || executionError || isExecuting) && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                          <div className="border-b border-gray-200 px-6 py-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                              <span>📊</span>
                              {isExecuting ? 'Streaming Result...' : 'Result'}
                            </h3>
                          </div>
                          <div className="p-6">
                            {/* Execution Status */}
                            {isExecuting && executionStatus && (
                              <div className="mb-3 flex items-center gap-2 text-sm text-blue-600">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>{executionStatus}</span>
                              </div>
                            )}

                            {executionError ? (
                              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                                <p className="text-red-800 font-bold mb-2">❌ Error:</p>
                                <pre className="text-red-700 text-sm whitespace-pre-wrap font-mono">
                                  {executionError}
                                </pre>
                              </div>
                            ) : (
                              <div
                                ref={resultRef}
                                className="bg-white border border-gray-200 rounded-lg p-6"
                                style={{ maxHeight: '600px', overflowY: 'auto' }}
                              >
                                <div className="prose prose-sm max-w-none">
                                  <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                      code(props) {
                                        const {children, className, node, ...rest} = props as any;
                                        const match = /language-(\w+)/.exec(className || '');
                                        return match ? (
                                          <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            customStyle={{
                                              margin: '1rem 0',
                                              borderRadius: '0.5rem',
                                              fontSize: '0.875rem',
                                            }}
                                          >
                                            {String(children).replace(/\n$/, '')}
                                          </SyntaxHighlighter>
                                        ) : (
                                          <code className={className} {...rest}>
                                            {children}
                                          </code>
                                        );
                                      }
                                    }}
                                  >
                                    {executionResult}
                                  </ReactMarkdown>
                                  {isExecuting && executionResult && (
                                    <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse ml-1 align-middle"></span>
                                  )}
                                </div>
                                {isExecuting && !executionResult && (
                                  <div className="flex items-center justify-center py-8 text-gray-500">
                                    <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                // No item selected - show welcome message
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <div className="text-6xl mb-4">👉</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Select a Bundle or Recipe to Get Started
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto mb-4">
                    Choose from the list on the right to explore configurations and execute.
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p><strong>Bundles:</strong> Single-step AI agents (solid border)</p>
                    <p><strong>Recipes:</strong> Multi-step workflows (dashed border)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Bundle & Recipe List */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:sticky lg:top-6">
                <div className="border-b border-gray-200 px-4 py-4">
                  <h3 className="text-lg font-bold text-gray-900">Available Bundles & Recipes</h3>
                  <p className="text-xs text-gray-600 mt-1">Click to select</p>
                </div>
                <div className="max-h-[400px] lg:max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Bundles Section */}
                  <div className="border-b border-gray-200">
                    <button
                      onClick={() => setBundlesSectionCollapsed(!bundlesSectionCollapsed)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <span className="font-semibold text-gray-900 text-sm">
                        Bundles ({bundles.length})
                      </span>
                      <span className="text-gray-600 text-xl">
                        {bundlesSectionCollapsed ? '+' : '−'}
                      </span>
                    </button>
                    {!bundlesSectionCollapsed && (
                      <div className="p-3 space-y-2">
                        {bundles.map((bundle) => (
                          <button
                            key={bundle.id}
                            onClick={() => handleSelectItem(bundle)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                              selectedItem?.id === bundle.id
                                ? 'border-blue-500 bg-blue-500 shadow-lg'
                                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-3xl">{bundle.icon}</div>
                              <div className="flex-1 min-w-0">
                                <h4 className={`font-bold mb-1 ${
                                  selectedItem?.id === bundle.id ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {bundle.name}
                                </h4>
                                <p className={`text-xs ${
                                  selectedItem?.id === bundle.id ? 'text-white' : 'text-gray-600'
                                }`}>
                                  {bundle.description.substring(0, 80)}...
                                </p>
                                <div className={`mt-2 inline-block px-2 py-1 rounded text-xs font-medium ${
                                  selectedItem?.id === bundle.id 
                                    ? 'bg-white bg-opacity-20 text-white' 
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {bundle.tier}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recipes Section */}
                  <div>
                    <button
                      onClick={() => setRecipesSectionCollapsed(!recipesSectionCollapsed)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <span className="font-semibold text-gray-900 text-sm">
                        Recipes ({recipes.length})
                      </span>
                      <span className="text-gray-600 text-xl">
                        {recipesSectionCollapsed ? '+' : '−'}
                      </span>
                    </button>
                    {!recipesSectionCollapsed && (
                      <div className="p-3 space-y-2">
                        {recipes.map((recipe) => (
                          <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            isSelected={selectedItem?.id === recipe.id}
                            onSelect={() => handleSelectItem(recipe)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-3 text-xs text-gray-700">
                  ...more bundles & recipes coming soon!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <Footer />
    </>
  );
}
