import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IPL T20 Live Dashboard",
  description: "Live IPL T20 scores, upcoming matches, points table, and complete schedule. Stay updated with the latest cricket action.",
  keywords: ["IPL", "T20", "cricket", "live scores", "points table", "schedule", "Indian Premier League"],
  authors: [{ name: "IPL Dashboard" }],
  robots: "index, follow",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" }
    ]
  },
  openGraph: {
    title: "IPL T20 Live Dashboard",
    description: "Live IPL T20 scores, upcoming matches, points table, and complete schedule",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL T20 Live Dashboard",
    description: "Live IPL T20 scores, upcoming matches, points table, and complete schedule",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HeaderWrapper />
        <main className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
