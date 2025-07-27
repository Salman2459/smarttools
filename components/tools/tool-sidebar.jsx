"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Plus, ArrowLeft, ChevronDown, ChevronUp, Image, Search } from "lucide-react"

// Component for a single tool item to avoid repetition
const ToolItem = ({ tool, activeToolId, toolRefs, onClose }) => (
  <Tooltip key={tool.id} delayDuration={100}>
    <TooltipTrigger asChild>
      <Button
        asChild
        ref={(el) => (toolRefs.current[tool.id] = el)}
        variant={activeToolId === tool.id ? "secondary" : "ghost"}
        className={`w-full justify-start h-auto p-3 transition-all duration-300 hover:scale-[1.02] ${activeToolId === tool.id
            ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm"
            : "hover:bg-muted/50"
          }`}
      >
        <Link href={`/tools/${tool.id}`} onClick={onClose}>
          <div
            className={`w-8 h-8 rounded-lg ${tool.bgColor} flex items-center justify-center mr-3 flex-shrink-0 transition-transform duration-300 ${activeToolId === tool.id ? "scale-110" : "group-hover:scale-105"
              }`}
          >
            <tool.icon className={`w-4 h-4 ${tool.color}`} />
          </div>
          <div className="text-left flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{tool.title}</div>
            <div className="w-36 text-xs text-muted-foreground truncate whitespace-nowrap overflow-hidden">
              {tool.description}
            </div>
          </div>
        </Link>
      </Button>
    </TooltipTrigger>
    <TooltipContent side="bottom" align="start">
      <p className="max-w-[200px]">{tool.description}</p>
    </TooltipContent>
  </Tooltip>
);

// Moved SidebarContent to its own component to prevent re-renders causing focus loss
function SidebarContent({
  tools,
  activeToolId,
  onClose,
  searchQuery,
  setSearchQuery,
  expandedCategories,
  toggleCategory,
  toolRefs,
}) {
  const filteredToolsBySearch = tools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(tools.map((tool) => tool.category))];

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-4">
            <Button asChild variant="ghost" size="sm" className="p-2">
              <Link href="/features">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h2 className="font-semibold text-lg">Tools</h2>
              <p className="text-sm text-muted-foreground">Select a tool to get started</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tools..."
              className="w-full pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {/* SEARCH VIEW: Render a flat list of results */}
            {searchQuery !== "" && (
              <>
                {filteredToolsBySearch.length > 0 ? (
                  <div className="space-y-1">
                    {filteredToolsBySearch.map((tool) => (
                      <ToolItem key={tool.id} tool={tool} activeToolId={activeToolId} toolRefs={toolRefs} onClose={onClose} />
                    ))}
                  </div>
                ) : (
                  <p className="px-2 text-center text-sm text-muted-foreground">No tools found.</p>
                )}
              </>
            )}

            {/* BROWSE VIEW: Render categories and dropdowns */}
            {searchQuery === "" &&
              categories.map((category) => {
                const toolsForCategory = tools.filter((tool) => tool.category === category);
                const isExpanded = expandedCategories[category] || false;

                return (
                  <div key={category}>
                    <h3 className="font-medium text-sm text-muted-foreground mb-3 px-2">{category}</h3>
                    <div className="space-y-1">
                      {toolsForCategory
                        .filter(tool => {
                          if (category === "Image Tools") {
                            return !tool.title.toLowerCase().includes('converter') && !tool.title.toLowerCase().includes('to');
                          }
                          return true;
                        })
                        .map((tool) => (
                          <ToolItem key={tool.id} tool={tool} activeToolId={activeToolId} toolRefs={toolRefs} onClose={onClose} />
                        ))}

                      {category === "Image Tools" && (
                        <div className="relative">
                          <Button variant="ghost" className={`w-full justify-start h-auto p-3 transition-all duration-300 hover:scale-[1.02] ${isExpanded ? "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm" : "hover:bg-muted/50"}`} onClick={() => toggleCategory(category)}>
                            <div className="flex items-center gap-3 w-full">
                              <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${isExpanded ? "scale-110" : "group-hover:scale-105"}`}>
                                <Image className="w-4 h-4" alt="icon" color="yellow" />
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <div className="font-medium text-sm truncate flex gap-2">
                                  Image Converters
                                  {isExpanded ? <ChevronUp className="w-4 h-4 mt-[1px]" /> : <ChevronDown className="w-4 h-4 mt-[1px]" />}
                                </div>
                                <div className="text-xs text-muted-foreground truncate mt-1">Convert your images in another format</div>
                              </div>
                            </div>
                          </Button>
                          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'h-auto opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                            <div className="bg-background border border-border rounded-md shadow-lg">
                              {toolsForCategory
                                .filter(tool => tool.title.toLowerCase().includes('converter') || tool.title.toLowerCase().includes('to'))
                                .map((tool) => (
                                  <Tooltip key={tool.id} delayDuration={100}>
                                    <TooltipTrigger asChild>
                                      <Button asChild ref={(el) => (toolRefs.current[tool.id] = el)} variant="ghost" className={`w-full justify-start px-3 py-2 text-sm rounded-none border-0 hover:bg-muted ${activeToolId === tool.id ? "bg-primary/10 text-primary" : ""}`}>
                                        <Link href={`/tools/${tool.id}`} onClick={onClose}>
                                          <div className="flex items-center gap-3 w-full">
                                            <div className={`w-6 h-6 rounded ${tool.bgColor} flex items-center justify-center flex-shrink-0`}>
                                              <tool.icon className={`w-3 h-3 ${tool.color}`} />
                                            </div>
                                            <div className="text-left flex-1 min-w-0">
                                              <div className="font-medium truncate">{tool.title}</div>
                                            </div>
                                          </div>
                                        </Link>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" align="start">
                                      <p className="max-w-[200px]">{tool.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            {searchQuery === "" && (
              <div className="border-t pt-4">
                <Button variant="ghost" className="w-full justify-start h-auto p-3 border-dashed border-2 opacity-60" disabled>
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center mr-3">
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm text-muted-foreground">More Tools</div>
                    <div className="text-xs text-muted-foreground">Coming soon</div>
                  </div>
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}

export function ToolSidebar({ tools, activeToolId, isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategories, setExpandedCategories] = useState({})
  const [userToggled, setUserToggled] = useState({})
  const toolRefs = useRef({})

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
    setUserToggled((prev) => ({ ...prev, [category]: true }))
  }

  useEffect(() => {
    // Expand converter dropdown if the active tool is a converter
    const currentTool = tools.find(t => t.id === activeToolId)
    if (
      searchQuery === "" && // Only do this when not searching
      currentTool?.category === "Image Tools" &&
      (currentTool.title.toLowerCase().includes("converter") || currentTool.title.toLowerCase().includes("to")) &&
      !userToggled["Image Tools"]
    ) {
      setExpandedCategories(prev => ({ ...prev, "Image Tools": true }))
    }

    // Scroll to active tool
    if (toolRefs.current[activeToolId]) {
      toolRefs.current[activeToolId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [activeToolId, tools, userToggled, searchQuery])

  const sidebarProps = {
    tools,
    activeToolId,
    isOpen,
    onClose,
    searchQuery,
    setSearchQuery,
    expandedCategories,
    toggleCategory,
    toolRefs,
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:top-16">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background">
          <SidebarContent {...sidebarProps} />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent {...sidebarProps} />
        </SheetContent>
      </Sheet>
    </>
  )
}