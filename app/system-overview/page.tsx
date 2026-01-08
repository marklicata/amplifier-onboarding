'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWindow from '@/components/ChatWindow';
import { Url } from 'next/dist/shared/lib/router/router';

export default function SystemOverview() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Header onOpenChat={() => setIsChatOpen(true)} />
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Amplifier System Architecture
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A modular AI development assistant built on a three-tier architecture,
              from ultra-thin kernel to user-facing applications
            </p>
          </div>

          {/* Onboarding Tools */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-full text-sm font-semibold shadow-lg">
                Onboarding Tools
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <AppCard
                name="Amplifier Onboarding"
                link="https://github.com/marklicata/amplifier-onboarding"
                description="Interactive onboarding experience to get started with Amplifier"
                icon="🚀"
              />
              <AppCard
                name="Developer Guide"
                link="https://michaeljabbour.github.io/amplifier-dx/"
                description="Desktop application providing a rich GUI experience for AI-powered development"
                icon="📚"
              />
            </div>
          </div>

          {/* User Applications Layer */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg">
                User Applications
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <AppCard
                name="Amplifier Desktop"
                link="https://github.com/michaeljabbour/amplifier-desktop"
                description="Desktop application providing a rich GUI experience for AI-powered development"
                icon="🖥️"
              />
              <AppCard
                name="Amplifier CLI"
                link="https://github.com/microsoft/amplifier-app-cli"
                description="Command-line interface for terminal-native AI assistance"
                icon="⌨️"
              />
            </div>
          </div>

          {/* Architecture Layers */}
          <div className="relative">
            {/* Connector Lines */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-300 via-blue-300 to-green-300 transform -translate-x-1/2 opacity-30"
                 style={{ height: 'calc(100% - 2rem)' }} />

            {/* Application Layer */}
            <LayerSection
              title="Application Layer"
              subtitle="Extensible modules and implementations"
              color="purple"
              delay={0}
            >
              <ArchCard
                name="Amplifier"
                link="https://github.com/microsoft/amplifier"
                description="Main hub repository containing agents, behaviors, context managers, documentation, and usage recipes"
                lines="Multi-component"
                highlight="Hub Repository"
                usedBy={['Desktop', 'CLI']}
                uses={['Foundation']}
              />
              <ArchCard
                name="Amplifier Log Viewer"
                link="https://github.com/microsoft/amplifier-app-log-viewer"
                description="Debugging and inspection tool for Amplifier sessions"
                lines="~1,000 lines"
                highlight="Debugging Tool"
                usedBy={['All Apps']}
              />
            </LayerSection>

            {/* Foundation Layer */}
            <LayerSection
              title="Foundation Layer"
              subtitle="Bundle composition and configuration"
              color="blue"
              delay={200}
            >
              <ArchCard
                name="Amplifier Foundation"
                link="https://github.com/microsoft/amplifier-foundation"
                description="Bundle composition library enabling modular configuration through YAML/Markdown. Provides @mention system, bundle validation, and default foundation bundle"
                lines="~5,000 lines"
                highlight="Composition Framework"
                usedBy={['Amplifier']}
                uses={['Core']}
              />
            </LayerSection>

            {/* Core Layer */}
            <LayerSection
              title="Core Layer"
              subtitle="The foundational kernel"
              color="green"
              delay={400}
            >
              <ArchCard
                name="Amplifier Core"
                link="https://github.com/microsoft/amplifier-core"
                description="Ultra-thin kernel providing module discovery, lifecycle coordination, hook system, session management, and stable APIs. Uses Python Protocols for zero-dependency modularity"
                lines="~2,600 lines"
                highlight="Minimal Kernel"
                usedBy={['Foundation', 'All Layers']}
              />
            </LayerSection>
          </div>

          {/* Architecture Principles */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Design Principles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Principle
                icon="🎯"
                title="Mechanism, Not Policy"
                description="Core provides infrastructure, modules implement features"
              />
              <Principle
                icon="🔌"
                title="Zero-Dependency Modularity"
                description="Structural typing enables swappable components"
              />
              <Principle
                icon="📝"
                title="Human-Readable Config"
                description="YAML/Markdown for diffable, versionable bundles"
              />
            </div>
          </div>
          <div className="text-center">
          <button
                onClick={() => window.location.href = "/playground"}
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                style={{ marginTop: '2rem' }}
              >
                Developer Guide →
          </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface AppCardProps {
  name: string;
  link: string;
  description: string;
  icon: string;
}

function AppCard({ name, link, description, icon }: AppCardProps) {
  return (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg p-6 border border-purple-200 hover:shadow-xl transition-all hover:scale-105">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
      <p className="text-sm text-gray-600 mb-4 min-h-[3rem]">{description}</p>
      <a
        href={`${link}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
        View Repository
      </a>
    </div>
  );
}

interface LayerSectionProps {
  title: string;
  subtitle: string;
  color: 'purple' | 'blue' | 'green';
  children: React.ReactNode;
  delay: number;
}

function LayerSection({ title, subtitle, color, children, delay }: LayerSectionProps) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600 border-purple-200',
    blue: 'from-blue-500 to-blue-600 border-blue-200',
    green: 'from-green-500 to-green-600 border-green-200',
  };

  return (
    <div className="mb-12 relative z-10">
      <div className="text-center mb-6">
        <div className={`inline-block px-6 py-2 bg-gradient-to-r ${colorClasses[color]} text-white rounded-full text-sm font-semibold shadow-lg mb-2`}>
          {title}
        </div>
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>
      <div className="space-y-12">
        {children}
      </div>
    </div>
  );
}

interface ArchCardProps {
  name: string;
  link: string;
  description: string;
  lines: string;
  highlight: string;
  usedBy?: string[];
  uses?: string[];
}

function ArchCard({ name, link, description, lines, highlight, usedBy, uses }: ArchCardProps) {
  return (
    <div className="relative bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
      {/* Used By - Arrow pointing up */}
      {usedBy && usedBy.length > 0 && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span>Used by: {usedBy.join(', ')}</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <a
            href={`${link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 mt-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            View Repository
          </a>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
            {highlight}
          </span>
          <span className="text-xs text-gray-500">{lines}</span>
        </div>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{description}</p>

      {/* Uses - Arrow pointing down */}
      {uses && uses.length > 0 && (
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
          <span>Uses: {uses.join(', ')}</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      )}
    </div>
  );
}

interface PrincipleProps {
  icon: string;
  title: string;
  description: string;
}

function Principle({ icon, title, description }: PrincipleProps) {
  return (
    <div className="text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
