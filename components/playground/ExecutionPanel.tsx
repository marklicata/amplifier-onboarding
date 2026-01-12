'use client';

import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface ExecutionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    success: boolean;
    output?: string;
    executionTimeMs?: number;
    error?: string;
    details?: string;
  } | null;
  executing: boolean;
}

export default function ExecutionPanel({ isOpen, onClose, result, executing }: ExecutionPanelProps) {
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new content arrives
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [result]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {executing ? 'Executing Example...' : 'Execution Results'}
          </h3>
          <button
            onClick={onClose}
            disabled={executing}
            className={`text-gray-400 hover:text-gray-600 transition-colors ${
              executing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={executing ? 'Wait for execution to complete' : 'Close'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div ref={outputRef} className="flex-1 overflow-y-auto px-6 py-4">
          {executing && (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              <div className="text-center space-y-2">
                <p className="text-gray-700 font-medium">Running your example...</p>
                <p className="text-sm text-gray-500">
                  This may take a few moments on first run (downloading modules)
                </p>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Loading foundation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Configuring provider</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Executing prompt...</span>
                </div>
              </div>
            </div>
          )}

          {!executing && result && (
            <div className="space-y-4">
              {result.success ? (
                <>
                  {/* Success State */}
                  <div className="flex items-center gap-2 text-green-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-semibold">Execution Complete</span>
                    {result.executionTimeMs && (
                      <span className="text-sm text-gray-500">
                        ({(result.executionTimeMs / 1000).toFixed(2)}s)
                      </span>
                    )}
                  </div>

                  {/* Output */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Output:</h4>
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          code: ({ node, className, children, ...props }: any) => {
                            const isInline = !className?.includes('language-');
                            if (isInline) {
                              return (
                                <code className="bg-gray-800 text-gray-100 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                  {children}
                                </code>
                              );
                            }
                            return (
                              <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
                                <code className="text-sm font-mono" {...props}>
                                  {children}
                                </code>
                              </pre>
                            );
                          },
                          pre: ({ children }) => <>{children}</>,
                        }}
                      >
                        {result.output || ''}
                      </ReactMarkdown>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Error State */}
                  <div className="flex items-center gap-2 text-red-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="font-semibold">Execution Failed</span>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-2">Error:</h4>
                    <p className="text-red-800">{result.error}</p>
                    
                    {result.details && (
                      <details className="mt-3">
                        <summary className="text-sm text-red-700 cursor-pointer hover:text-red-900">
                          Technical Details
                        </summary>
                        <pre className="mt-2 text-xs text-red-700 bg-red-100 p-3 rounded overflow-x-auto">
                          {result.details}
                        </pre>
                      </details>
                    )}

                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm text-yellow-800">
                        <strong>Common Issues:</strong>
                      </p>
                      <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside space-y-1">
                        <li>Ensure <code className="bg-yellow-100 px-1 rounded">ANTHROPIC_API_KEY</code> is set in your environment</li>
                        <li>Check that Python dependencies are installed: <code className="bg-yellow-100 px-1 rounded">pip install -r requirements.txt</code></li>
                        <li>Verify the example script exists in <code className="bg-yellow-100 px-1 rounded">lib/run-example.py</code></li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {!executing && !result && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Ready to execute. Click "Run Example" to start.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!executing && result && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {result.success ? (
                <span>✓ Execution completed successfully</span>
              ) : (
                <span>✗ Execution failed</span>
              )}
            </div>
            <div className="flex gap-3">
              {result.success && result.output && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.output || '');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  📋 Copy Output
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
