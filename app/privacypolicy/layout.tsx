import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy & Data Usage | AllInOneTools",
  description:
    "AllInOneTools Privacy Policy: how we collect, use, and protect your data. Includes disclosure of Google AdSense, cookies, web beacons, and third-party ad serving. Compliant with Google Publisher Policies.",
  alternates: {
    canonical: "https://allinonetools.online/privacypolicy",
  },
  openGraph: {
    title: "Privacy Policy | AllInOneTools",
    url: "https://allinonetools.online/privacypolicy",
  },
}

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
