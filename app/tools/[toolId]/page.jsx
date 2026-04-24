import { notFound } from "next/navigation"
import { toolsData } from "@/lib/tools-data"
import { buildToolSeoContent } from "@/lib/tool-seo-content"
import { ToolSeoGuide } from "@/components/seo/tool-seo-guide"
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
      alternates: {
        canonical: `https://smarttools.fun/tools/${toolId}`,
      },
    }
  }

  return {
    title: `${tool.metaTitle}`,
    description: tool.metaDescription,
    keywords: [
      tool.title.toLowerCase(),
      tool.id.replace(/-/g, " "),
      tool.category.toLowerCase(),
      "smarttools.fun",
      `${tool.category.toLowerCase()} online`,
      tool.category.includes("Image")
        ? "image conversion browser"
        : tool.category.includes("PDF")
          ? "pdf converter online"
          : tool.category.includes("Video")
            ? "video tool online"
            : tool.category.includes("Viewer")
              ? "document viewer online"
              : "free online tool",
    ],
    alternates: {
      canonical: `https://smarttools.fun/tools/${toolId}`,
    },
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
    iconName: tool.iconName,
    acceptedTypes: tool.acceptedTypes,
    color: tool.color,
    bgColor: tool.bgColor,
    category: tool.category,
    metaDescription: tool.metaDescription,
  }

  const seoContent = buildToolSeoContent(serializableTool)

  return (
    <ToolPageClient tool={serializableTool}>
      <ToolSeoGuide
        content={seoContent}
        toolTitle={tool.title}
        category={tool.category}
      />
    </ToolPageClient>
  )
}
