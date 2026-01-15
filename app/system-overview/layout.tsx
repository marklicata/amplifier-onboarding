import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplifier - System Overview",
  description: "Understanding Amplifier's architecture and system design",
};

export default function SystemOverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
