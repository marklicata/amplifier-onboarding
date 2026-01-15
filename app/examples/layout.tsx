import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplifier - Examples",
  description: "See Amplifier in action with real-world examples",
};

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
