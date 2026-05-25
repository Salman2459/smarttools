import type { Metadata } from "next"
import { getCanonicalUrl } from "@/lib/env"

export const metadata: Metadata = {
  title: "Contact AllInOneTools – Support, Feedback & Inquiries",
  description:
    "Get in touch with AllInOneTools for technical support, tool feedback, or business inquiries. We respond within 1–2 business days.",
  alternates: {
    canonical: getCanonicalUrl("/contact/"),
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
