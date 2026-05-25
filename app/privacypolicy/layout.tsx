import type { Metadata } from "next"
import { getCanonicalUrl } from "@/lib/env"

export const metadata: Metadata = {
  title: "Privacy Policy & Data Usage | AllInOneTools",
  description:
    "AllInOneTools Privacy Policy: how we collect, use, and protect your data. Includes disclosure of Google AdSense, cookies, web beacons, and third-party ad serving. Compliant with Google Publisher Policies.",
  alternates: {
    canonical: getCanonicalUrl("/privacypolicy/"),
  },
  openGraph: {
    title: "Privacy Policy | AllInOneTools",
    url: getCanonicalUrl("/privacypolicy/"),
  },
}

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
