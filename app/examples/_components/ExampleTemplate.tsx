'use client';

import { ProductExample } from '../examples-data';
import Link from 'next/link';

interface ExampleTemplateProps {
  example: ProductExample;
  prevExample?: { id: string; name: string };
  nextExample?: { id: string; name: string };
}

export default function ExampleTemplate({ example, prevExample, nextExample }: ExampleTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/examples" className="hover:text-blue-600">Examples</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{example.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="text-7xl mb-4">{example.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {example.name}
          </h1>
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-8 md:p-12 border-2 border-purple-300 max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl text-center text-gray-800 font-medium leading-relaxed">
              {example.summary}
            </p>
          </div>
        </div>

        {/* AS-IS vs TO-BE */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">The Transformation</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* AS-IS */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-300">
              <div className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">AS-IS (Today)</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">{example.asIs.title}</h3>
              <p className="text-gray-600 mb-4">{example.asIs.description}</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-mono space-y-2">
                  {example.asIs.structure.map((item, idx) => (
                    <div key={idx} className="text-gray-700">
                      {item.startsWith(' ') ? (
                        <span className="ml-4 text-gray-600">{item}</span>
                      ) : (
                        <span className="font-semibold">{item}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TO-BE */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-8 border-2 border-blue-400">
              <div className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wide">TO-BE (With Amplifier)</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">{example.toBe.title}</h3>
              <p className="text-gray-800 mb-4 font-medium">{example.toBe.description}</p>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="text-sm font-mono space-y-2">
                  {example.toBe.structure.map((item, idx) => (
                    <div key={idx} className="text-gray-700">
                      {item.startsWith('  •') ? (
                        <span className="ml-6 text-gray-600">{item.slice(2)}</span>
                      ) : item.startsWith('[') ? (
                        <span className="font-semibold text-blue-700">{item}</span>
                      ) : (
                        <span className="font-semibold">{item}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What This Enables */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">What This Enables</h2>
          <div className="space-y-6 max-w-5xl mx-auto">
            {example.enables.map((capability, idx) => (
              <details key={idx} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden" open={idx === 0}>
                <summary className="px-8 py-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <span className="text-2xl font-bold text-blue-600 mr-4">{idx + 1}.</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{capability.title}</h3>
                      <p className="text-gray-600">{capability.description}</p>
                    </div>
                  </div>
                </summary>
                <div className="px-8 pb-6 pt-2 border-t border-gray-200 bg-gray-50">
                  {capability.details && (
                    <p className="text-gray-700 mb-4">{capability.details}</p>
                  )}
                  {capability.yamlExample && (
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-gray-700 mb-2">Example Configuration:</div>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{capability.yamlExample}</code>
                      </pre>
                    </div>
                  )}
                  {capability.codeExample && (
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-2">Example Usage:</div>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{capability.codeExample}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Real-World Scenarios */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Real-World Scenarios</h2>
          <div className="space-y-8 max-w-5xl mx-auto">
            {example.scenarios.map((scenario, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4">
                  <h3 className="text-2xl font-bold text-white">{scenario.title}</h3>
                </div>
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-sm font-semibold text-gray-500 mb-2 uppercase">Before Amplifier</div>
                      <p className="text-gray-700 leading-relaxed">{scenario.before}</p>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-blue-600 mb-2 uppercase">After Amplifier</div>
                      <p className="text-gray-800 leading-relaxed font-medium">{scenario.after}</p>
                    </div>
                  </div>
                  {scenario.impact && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-sm font-semibold text-green-900 mb-1">Impact</div>
                      <p className="text-green-800 font-medium">{scenario.impact}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-5xl mx-auto pt-8 border-t border-gray-200">
          <div>
            {prevExample && (
              <Link
                href={`/examples/${prevExample.id}`}
                className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all border-2 border-gray-300"
              >
                ← {prevExample.name}
              </Link>
            )}
          </div>
          <Link
            href="/playground"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-lg"
          >
            Try in Playground
          </Link>
          <div>
            {nextExample && (
              <Link
                href={`/examples/${nextExample.id}`}
                className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all border-2 border-gray-300"
              >
                {nextExample.name} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
