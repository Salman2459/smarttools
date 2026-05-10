"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import type { toolsData } from "@/lib/tools-data"
type Tool = typeof toolsData[number]

interface DashboardHeaderProps {
  activeTool?: Tool
  onMenuClick: () => void
}

export function DashboardHeader({ activeTool, onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden hover:bg-primary/10 transition-colors duration-200"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2 min-w-0">
            <img
              src="/mainLogo.png"
              alt="AllInOneTools"
              className="h-8 w-auto max-w-[140px] sm:max-w-[160px] object-contain object-left"
            />
            <div className="hidden sm:block min-w-0">
              <p className="text-sm text-muted-foreground">Dashboard</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {activeTool && (
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-muted/50 border">
              <Badge variant="outline" className="text-xs bg-background/50">
                {activeTool.category}
              </Badge>
              <span className="text-sm font-medium">{activeTool.title}</span>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
