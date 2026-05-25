import type { Metadata } from "next"
import { getCanonicalUrl } from "@/lib/env"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { ToolHighlightsSection } from "@/components/home/tool-highlights-section"
import { WhyUsSection } from "@/components/home/why-us-section"
import { HowToUseSection } from "@/components/home/how-to-use"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { HomeFAQSection } from "@/components/home/home-faq-section"
import { HomeSeoRichSection } from "@/components/home/home-seo-rich-section"
import { CTASection } from "@/components/home/cta-section"

export const metadata: Metadata = {
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  description:
    "AllInOneTools: unique long-form help on every tool page—compress and convert images, build PDFs, edit video, check writing, generate QR codes, inspect DNS, and preview documents in your browser without signing up.",
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <ToolHighlightsSection />
      <HomeSeoRichSection />
      <WhyUsSection />
      <HowToUseSection />
      <TestimonialsSection />
      <HomeFAQSection />
      <CTASection />
    </div>
  )
}
