import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Agency for Creators, Businesses & Agencies | Effortless Crew",
  description: "Agencies hire us. Businesses scale with us. Creators blow up with us. Web design, branding, video editing, YouTube automation, and traffic growth — rooted in results.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
