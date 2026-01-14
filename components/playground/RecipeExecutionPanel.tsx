'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Recipe, StepStatus } from '@/lib/types/recipe';

interface RecipeExecutionPanelProps {
  recipe: Recipe;
  inputs: Record<string, string>;
  onComplete?: () => void;
  onRunAgain?: () => void;
}

export default function RecipeExecutionPanel({ recipe, inputs, onComplete, onRunAgain }: RecipeExecutionPanelProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [steps, setSteps] = useState<StepStatus[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStepOutput, setCurrentStepOutput] = useState('');
  const [completedStepOutputs, setCompletedStepOutputs] = useState<Record<string, string>>({});
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [totalTimeMs, setTotalTimeMs] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new content arrives
  useEffect(() => {
    if (outputRef.current && isExecuting) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [currentStepOutput, isExecuting]);

  // Initialize steps and start execution
  useEffect(() => {
    initializeAndExecute();
  }, []);

  const initializeAndExecute = () => {
    // Initialize step statuses
    const initialSteps: StepStatus[] = recipe.bundles.flatMap(bundle => 
      bundle.usedInSteps.map(stepId => ({
        id: stepId,
        name: stepId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        bundleId: bundle.id,
        bundleIcon: bundle.icon,
        status: 'pending' as const,
      }))
    );
    
    setSteps(initialSteps);
    setStartTime(Date.now());
    executeRecipe();
  };

  const executeRecipe = async () => {
    setIsExecuting(true);
    setError(null);
    setCurrentStepOutput('');

    try {
      const response = await fetch('/api/playground/execute-recipe-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId: recipe.id,
          recipePath: recipe.recipePath,
          inputs,
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

    } catch (err: any) {
      console.error('Recipe execution error:', err);
      setError(err.message || 'Recipe execution failed');
      setIsExecuting(false);
    }
  };

  const handleStreamEvent = (eventType: string, data: any) => {
    switch (eventType) {
      case 'step_start':
        // Mark step as in progress
        setCurrentStepIndex(data.step - 1);
        setCurrentStepOutput('');
        setSteps(prev => prev.map((s, idx) => 
          idx === data.step - 1 
            ? { ...s, status: 'in_progress' }
            : s
        ));
        break;

      case 'chunk':
        // Append content chunk to current step
        setCurrentStepOutput(prev => prev + data.content);
        break;

      case 'step_complete':
        // Mark step complete and save output
        const stepIndex = data.step - 1;
        setSteps(prev => prev.map((s, idx) => 
          idx === stepIndex
            ? { ...s, status: 'complete', timing: data.timing, output: data.output }
            : s
        ));
        // Save completed output
        setCompletedStepOutputs(prev => ({
          ...prev,
          [steps[stepIndex]?.id || `step-${stepIndex}`]: data.output || currentStepOutput
        }));
        break;

      case 'complete':
        // All steps complete
        setIsExecuting(false);
        if (startTime) {
          setTotalTimeMs(Date.now() - startTime);
        }
        // Expand last step by default
        if (steps.length > 0) {
          setExpandedSteps(new Set([steps[steps.length - 1].id]));
        }
        // DON'T auto-call onComplete - let user dismiss manually
        break;

      case 'error':
        // Execution error
        setIsExecuting(false);
        setError(data.error);
        // Mark current step as error
        if (data.step) {
          setSteps(prev => prev.map((s, idx) => 
            idx === data.step - 1
              ? { ...s, status: 'error', error: data.error }
              : s
          ));
        }
        break;

      case 'status':
      case 'progress':
        // Informational messages (could display in UI)
        console.log(`[${eventType}]`, data.message);
        break;
    }
  };

  const toggleStepExpanded = (stepId: string) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  const handleExport = () => {
    // Create markdown file with all results
    let markdown = `# ${recipe.name}\n\n`;
    markdown += `**Executed:** ${new Date().toISOString()}\n`;
    markdown += `**Total Time:** ${totalTimeMs ? (totalTimeMs / 1000).toFixed(1) : 'N/A'}s\n\n`;
    markdown += `## Inputs\n\n`;
    Object.entries(inputs).forEach(([key, value]) => {
      markdown += `- **${key}:** ${value}\n`;
    });
    markdown += `\n---\n\n`;

    steps.forEach((step, idx) => {
      markdown += `## Step ${idx + 1}: ${step.name}\n\n`;
      markdown += `**Bundle:** ${step.bundleIcon} ${step.bundleId}\n`;
      markdown += `**Status:** ${step.status}\n`;
      if (step.timing) {
        markdown += `**Time:** ${step.timing}s\n`;
      }
      markdown += `\n`;
      const output = completedStepOutputs[step.id] || step.output || '';
      markdown += output + '\n\n';
      markdown += `---\n\n`;
    });

    // Download file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.id}-results.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: StepStatus['status']) => {
    switch (status) {
      case 'complete': return '✅';
      case 'in_progress': return '🔄';
      case 'pending': return '⏳';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  const getStatusClass = (status: StepStatus['status']) => {
    switch (status) {
      case 'complete': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'pending': return 'text-gray-400';
      case 'error': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span>📊</span>
          {isExecuting 
            ? `Recipe Execution (Step ${currentStepIndex + 1}/${steps.length})` 
            : error 
              ? 'Recipe Failed ❌'
              : 'Recipe Complete ✅'
          }
        </h3>
      </div>

      {/* Content */}
      <div ref={outputRef} className="px-6 py-4 max-h-[600px] overflow-y-auto">
        
        {/* Progress Tracker */}
        <div className="mb-6 space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Progress:</h4>
          {steps.map((step, idx) => (
            <div key={step.id} className={`flex items-center gap-2 text-sm ${getStatusClass(step.status)}`}>
              <span className={step.status === 'in_progress' ? 'animate-pulse' : ''}>
                {getStatusIcon(step.status)}
              </span>
              <span className="flex-1">
                Step {idx + 1}: {step.name} [{step.bundleIcon} {step.bundleId}]
              </span>
              {step.timing && (
                <span className="text-xs text-gray-500">
                  ({step.timing}s)
                </span>
              )}
            </div>
          ))}
          {totalTimeMs && (
            <div className="text-sm text-gray-600 mt-2 pt-2 border-t border-gray-200">
              Total time: {(totalTimeMs / 1000).toFixed(1)}s
            </div>
          )}
        </div>

        {/* Current Step Output (while executing) */}
        {isExecuting && currentStepOutput && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              Step {currentStepIndex + 1} Output 
              {steps[currentStepIndex] && (
                <span className="text-xs font-normal text-gray-500">
                  (using {steps[currentStepIndex].bundleIcon} {steps[currentStepIndex].bundleId})
                </span>
              )}
            </h4>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code(props) {
                      const {children, className, ...rest} = props as any;
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
                  {currentStepOutput}
                </ReactMarkdown>
                <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse ml-1 align-middle"></span>
              </div>
            </div>
          </div>
        )}

        {/* Completed Steps (collapsible) */}
        {!isExecuting && steps.some(s => s.status === 'complete') && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Step Results:</h4>
            {steps.map((step, idx) => {
              if (step.status !== 'complete') return null;
              const isExpanded = expandedSteps.has(step.id);
              const output = completedStepOutputs[step.id] || step.output || '';

              return (
                <div key={step.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleStepExpanded(step.id)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-900 flex items-center gap-2">
                      {isExpanded ? '▼' : '▶'} Step {idx + 1}: {step.name}
                      <span className="text-xs text-gray-500">
                        ({step.bundleIcon} {step.bundleId}, {step.timing}s)
                      </span>
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-200">
                      <div className="prose prose-sm max-w-none mt-3">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code(props) {
                              const {children, className, ...rest} = props as any;
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
                          {output}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Recipe Execution Failed</span>
            </div>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons (when complete or error) */}
        {!isExecuting && (
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleExport}
              disabled={steps.filter(s => s.status === 'complete').length === 0}
              className="px-4 py-2 rounded-lg font-medium text-purple-600 border-2 border-purple-600 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📥 Export Results
            </button>
            <button
              onClick={onRunAgain}
              className="px-4 py-2 rounded-lg font-medium text-gray-600 border-2 border-gray-300 hover:bg-gray-50 transition-colors"
            >
              🔄 Run Again
            </button>
            {onComplete && (
              <button
                onClick={onComplete}
                className="px-4 py-2 rounded-lg font-medium text-blue-600 border-2 border-blue-600 hover:bg-blue-50 transition-colors ml-auto"
              >
                ✓ Close
              </button>
            )}
          </div>
        )}

        {/* Loading indicator for first step */}
        {isExecuting && !currentStepOutput && steps.length > 0 && (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <svg className="animate-spin h-8 w-8 text-purple-600 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Starting {steps[currentStepIndex]?.name}...</span>
          </div>
        )}
      </div>
    </div>
  );
}
