"use client"

import Link from "next/link"
import { usePathname } from "next/navigation" // Import the hook
import { Zap } from "lucide-react"

export function Footer() {
  const pathname = usePathname() // Get the current URL path

  // --- MODIFIED: Conditional Rendering Logic ---
  // Check if the current path is a specific tool page.
  // The path starts with `/tools/` followed by a parameter (e.g., `/tools/image-resizer`).
  const isToolPage = pathname.startsWith("/tools/")

  // If it's a tool page, render nothing (hide the footer).
  if (isToolPage) {
    return null
  }

  // Otherwise, render the footer normally.
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center h-[70px]">
                <img src="/in row.png" alt="Logo" className="w-[160px] h-[70px]" />
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
              Simplifying daily tasks with powerful productivity tools. Fast, secure, and user-friendly.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Tools</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/features" className="hover:text-primary transition-colors">
                  Image to PDF
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-primary transition-colors">
                  Document to PDF
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-primary transition-colors">
                  Image Tools
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-primary transition-colors">
                  Text Tools
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacypolicy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/contect" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              {/* <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li> */}
              {/* <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Support
                </Link>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="border-t mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SmartTools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}