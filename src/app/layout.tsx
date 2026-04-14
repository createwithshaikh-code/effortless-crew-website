import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Effortless Crew",
  description: "We make creators look legendary.",
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
