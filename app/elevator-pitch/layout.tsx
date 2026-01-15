import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amplifier - Elevator Pitch",
  description: "Build Intelligent Applications, Not Just Code",
};

export default function ElevatorPitchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
