import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
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
    "sell your recycled course",
    "work after course",
    "work from home course",
    "work from home job",
    "Sell old cloths",
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
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
          {children}
          <SpeedInsights />
          <Analytics />
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
