import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Head from "next/head"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Free Online Smart Tools – Images, PDF & AI | Smart Tools",
  description: "Discover SmartTools.fun – free, smart, and easy online tools. From calculators to converters, simplify tasks, save time, and boost productivity.",
  keywords: ["smart tools", "smart tool", "file conversion", "PDF converter", "image compression", "video tools", "online smart tools ", "online smart tools no sign-up", "free tools to improve workflow", "convert files & compress images in one place", "all-in-one file converter", "privacy-focused document converter", "free productivity tools", "best productivity tools", "smart toolkit online", "no sign up smart tools", "web based smaret tools", "file conversion smart tools", "AI productivity tools", "smart tools for content creators", "pdf tools online free", "image tools for productivity", "quick smart tools for students"],
  authors: [{ name: "SmartTools" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Free Online Smart Tools – Images, PDF & AI | Smart Tools",
    description: "Explore SmartTools.fun: a comprehensive platform offering free and smart online tools, from calculators to converters, to simplify tasks and boost productivity.",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
  },

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1024309119073793"
        crossOrigin="anonymous"></script>


    </html>
  )
}
