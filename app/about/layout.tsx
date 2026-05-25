import type { Metadata } from "next"
import { getCanonicalUrl } from "@/lib/env"

export const metadata: Metadata = {
  title: "About AllInOneTools – Free Online Productivity Tools",
  description:
    "Learn about AllInOneTools – our mission to provide 30+ free, privacy-focused online tools for image conversion, PDF creation, video editing, and AI-powered productivity.",
  alternates: {
    canonical: getCanonicalUrl("/about/"),
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
