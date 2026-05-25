import type { Metadata } from "next"
import { getCanonicalUrl } from "@/lib/env"

export const metadata: Metadata = {
  title: "Terms & Conditions of Use | AllInOneTools",
  description:
    "Read the AllInOneTools Terms & Conditions. Understand the rules for using our free online tools, including file handling, prohibited activities, and our advertising policies.",
  alternates: {
    canonical: getCanonicalUrl("/terms/"),
  },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
