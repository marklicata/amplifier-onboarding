import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplifier - Playground",
  description: "Explore bundles and recipes - single-step agents or multi-step workflows",
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
