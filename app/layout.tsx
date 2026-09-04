import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CurryShot Dashboard",
  description:
    "A player-configurable NBA shot dashboard with team themes, shot charts, filters, summary metrics, and tactical recommendations."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
