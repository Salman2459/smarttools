"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function ToolHeader({ tool, onMenuClick }) {
  const IconComponent = tool.icon

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

          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-lg bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  ProductivityHub
                </h1>
              </div>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-muted/50 border">
            <div className={`w-6 h-6 rounded-md ${tool.bgColor} flex items-center justify-center`}>
              <IconComponent className={`w-4 h-4 ${tool.color}`} />
            </div>
            <div className="hidden sm:block">
              <Badge variant="outline" className="text-xs bg-background/50 mr-2">
                {tool.category}
              </Badge>
              <span className="text-sm font-medium">{tool.title}</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
