import type { Metadata } from "next";
import { examples } from "../examples-data";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Find the example by slug
  const example = examples.find(ex => ex.id === params.slug);

  if (!example) {
    return {
      title: "Amplifier - Examples",
    };
  }

  return {
    title: `Amplifier - ${example.name} Example`,
    description: example.summary,
  };
}

export default function ExampleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
