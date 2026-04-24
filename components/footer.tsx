"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mail, Shield, FileText } from "lucide-react"

type FooterProps = {
  /** Renders the full footer even on `/tools/*` (e.g. embedded in ToolSeoGuide). The root layout still omits the default footer on tool pages to avoid a duplicate. */
  forceShow?: boolean
}

export function Footer({ forceShow = false }: FooterProps = {}) {
  const pathname = usePathname()

  const isToolPage = pathname.startsWith("/tools/")

  if (isToolPage && !forceShow) {
    return null
  }

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">

          {/* Brand Column */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center h-[70px]">
                <img src="/in row.png" alt="SmartTools.fun Logo" className="w-[160px] h-[70px]" />
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
              Free online tools for image conversion, PDF creation, compression, video editing, and AI-powered text
              tools. No sign-up required.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3 h-3" />
              <a href="mailto:support@smarttools.fun" className="hover:text-primary transition-colors">
                support@smarttools.fun
              </a>
            </div>
          </div>

          {/* Tools Column */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Popular Tools</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/tools/image-to-pdf" className="hover:text-primary transition-colors">
                  Image to PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/image-compressor" className="hover:text-primary transition-colors">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/word-to-pdf" className="hover:text-primary transition-colors">
                  Word to PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/video-compressor" className="hover:text-primary transition-colors">
                  Video Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/background-remover" className="hover:text-primary transition-colors font-semibold text-rose-500">
                  Background Remover (New)
                </Link>
              </li>
              <li>
                <Link href="/tools/qr-generator" className="hover:text-primary transition-colors">
                  QR Code Generator
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-primary transition-colors">
                  View All Tools →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-primary transition-colors">
                  All Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/privacypolicy" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <FileText className="w-3 h-3" />
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Support
                </Link>
              </li>
            </ul>

            {/* AdSense & Privacy Disclosure (Google Publisher Policy compliant) */}
            <div className="mt-5 p-3 bg-muted/50 rounded-lg border">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="block mb-1">Advertising &amp; Data</strong>
                This site uses Google AdSense. Third parties may place and read cookies or use web beacons/IP to collect info as a result of ad serving here.{" "}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  How Google uses data when you use our partners&apos; sites or apps
                </a>
                .{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Opt out of personalized ads
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="border-t mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} SmartTools.fun. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacypolicy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
              <Link href="/sitemap.xml" className="hover:text-primary transition-colors" target="_blank">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}