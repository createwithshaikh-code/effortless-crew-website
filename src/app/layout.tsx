import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Space_Grotesk } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import FooterWrapper from "@/components/layout/FooterWrapper";
import PlayReelButton from "@/components/common/PlayReelButton";
import DynamicFavicon from "@/components/common/DynamicFavicon";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Effortless Crew — Premium Video Editing Agency",
    template: "%s | Effortless Crew",
  },
  description:
    "We make creators look legendary. Premium video editing, YouTube automation, motion graphics, and short-form content for YouTubers and brands.",
  keywords: [
    "video editing",
    "youtube automation",
    "motion graphics",
    "short form video",
    "content creation",
    "video editing agency",
  ],
  authors: [{ name: "Effortless Crew" }],
  creator: "Effortless Crew",
  metadataBase: new URL("https://effortlesscrew.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://effortlesscrew.com",
    siteName: "Effortless Crew",
    title: "Effortless Crew — Premium Video Editing Agency",
    description:
      "We make creators look legendary. Premium video editing, YouTube automation, motion graphics, and short-form content for YouTubers and brands.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Effortless Crew — Premium Video Editing Agency",
    description:
      "We make creators look legendary. Premium video editing, YouTube automation, motion graphics, and short-form content for YouTubers and brands.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <DynamicFavicon />
          <Navbar />
          <main>{children}</main>
          <FooterWrapper />
          <PlayReelButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
