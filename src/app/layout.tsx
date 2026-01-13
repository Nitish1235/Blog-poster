import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PickBettr | Trusted Product Recommendations & Reviews",
  description: "We suggest the best products after thorough research and testing. Trust our expert recommendations to help you make confident purchases. Find quality products that deliver real value.",
  keywords: ['affiliate marketing', 'SEO', 'online business', 'marketing strategies', 'affiliate programs', 'digital marketing'],
  authors: [{ name: 'PickBettr' }],
  creator: 'PickBettr',
  publisher: 'PickBettr',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { url: '/icon', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icon.svg',
  },
  manifest: '/manifest.json',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "PickBettr | Trusted Product Recommendations & Reviews",
    description: "We suggest the best products after thorough research and testing. Trust our expert recommendations to help you make confident purchases.",
    type: 'website',
    locale: 'en_US',
    siteName: 'PickBettr',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'PickBettr Logo - Pick Better Strategies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "PickBettr | Trusted Product Recommendations & Reviews",
    description: "We suggest the best products after thorough research and testing. Trust our expert recommendations to help you make confident purchases.",
    images: ['/icon.svg'],
    creator: '@pickbettr',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// ... existing imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
