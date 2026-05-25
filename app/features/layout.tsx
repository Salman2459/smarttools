import type { Metadata } from "next"
import { getCanonicalUrl } from "@/lib/env"

export const metadata: Metadata = {
  title: "Explore the Full Range of Smart Tools Online",
  description:
    "Full directory of AllInOneTools: image and PDF converters, video utilities, QR and barcode generators, DNS checker, grammar and speech tools, and multi-format viewers—each with its own guide.",
  alternates: {
    canonical: getCanonicalUrl("/features/"),
  },
}

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return children
}
