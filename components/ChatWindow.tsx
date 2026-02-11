'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { trackEvent, trackException, getOrCreateIdentity } from '@/lib/telemetry';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Amplifier, and I love talking about myself! 🤖\\n\\nAsk me anything about how I work, what I can do, or why I exist. I'm here to help you understand the future of AI development.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [amplifierSessionId, setAmplifierSessionId] = useState<string | null>(null);
  const sessionStartTime = useRef<number>(0);

  // Track chat open/close
  useEffect(() => {
    if (isOpen && sessionStartTime.current === 0) {
      sessionStartTime.current = Date.now();
      trackEvent('chat_opened', {
        from_page: typeof window !== 'undefined' ? window.location.pathname : '',
        message_count: messages.length
      });
    } else if (!isOpen && sessionStartTime.current > 0) {
      const duration = Date.now() - sessionStartTime.current;
      trackEvent('chat_closed', {
        message_count: messages.length,
        session_duration_ms: duration
      });
      sessionStartTime.current = 0;
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const identity = getOrCreateIdentity();
    const messageStartTime = performance.now();

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageContent = input;
    setInput('');
    setIsLoading(true);

    // Track message sent
    trackEvent('chat_message_sent', {
      message_length: messageContent.length,
      message_number: messages.length,
      session_id: identity.session_id,
      is_first_message: messages.length === 1
    });

    try {
      // Call the Amplifier chat API
      // Send Amplifier session ID if we have one, otherwise let API create a new session
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          sessionId: amplifierSessionId || undefined,
          userId: identity.anonymous_id,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Store the Amplifier session ID for future messages
      if (data.session_id && data.session_id !== amplifierSessionId) {
        console.log(`Amplifier session created/updated: ${data.session_id}`);
        setAmplifierSessionId(data.session_id);
      }

      const messageEndTime = performance.now();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(data.timestamp),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Track response received
      trackEvent('chat_response_received', {
        response_length: data.response.length,
        response_time_ms: messageEndTime - messageStartTime,
        session_id: identity.session_id,
        amplifier_session_id: data.session_id,
        success: true
      });

    } catch (error: any) {
      console.error('Chat error:', error);

      const messageEndTime = performance.now();

      // Track error
      trackException(error, {
        context: 'chat_interaction',
        session_id: identity.session_id,
        amplifier_session_id: amplifierSessionId,
        message_length: messageContent.length,
        response_time_ms: messageEndTime - messageStartTime
      });

      trackEvent('chat_error', {
        error_message: error.message,
        response_time_ms: messageEndTime - messageStartTime,
        session_id: identity.session_id,
        amplifier_session_id: amplifierSessionId
      });

      // Show error message to user
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}\\n\\nPlease try again or check the System Overview page to learn more about me!`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Chat Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h3 className="font-bold text-lg">Ask Amplifier</h3>
              <p className="text-sm text-blue-100">Powered by Amplifier itself</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none prose-headings:mt-3 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-gray-800 prose-code:break-words prose-pre:bg-gray-100 prose-pre:text-gray-800 prose-pre:overflow-x-auto prose-pre:max-w-full [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:break-words [&_pre_code]:whitespace-pre-wrap">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                )}
                <p
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about Amplifier..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
