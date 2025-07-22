"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Zap, Menu, X, ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAllToolsDropdownOpen, setIsAllToolsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "All Tools", href: "/features" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const allToolsSections = [
    { name: "Image Converters", href: "/tools/image-convert" },
    { name: "Video Tools", href: "/tools/video-tools" },
    { name: "Text Utilities", href: "/tools/text-utils" },
    { name: "PDF Tools", href: "/tools/pdf-tools" },
  ]

  // Close dropdown when clicking outside (desktop)
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsAllToolsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 sm:h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg sm:text-xl">ProductivityHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) =>
            item.name === "All Tools" ? (
              <div
                key={item.name}
                className="relative z-50"
                onMouseEnter={() => setIsAllToolsDropdownOpen(true)}
                onMouseLeave={() => setIsAllToolsDropdownOpen(false)}
                ref={dropdownRef}
              >
                {/* All Tools Button */}
                <button
                  className={`flex items-center gap-1 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-primary ${pathname === item.href
                      ? "text-primary border-primary"
                      : "text-muted-foreground"
                    }`}
                >
                  {item.name}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Panel */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-full mt-0 w-[90vw] max-w-7xl bg-background border rounded-lg shadow-md p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 transition-opacity duration-200 ${isAllToolsDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                    }`}
                >
                  {allToolsSections.map((section) => (
                    <Link
                      key={section.name}
                      href={section.href}
                      className="block text-sm font-medium text-muted-foreground hover:text-foreground"
                      onClick={() => setIsAllToolsDropdownOpen(false)}
                    >
                      {section.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors border-b-2 border-transparent hover:border-primary ${pathname === item.href
                    ? "text-primary border-primary"
                    : "text-muted-foreground"
                  }`}
              >
                {item.name}
              </Link>
            )
          )}
        </nav>


        {/* Right Controls */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {/* Mobile Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed top-16 left-0 right-0 z-50 md:hidden">
            <div className="mx-4 mt-2 bg-background/95 backdrop-blur-md border rounded-lg shadow-lg">
              <nav className="p-4 space-y-1">
                {navigation.map((item) =>
                  item.name === "All Tools" ? (
                    <div key={item.name} className="space-y-2" ref={dropdownRef}>
                      <button
                        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted/50"
                        onClick={() =>
                          setIsAllToolsDropdownOpen(!isAllToolsDropdownOpen)
                        }
                      >
                        {item.name}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {isAllToolsDropdownOpen && (
                        <div className="w-[90%] mx-auto grid grid-cols-1 gap-2">
                          {allToolsSections.map((section) => (
                            <Link
                              key={section.name}
                              href={section.href}
                              className="block px-4 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                              onClick={() => {
                                setIsMobileMenuOpen(false)
                                setIsAllToolsDropdownOpen(false)
                              }}
                            >
                              {section.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${pathname === item.href
                          ? "text-primary bg-primary/10 shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
