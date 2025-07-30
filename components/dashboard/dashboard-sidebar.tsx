"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Plus } from "lucide-react"
import type { toolsData } from "@/lib/tools-data"
type Tool = typeof toolsData[number]

interface DashboardSidebarProps {
  tools: Tool[]
  activeToolId: string
  onToolSelect: (toolId: string) => void
  isOpen: boolean
  onClose: () => void
}

export function DashboardSidebar({ tools, activeToolId, onToolSelect, isOpen, onClose }: DashboardSidebarProps) {
  const categories = [...new Set(tools.map((tool) => tool.category))]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="font-semibold text-lg mb-2">Tools</h2>
        <p className="text-sm text-muted-foreground">Select a tool to get started</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="font-medium text-sm text-muted-foreground mb-3 px-2">{category}</h3>
              <div className="space-y-1">
                {tools
                  .filter((tool) => tool.category === category)
                  .map((tool) => (
                    <Button
                      key={tool.id}
                      variant={activeToolId === tool.id ? "secondary" : "ghost"}
                      className={`w-full justify-start h-auto p-3 transition-all duration-300 hover:scale-[1.02] ${activeToolId === tool.id
                          ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm"
                          : "hover:bg-muted/50"
                        }`}
                      onClick={() => {
                        onToolSelect(tool.id)
                        onClose()
                      }}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${tool.bgColor} flex items-center justify-center mr-3 flex-shrink-0 transition-transform duration-300 ${activeToolId === tool.id ? "scale-110" : "group-hover:scale-105"
                          }`}
                      >
                        <tool.icon className={`w-4 h-4 ${tool.color}`} />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{tool.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{tool.description}</div>
                      </div>
                    </Button>
                  ))}
              </div>
            </div>
          ))}

          <div className="border-t pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-3 border-dashed border-2 opacity-60"
              disabled
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mr-3">
                <Plus className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-left">
                <div className="font-medium text-sm text-muted-foreground">More Tools</div>
                <div className="text-xs text-muted-foreground">Coming soon</div>
              </div>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:top-16">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
