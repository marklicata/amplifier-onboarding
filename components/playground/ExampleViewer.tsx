'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ExampleContent {
  everyone?: any;
  developers?: any;
  experts?: any;
}

interface ExampleDetails {
  id: string;
  title: string;
  tier: number;
  category: string;
  description: string;
  estimatedTimeMinutes: number;
  difficulty: string;
  githubUrl: string;
  content: ExampleContent;
  execution: {
    requiresInput: boolean;
    defaultPrompt?: string;
    estimatedDuration: string;
    prerequisites: string[];
  };
}

type ViewMode = 'everyone' | 'developers' | 'experts';

interface ExampleViewerProps {
  exampleId: string;
  onExecute: (exampleId: string, inputs?: any) => void;
  executing: boolean;
}

const modeLabels = {
  everyone: { label: 'Everyone', icon: '👥', color: 'bg-green-100 text-green-800' },
  developers: { label: 'Developers', icon: '💻', color: 'bg-blue-100 text-blue-800' },
  experts: { label: 'Experts', icon: '🚀', color: 'bg-purple-100 text-purple-800' },
};

export default function ExampleViewer({ exampleId, onExecute, executing }: ExampleViewerProps) {
  const [example, setExample] = useState<ExampleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('developers');
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    loadExample();
  }, [exampleId]);

  const loadExample = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/playground/examples/${exampleId}`);
      if (!response.ok) {
        throw new Error('Failed to load example details');
      }
      const data = await response.json();
      setExample(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = () => {
    if (!example) return;

    const inputs: any = {};

    // Add custom input if provided
    if (example.execution.requiresInput && customInput) {
      if (example.id === '10_meeting_notes') {
        inputs.meeting_notes = customInput;
      } else {
        inputs.prompt = customInput;
      }
    }

    // Execute with streaming enabled by default
    onExecute(example.id, inputs);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !example) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Failed to load example: {error || 'Unknown error'}</p>
      </div>
    );
  }

  const content = example.content[viewMode];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{example.title}</h2>
          <a
            href={example.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View on GitHub</span>
            <span>→</span>
          </a>
        </div>
        <p className="text-gray-600">{example.description}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>⏱️ {example.estimatedTimeMinutes} min</span>
          <span>•</span>
          <span>Tier {example.tier}</span>
          <span>•</span>
          <span className="capitalize">{example.difficulty}</span>
        </div>
      </div>

      {/* Execute Button - Moved to top */}
      <div className="flex gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <button
          onClick={handleExecute}
          disabled={executing}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
            executing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {executing ? (
            <>
              <span className="inline-block animate-spin mr-2">⏳</span>
              Executing...
            </>
          ) : (
            <>▶️ Run Example</>
          )}
        </button>

        {example.execution.requiresInput && !showCustomInput && (
          <button
            onClick={() => setShowCustomInput(true)}
            className="px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ⚙️ Custom Prompt
          </button>
        )}
      </div>

      {/* Input Section (if required) - Moved to top */}
      {example.execution.requiresInput && showCustomInput && (
        <div className="space-y-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <label className="font-medium text-gray-900">Custom Prompt</label>
            <button
              onClick={() => {
                setShowCustomInput(false);
                setCustomInput('');
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ✕ Hide
            </button>
          </div>
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder={example.id === '10_meeting_notes' ? 'Paste your meeting notes here...' : 'Enter your custom prompt...'}
            className="w-full h-40 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </div>
      )}

      {/* Mode Selector */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1 overflow-x-auto">
          {(Object.keys(modeLabels) as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                viewMode === mode
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-1">{modeLabels[mode].icon}</span>
              {modeLabels[mode].label}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on mode */}
      <div className="space-y-4">
        {viewMode === 'everyone' && content && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What This Does</h3>
              <p className="text-blue-800">{content.valueProposition}</p>
            </div>
            
            {content.howItWorks && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  {content.howItWorks.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
            
            {content.whatYouGet && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">What You'll Get</h3>
                <ul className="list-disc list-inside space-y-1 text-green-800">
                  {content.whatYouGet.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {viewMode === 'developers' && content && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Value Proposition</h3>
              <p className="text-blue-800">{content.valueProposition}</p>
            </div>
            
            {content.codeOverview && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Code Structure</h3>
                {content.codeOverview.structure && (
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 mb-4">
                    {content.codeOverview.structure.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                )}
                {content.codeOverview.keyFunctions && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">Key Functions:</h4>
                    {content.codeOverview.keyFunctions.map((fn: any, i: number) => (
                      <div key={i} className="ml-4 text-sm">
                        <code className="text-purple-600 font-mono">{fn.name}</code>
                        <p className="text-gray-600">{fn.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {content.codeSnippet && (
              <div className="rounded-lg overflow-hidden border border-gray-700">
                <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                  Python
                </div>
                <SyntaxHighlighter
                  language="python"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    fontSize: '0.875rem',
                    lineHeight: '1.5'
                  }}
                  showLineNumbers
                >
                  {content.codeSnippet}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        )}

        {viewMode === 'experts' && content && (
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">Architecture</h3>
                <span className="text-sm text-gray-500">{content.complexity}</span>
              </div>
              <p className="text-gray-700">{content.architecture}</p>
            </div>
            
            {content.fullCode && (
              <div className="rounded-lg overflow-hidden border border-gray-700">
                <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
                  <span className="text-xs text-gray-400">Full Source Code</span>
                  <a
                    href={content.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    View on GitHub →
                  </a>
                </div>
                <SyntaxHighlighter
                  language="python"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    fontSize: '0.875rem',
                    lineHeight: '1.5'
                  }}
                  showLineNumbers
                  wrapLongLines
                >
                  {content.fullCode}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        )}
      </div>




      {/* Prerequisites */}
      {example.execution.prerequisites.length > 0 && (
        <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
          <strong>Prerequisites:</strong> {example.execution.prerequisites.join(', ')}
        </div>
      )}
    </div>
  );
}
