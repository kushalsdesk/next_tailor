import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import ClientToaster from "@/components/core/ClientToaster";
import InstallPWA from "@/components/core/InstallPWA";
import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Govt. Tailoring courses | ASHAA - Barasat, Kolkata",
  description:
    "Start earning during short term govt. tailoring course. Get diploma certificate and sell designed dress from New Barrackpur. Learn free sewing with Usha machine",
  keywords: [
    "Govt. certified dress design course",
    "Govt. certified tailoring institute school",
    "Government certified designing institute school",
    "Government vocational course",
    "tailoring certificate course",
    "tailor jobs",
    "Sell your designed cloth",
    "Most affordable govt. sewing course",
    "Government selai school",
    "Job oriented vocational course",
    "jobs in vocational course",
    "work from home job",
    "work after course",
    "sell your recycled course",
    "Sell old cloths",
    "tailoring classes in Kolkata",
    "tailoring classes in Barasat",
    "best dress designing institute in West Bengal",
    "fashion design diploma",
    "sewing classes near me",
    "boutique management course",
    "Usha sewing machine training",
    "NSDC certified tailoring course",
    "earn from home tailoring",
    "free sewing machine course",
    "women empowerment tailoring course"
  ].join(", "),
  openGraph: {
    title: "Govt. Tailoring course | ASHAA - Barasat, Kolkata",
    description:
      "Start earning during short term govt. tailoring course. Get diploma certificate and sell designed dress from New Barrackpur. Learn free sewing with Usha machine",
    type: "website",
    locale: "en_US",
    url: "https://ashaafoundation.in",
    siteName: "ASHAA-Tailoring Institute",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} font-sans`}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
            {children}
            <SpeedInsights />
            <Analytics />
            <Footer />
          </Suspense>
        </AuthProvider>
        <ClientToaster />
        <InstallPWA />
      </body>
    </html>
  );
}
