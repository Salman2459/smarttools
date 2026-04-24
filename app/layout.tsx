import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Script from "next/script";
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Free Online Smart Tools – Images, PDF & AI | SmartTools.fun",
    template: "%s | SmartTools.fun",
  },
  description:
    "SmartTools.fun bundles 45+ browser tools: unique guides for each image and PDF converter, video trimmers, QR and barcode makers, DNS checks, grammar and text-to-speech helpers, and all-in-one document viewers—free to use, no account required.",
  keywords: [
    "smart tools",
    "free online tools",
    "image to pdf",
    "image compressor",
    "pdf converter",
    "word to pdf",
    "image converter",
    "video compressor",
    "qr code generator",
    "barcode generator",
    "text to speech",
    "grammar checker online",
    "online productivity tools",
    "no sign up tools",
    "free file converter",
    "jpg to png",
    "png to pdf",
    "webp converter",
    "pdf tools online free",
    "smarttools.fun",
  ],
  authors: [{ name: "SmartTools.fun", url: "https://smarttools.fun" }],
  creator: "SmartTools.fun",
  publisher: "SmartTools.fun",
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
  openGraph: {
    title: "Free Online Smart Tools – Images, PDF & AI | SmartTools.fun",
    description:
      "45+ browser tools with unique guides: image/PDF conversion, video edits, writing helpers, QR & barcodes, DNS checks, multi-format viewers. No account needed.",
    type: "website",
    url: "https://smarttools.fun",
    siteName: "SmartTools.fun",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Smart Tools – Images, PDF & AI | SmartTools.fun",
    description:
      "Image & PDF utilities, video tools, writing aids, QR/barcode generators, DNS checker, document viewers—each page includes a full guide.",
  },
  alternates: {
    canonical: "https://smarttools.fun",
  },
  icons: {
    icon: "/favicon.png",
  },
  verification: {
    google: "", // Add your Google Search Console verification code here
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense - meta tag for "Meta tag" verification method */}
        <meta name="google-adsense-account" content="ca-pub-1519616963911527"/>
        {/* AdSense script - beforeInteractive so it appears in initial HTML for crawler verification */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1519616963911527"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
