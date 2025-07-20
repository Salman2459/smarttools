import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ProductivityHub - Essential Tools for Daily Tasks",
  description:
    "Transform, convert, and optimize your files with our suite of powerful productivity tools. Convert images to PDF, compress files, and humanize AI text.",
  keywords: ["productivity tools", "file conversion", "PDF converter", "image compression", "AI text humanizer"],
  authors: [{ name: "ProductivityHub" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "ProductivityHub - Essential Tools for Daily Tasks",
    description: "Transform, convert, and optimize your files with our suite of powerful productivity tools.",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
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
