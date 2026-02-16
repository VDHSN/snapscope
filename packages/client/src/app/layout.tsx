import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeInitializer } from '../components/theme-initializer';
import { DefaultsInitializer } from '../components/defaults-initializer';
import { ToastProvider } from '@snapscope/ui/toast';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: {
    default: "SnapScope - Vehicle Assessment Tool for Insurance Adjusters",
    template: "%s | SnapScope"
  },
  description: "Created for appraisers, by appraisers. We want to revolutionize the way claims are done, reducing turnaround times, simplifying uploads and eliminating the need for reinspections.",
  keywords: ["vehicle assessment", "insurance adjuster", "claim processing", "auto insurance", "vehicle inspection", "damage assessment", "PWA", "mobile app"],
  authors: [{ name: "SnapScope Team" }],
  creator: "SnapScope",
  publisher: "SnapScope",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://snapscope.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SnapScope - Vehicle Assessment Tool for Insurance Adjusters",
    description: "Created for appraisers, by appraisers. We want to revolutionize the way claims are done, reducing turnaround times, simplifying uploads and eliminating the need for reinspections.",
    url: "https://snapscope.app",
    siteName: "SnapScope",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "SnapScope Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapScope - Vehicle Assessment Tool",
    description: "Created for appraisers, by appraisers. We want to revolutionize the way claims are done, reducing turnaround times, simplifying uploads and eliminating the need for reinspections.",
    images: ["/icons/icon-512x512.png"],
    creator: "@snapscope",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="SnapScope" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SnapScope" />
        <meta name="description" content="Created for appraisers, by appraisers. We want to revolutionize the way claims are done, reducing turnaround times, simplifying uploads and eliminating the need for reinspections" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />
        
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/icon.svg" color="#2563eb" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://snapscope.app" />
        <meta name="twitter:title" content="SnapScope" />
        <meta name="twitter:description" content="Created for appraisers, by appraisers. We want to revolutionize the way claims are done, reducing turnaround times, simplifying uploads and eliminating the need for reinspections" />
        <meta name="twitter:image" content="https://snapscope.app/icons/icon-192x192.png" />
        <meta name="twitter:creator" content="@snapscope" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SnapScope - Vehicle Assessment Tool" />
        <meta property="og:description" content="Created for appraisers, by appraisers. We want to revolutionize the way claims are done, reducing turnaround times, simplifying uploads and eliminating the need for reinspections" />
        <meta property="og:site_name" content="SnapScope" />
        <meta property="og:url" content="https://snapscope.app" />
        <meta property="og:image" content="https://snapscope.app/icons/icon-512x512.png" />
        
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        
        
        {/* Structured Data */}
        <Script id="structured-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "SnapScope",
              "alternateName": "SnapScope - Vehicle Assessment Tool",
              "description": "Created for appraisers, by appraisers. We want to revolutionize the way claims are done, reducing turnaround times, simplifying uploads and eliminating the need for reinspections",
              "url": "https://snapscope.app",
              "logo": "https://snapscope.app/icons/icon-512x512.png",
              "category": "BusinessApplication",
              "applicationCategory": "Insurance",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "SnapScope Team"
              },
              "featureList": [
                "Vehicle assessment tools",
                "Offline-first functionality", 
                "Mobile-responsive design",
                "Progressive Web App",
                "Insurance claim processing"
              ]
            }
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        <ToastProvider>
          <ThemeInitializer />
          <DefaultsInitializer />
          {children}
          <Analytics />
          <SpeedInsights />
        </ToastProvider>
      </body>
    </html>
  );
}
