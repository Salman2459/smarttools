import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { ToolHighlightsSection } from "@/components/home/tool-highlights-section"
import { WhyUsSection } from "@/components/home/why-us-section"
import { HowToUseSection } from "@/components/home/how-to-use"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { HomeFAQSection } from "@/components/home/home-faq-section"
import { HomeSeoRichSection } from "@/components/home/home-seo-rich-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <head>
        <link rel="canonical" href="https://smarttools.fun" />
        <meta
          name="description"
          content="SmartTools.fun – Free online tools for image conversion, PDF creation, image compression, video editing, AI text tools, QR code generation and more. No sign-up required."
        />
      </head>
      <div className="min-h-screen">
        {/* 1. Hero – above the fold, key value prop */}
        <HeroSection />

        {/* 2. All Tools search grid */}
        <FeaturesSection />

        {/* 3. Highlighted tool cards with rich descriptions (good for SEO) */}
        <ToolHighlightsSection />

        {/* 3b. Long-form guide-style content + cards (AdSense-friendly depth) */}
        <HomeSeoRichSection />

        {/* 4. Why choose us + stats strip */}
        <WhyUsSection />

        {/* 5. How to use – 3-step explainer */}
        <HowToUseSection />

        {/* 6. Testimonials – social proof */}
        <TestimonialsSection />

        {/* 7. FAQ – keyword-rich, helps with AdSense approval */}
        <HomeFAQSection />

        {/* 8. Final CTA */}
        <CTASection />
      </div>
    </>
  )
}
