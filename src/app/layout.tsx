import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SplashScreen } from "@/components/ui/splash-screen";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Al-Arz Investments | Premium Properties in Pakistan",
    template: "%s | Al-Arz Investments",
  },
  description:
    "Al-Arz Investments — your trusted partner for buying, selling, and renting premium properties across Pakistan. Browse houses, apartments, plots, and commercial spaces.",
  keywords: [
    "real estate",
    "property",
    "Pakistan",
    "buy property",
    "rent property",
    "Al-Arz",
  ],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-primary-50">
        <SplashScreen />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
