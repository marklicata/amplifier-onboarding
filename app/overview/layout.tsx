import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplifier - Overview",
  description: "Use AI to build applications, not just to autocomplete code",
};

export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
