'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWindow from '@/components/ChatWindow';
import ExampleTemplate from '../_components/ExampleTemplate';
import { examples } from '../examples-data';

interface ExamplePageProps {
  params: {
    slug: string;
  };
}

export default function ExamplePage({ params }: ExamplePageProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Find the example by slug
  const example = examples.find(ex => ex.id === params.slug);

  // 404 if example not found
  if (!example) {
    notFound();
  }

  // Find prev/next examples for navigation
  const currentIndex = examples.findIndex(ex => ex.id === params.slug);
  const prevExample = currentIndex > 0 ? examples[currentIndex - 1] : null;
  const nextExample = currentIndex < examples.length - 1 ? examples[currentIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenChat={() => setIsChatOpen(true)} />
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <ExampleTemplate
        example={example}
        prevExample={prevExample ? { id: prevExample.id, name: prevExample.name } : undefined}
        nextExample={nextExample ? { id: nextExample.id, name: nextExample.name } : undefined}
      />

      <Footer />
    </div>
  );
}
