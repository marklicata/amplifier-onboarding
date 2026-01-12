'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface StreamingExecutionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  exampleId: string | null;
  inputs: any;
  mode: string;
  onComplete?: (result: any) => void;
}

interface StreamStep {
  step: string;
  status: 'pending' | 'in_progress' | 'complete' | 'error';
  message: string;
}

export default function StreamingExecutionPanel({
  isOpen,
  onClose,
  exampleId,
  inputs,
  mode,
  onComplete
}: StreamingExecutionPanelProps) {
  const [executing, setExecuting] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const [steps, setSteps] = useState<StreamStep[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Auto-scroll to bottom when new content arrives
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [streamedContent, steps]);

  // Execute when panel opens
  useEffect(() => {
    if (isOpen && exampleId && !executing) {
      executeStreaming();
    }

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [isOpen, exampleId]);

  const executeStreaming = async () => {
    if (!exampleId) return;

    setExecuting(true);
    setStreamedContent('');
    setSteps([]);
    setError(null);
    setExecutionTimeMs(null);
    setStartTime(Date.now());

    try {
      // Make POST request to initiate streaming (always enabled)
      const response = await fetch('/api/playground/execute-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exampleId,
          inputs,
          mode
        })
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
            // Parse SSE format: event: <type>\ndata: <json>
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
      console.error('Streaming error:', err);
      setError(err.message || 'Execution failed');
      setExecuting(false);
    }
  };

  const handleStreamEvent = (eventType: string, data: any) => {
    switch (eventType) {
      case 'status':
        // Initial status message
        break;

      case 'chunk':
        // Append content chunk
        setStreamedContent(prev => prev + data.content);
        break;

      case 'step':
        // Update step progress
        setSteps(prev => {
          const existing = prev.find(s => s.step === data.step);
          if (existing) {
            return prev.map(s => s.step === data.step ? { ...s, ...data } : s);
          }
          return [...prev, data];
        });
        break;

      case 'progress':
        // Progress message (could show in UI)
        console.log('Progress:', data.message);
        break;

      case 'complete':
        // Execution complete
        setExecuting(false);
        setExecutionTimeMs(data.executionTimeMs);
        if (data.output && !streamedContent) {
          setStreamedContent(data.output);
        }
        if (onComplete) {
          onComplete({
            success: true,
            output: data.output || streamedContent,
            executionTimeMs: data.executionTimeMs,
            metadata: data.metadata
          });
        }
        break;

      case 'error':
        // Execution error
        setExecuting(false);
        setError(data.error);
        setExecutionTimeMs(data.executionTimeMs);
        if (onComplete) {
          onComplete({
            success: false,
            error: data.error,
            details: data.details
          });
        }
        break;
    }
  };

  const handleClose = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setExecuting(false);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {executing ? '⚡ Executing (Streaming)...' : error ? '❌ Execution Failed' : '✅ Execution Complete'}
          </h3>
          <button
            onClick={handleClose}
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
          {/* Multi-Step Progress */}
          {steps.length > 0 && (
            <div className="mb-4 space-y-2">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  {step.status === 'complete' && <span className="text-green-600">✓</span>}
                  {step.status === 'in_progress' && <span className="text-blue-600 animate-pulse">⏳</span>}
                  {step.status === 'pending' && <span className="text-gray-400">○</span>}
                  {step.status === 'error' && <span className="text-red-600">✗</span>}
                  <span className={
                    step.status === 'complete' ? 'text-green-700' :
                    step.status === 'in_progress' ? 'text-blue-700 font-medium' :
                    step.status === 'error' ? 'text-red-700' : 'text-gray-500'
                  }>
                    {step.message || step.step}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Streamed Output */}
          {streamedContent && (
            <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-code:before:content-none prose-code:after:content-none">
              <ReactMarkdown
                components={{
                  code(props) {
                    const { node, inline, className, children, ...rest } = props as any;
                    return inline ? (
                      <code className="text-sm font-mono text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded" {...rest}>
                        {children}
                      </code>
                    ) : (
                      <code className={className} {...rest}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {streamedContent}
              </ReactMarkdown>
              {executing && (
                <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse ml-1"></span>
              )}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Execution Failed</span>
              </div>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Execution Time */}
          {executionTimeMs !== null && (
            <div className="mt-4 text-xs text-gray-500 border-t border-gray-200 pt-2">
              Execution time: {(executionTimeMs / 1000).toFixed(2)}s
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={handleClose}
            disabled={executing}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              executing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {executing ? 'Executing...' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
