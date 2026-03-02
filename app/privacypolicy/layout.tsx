import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy & Data Usage | SmartTools.fun",
  description:
    "SmartTools.fun Privacy Policy: how we collect, use, and protect your data. Includes disclosure of Google AdSense, cookies, web beacons, and third-party ad serving. Compliant with Google Publisher Policies.",
  alternates: {
    canonical: "https://smarttools.fun/privacypolicy",
  },
  openGraph: {
    title: "Privacy Policy | SmartTools.fun",
    url: "https://smarttools.fun/privacypolicy",
  },
}

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
