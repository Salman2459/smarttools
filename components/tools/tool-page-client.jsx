"use client"

import { useState } from "react"
import { ToolHeader } from "@/components/tools/tool-header"
import { ToolSidebar } from "@/components/tools/tool-sidebar"
import { ToolInterface } from "@/components/tools/tool-interface"
import { toolsData, iconMap } from "@/lib/tools-data"

export function ToolPageClient({ tool }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Convert iconName back to icon component
  const toolWithIcon = {
    ...tool,
    icon: iconMap[tool.iconName] || iconMap.FileImage,
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <ToolHeader tool={toolWithIcon} onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1">
        <ToolSidebar
          tools={toolsData}
          activeToolId={tool.id}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 lg:ml-64 pb-8">
          <div className="p-4 lg:p-8 min-h-full">
            <ToolInterface tool={toolWithIcon} />
          </div>
        </main>
      </div>
    </div>
  )
}
