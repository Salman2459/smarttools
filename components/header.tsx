"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { X, ChevronDown, AlignRight, AlignLeft } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toolsData } from "../lib/tools-data"

export function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isImageToolsDropdownOpen, setIsImageToolsDropdownOpen] = useState(false)
  const [isAllToolsDropdownOpen, setIsAllToolsDropdownOpen] = useState(false)
  const imageToolsDropdownRef = useRef<HTMLDivElement>(null)
  const allToolsDropdownRef = useRef<HTMLDivElement>(null)
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null)
  const [menuOpenType, setMenuOpenType] = useState<number | null>(null)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Image Tools", href: "#" },
    { name: "Other Tools", href: "/features" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacypolicy" },
  ]

  const imageTools = toolsData.filter((tool) => tool.category === "Image Tools");
  const otherToolsCategories = ["PDF Tools", "Text Tools", "Video Tools", "Other Tools"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (imageToolsDropdownRef.current && !imageToolsDropdownRef.current.contains(event.target as Node)) {
        setIsImageToolsDropdownOpen(false)
      }
      if (allToolsDropdownRef.current && !allToolsDropdownRef.current.contains(event.target as Node)) {
        setIsAllToolsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // FIX: Close mobile menu when navigating on mobile
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false)
    setOpenMobileAccordion(null) // Also close accordions
  }

  const closeAllDropdowns = () => {
    setIsImageToolsDropdownOpen(false)
    setIsAllToolsDropdownOpen(false)
  }

  const handleOpenMobileMenu = (type: number = 1): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (type === 1) {
      setMenuOpenType(1)

    } else {
      setMenuOpenType(2)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 sm:h-16 items-center justify-between px-4">
        {/* Logo */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => handleOpenMobileMenu(1)}
        >

          {isMobileMenuOpen && menuOpenType === 1 ? <X className="w-5 h-5" /> : <AlignLeft className="w-5 h-5" />}
        </Button>
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center  h-[100%]">
            <img src="/in row.png" alt="Logo" className="w-[160px] h-[70px]" />
          </div>
          {/* <span className="font-bold text-lg sm:text-xl">SmartTools</span> */}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 -mt-1">
          {navigation.map((item) => {
            if (item.name === "Image Tools") {
              return (
                <div
                  key={item.name}
                  className="relative"
                  ref={imageToolsDropdownRef}
                  onMouseEnter={() => setIsImageToolsDropdownOpen(true)}
                  onMouseLeave={() => setIsImageToolsDropdownOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-primary ${pathname.startsWith('/tools') && imageTools.some(t => `/tools/${t.id}` === pathname)
                      ? "text-primary border-primary"
                      : "text-muted-foreground"
                      }`}
                  >
                    {item.name}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isImageToolsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 top-full mt-0 w-[90vw] max-w-4xl rounded-lg shadow-md  transition-all duration-200 ${isImageToolsDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                      }`}
                  >
                    <div className="bg-background mt-2 border p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                        {imageTools.map((tool) => (
                          <Link
                            key={tool.id}
                            href={`/tools/${tool.id}`}
                            onClick={closeAllDropdowns}
                            className="group flex items-center gap-3 p-0 rounded-md hover:bg-muted/50 -mt-1"
                          >
                            <div className={`flex items-center justify-center text-sm w-6 h-6 rounded-md bg-muted ${tool.color}`}>
                              <tool.icon className={`w-4 h-4 text-muted-foreground group-hover:text-foreground ${tool.color}`} />
                            </div>
                            <div>
                              <p className="text-[12px] font-medium text-foreground">{tool.title.replace("Converter", "")}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (item.name === "Other Tools") {
              return (
                <div
                  key={item.name}
                  className="relative"
                  ref={allToolsDropdownRef}
                  onMouseEnter={() => setIsAllToolsDropdownOpen(true)}
                  onMouseLeave={() => setIsAllToolsDropdownOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-primary ${pathname === item.href ? "text-primary border-primary" : "text-muted-foreground"
                      }`}
                  >
                    {item.name}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isAllToolsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-0  max-w-7xl rounded-lg shadow-md transition-all duration-200 ${isAllToolsDropdownOpen ? " opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                    }`}>
                    <div
                      className={` mt-2 max-w-7xl bg-background border rounded-lg shadow-md p-6 flex flex-row flex-nowrap gap-8 overflow-x-auto transition-all duration-200 ${isAllToolsDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                        }`}
                    >
                      {otherToolsCategories.map(category => {
                        const toolsForCategory = toolsData.filter(tool => tool.category === category);
                        return (
                          <div key={category} className="space-y-2 flex-shrink-0 w-48">
                            <div className="text-lg font-semibold text-foreground mb-1">{category}</div>
                            {toolsForCategory.map((tool) => (
                              <Link
                                key={tool.id}
                                href={`/tools/${tool.id}`}
                                onClick={closeAllDropdowns}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-2"
                              >
                                <tool.icon className={`w-4 h-4 ${tool.color}`} />
                                {tool.title}
                              </Link>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors border-b-2 border-transparent hover:border-primary ${pathname === item.href ? "text-primary border-primary" : "text-muted-foreground"
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => handleOpenMobileMenu(2)}
          >
            {isMobileMenuOpen && menuOpenType === 2 ? <X className="w-5 h-5" /> : <AlignRight className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* --- MODIFIED: Mobile Navigation Overlay --- */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20  md:hidden" // FIX: Removed unnecessary scroll classes
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-14 sm:top-16 left-0 right-0 z-50 md:hidden">
            {/* FIX: Set a max-height and let the inner nav scroll */}
            <div className="mx-4 mt-2 bg-background/95 backdrop-blur-md border rounded-lg shadow-lg max-h-[calc(100vh-6rem)] overflow-y-auto">
              <nav className="p-4 space-y-1 overflow-y-auto" style={{ display: menuOpenType === 1 ? 'block' : 'none' }}>
                {/* Regular Links */}
                {toolsData.map((item, index) => (
                  <Link
                    key={index}
                    href={"/tools/" + item.id}
                    className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${pathname === item.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted/50"}`}
                    onClick={handleMobileLinkClick}
                  >
                    <item.icon className={`inline-block w-4 h-4 mr-2 ${item.color}`} />
                    {item.title}
                  </Link>
                ))}

              </nav>

              <nav className="p-4 space-y-1 overflow-y-auto" style={{ display: menuOpenType === 2 ? 'block' : 'none' }}>
                {/* Regular Links */}
                {navigation.filter(item => item.name !== 'Image Tools' && item.name !== 'Other Tools').map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted/50"}`}
                    onClick={handleMobileLinkClick}
                  >
                    {item.name}
                  </Link>
                ))}


              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  )
}