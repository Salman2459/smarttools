import { notFound } from "next/navigation"
import { toolsData } from "@/lib/tools-data"
import { ToolPageClient } from "@/components/tools/tool-page-client"

export async function generateStaticParams() {
  return toolsData.map((tool) => ({
    toolId: tool.id,
  }))
}

export async function generateMetadata({ params }) {
  const { toolId } = await params
  const tool = toolsData.find((t) => t.id === toolId)

  if (!tool) {
    return {
      title: "Tool Not Found",
    }
  }

  return {
    title: `${tool.title} - SmartTools`,
    description: tool.description,
    keywords: [tool.title.toLowerCase(), tool.category.toLowerCase(), "productivity tools", "file conversion"],
  }
}

export default async function ToolPage({ params }) {
  const { toolId } = await params
  const tool = toolsData.find((t) => t.id === toolId)

  if (!tool) {
    notFound()
  }

  // Create a serializable version of the tool data
  const serializableTool = {
    id: tool.id,
    title: tool.title,
    description: tool.description,
    iconName: tool.iconName, // We'll use icon name instead of component
    acceptedTypes: tool.acceptedTypes,
    color: tool.color,
    bgColor: tool.bgColor,
    category: tool.category,
  }

  return <ToolPageClient tool={serializableTool} />
}
