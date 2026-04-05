import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileImage,
  FileText,
  Video,
  QrCode,
  Globe,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react"

const pillars = [
  {
    icon: FileImage,
    title: "Image & format conversion",
    body: "Compress JPG and PNG, resize for social templates, convert between WebP, SVG, and classic formats, and add watermarks before you publish. Every tool runs in the browser so you can iterate quickly when a client asks for “just one more size.”",
  },
  {
    icon: FileText,
    title: "PDF & office preparation",
    body: "Turn Word, Excel, HTML, and plain text into polished PDFs for sharing. When you need consistent typography across devices, PDF remains the safest choice for homework, invoices, and printable handouts.",
  },
  {
    icon: Video,
    title: "Lightweight video edits",
    body: "Trim intros, crop aspect ratios, and compress clips before you upload to hosting platforms. Smaller files mean faster uploads, fewer buffering errors for viewers, and lower storage bills on long-term archives.",
  },
  {
    icon: QrCode,
    title: "QR codes & barcodes",
    body: "Generate scannable codes for URLs, Wi‑Fi setup cards, inventory labels, and event check-in. Print-friendly output helps retail pop-ups and classrooms alike without dedicated design software.",
  },
  {
    icon: Globe,
    title: "DNS & network checks",
    body: "Verify propagation when you move domains or update email records. Seeing global DNS responses in one place reduces guesswork when a site looks “up for you but down for them.”",
  },
  {
    icon: Sparkles,
    title: "Text & language helpers",
    body: "Grammar checking and text-to-speech support clearer writing for international audiences. Hearing text aloud catches awkward phrasing that spell-check alone might miss.",
  },
]

export function HomeSeoRichSection() {
  return (
    <section className="py-16 sm:py-24 px-4 bg-muted/30 border-y border-border" aria-labelledby="home-seo-rich-heading">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="gap-1">
            <Zap className="h-3.5 w-3.5" aria-hidden />
            SmartTools.fun resource hub
          </Badge>
          <h2 id="home-seo-rich-heading" className="text-2xl sm:text-4xl font-bold tracking-tight">
            Free online productivity tools with real educational depth
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            SmartTools.fun exists as a practical alternative to bloated desktop suites when you only need one task done well: convert a file, check a record, or preview a document before a meeting. We publish long-form guides on every tool page so visitors understand not only which button to press but why that step matters for SEO, accessibility, and professional presentation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {pillars.map((p) => (
            <Card key={p.title} className="border bg-card/90 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                  <p.icon className="h-5 w-5" aria-hidden />
                </div>
                <CardTitle className="text-lg leading-snug">{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{p.body}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6 text-sm sm:text-base text-foreground leading-relaxed max-w-4xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-semibold">Why browser-based tools matter for modern workflows</h3>
          <p>
            Teams today work across time zones and device types. A designer might start on a company laptop, continue on a personal tablet, and approve a final export from a phone. Installing identical software everywhere is not always possible, especially on locked-down corporate machines or classroom Chromebooks. SmartTools.fun keeps the interface consistent: open the site, choose the utility, complete the job, and move on. That predictability reduces friction when you are juggling email, chat, and cloud storage tabs already.
          </p>
          <p>
            From a quality perspective, we focus on clarity and honest expectations. Browser-based image and video processing can handle most everyday files beautifully, while extremely large or unusual encodings may still need dedicated desktop software. We say that directly on tool pages because readers deserve transparency—not marketing hype—when they plan a production workflow. When you know the limits, you can combine our tools with offline apps in a sensible pipeline instead of hitting surprises at the deadline.
          </p>
          <p>
            Privacy and trust are part of the same story. Files you upload are processed to deliver your result and are not repurposed for unrelated analytics. We do not require accounts for core tools, which means fewer passwords to rotate and fewer databases holding your personal data. For sensitive contracts or regulated data, you should still follow your organization&apos;s policies and use approved environments; for everyday creative and office tasks, SmartTools.fun aims to be a convenient layer on top of your existing habits.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold pt-2">Content quality, advertising, and how we support the site</h3>
          <p>
            SmartTools.fun is supported in part by display advertising, including Google AdSense. Ads help cover hosting, bandwidth, and development time so the tools remain free at the point of use. We pair those placements with substantive pages: each tool includes a detailed guide, benefit cards, and frequently asked questions written for humans first and search engines second. That approach aligns with modern expectations for helpful content—readers should leave with a clearer understanding of the task, not just a download button.
          </p>
          <p>
            If you are a student, educator, or blogger, you can safely link to individual tool pages as references for “how to compress an image before uploading to WordPress” or “how to verify DNS after changing registrars.” The canonical URLs use HTTPS and stable paths under <code className="text-sm bg-muted px-1.5 py-0.5 rounded">/tools/</code> so your citations stay valid over time. We also maintain a public sitemap and robots configuration so crawlers can discover updates when we add new utilities or expand documentation.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold pt-2">Getting the most from SmartTools.fun</h3>
          <p>
            Start from the home page to browse categories, or jump to the <Link href="/features/" className="text-primary font-medium underline-offset-4 hover:underline">full feature directory</Link> if you already know the format you need. Read the short description on each card, then open the tool. When you are unsure which option to pick—PNG versus JPG, for example—read the guide section below the interface on the tool page; it explains trade-offs in plain language. Bookmark the tools you reuse weekly and keep a notes file with the settings that produced the best results for your brand or classroom.
          </p>
          <p>
            For questions about policies, data handling, or partnerships, visit our <Link href="/about/" className="text-primary font-medium underline-offset-4 hover:underline">about</Link>,{" "}
            <Link href="/contact/" className="text-primary font-medium underline-offset-4 hover:underline">contact</Link>,{" "}
            <Link href="/privacypolicy/" className="text-primary font-medium underline-offset-4 hover:underline">privacy policy</Link>, and{" "}
            <Link href="/terms/" className="text-primary font-medium underline-offset-4 hover:underline">terms</Link> pages. We welcome feedback when a tool could be clearer or when a new workflow would help your community—many additions to SmartTools.fun started as user suggestions.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
            <Shield className="h-5 w-5 text-primary shrink-0" aria-hidden />
            <p className="text-sm text-muted-foreground m-0">
              <strong className="text-foreground">Tip:</strong> Combine multiple tools in sequence—optimize an image, embed it in a PDF, then generate a QR code linking to the final download—for end-to-end workflows without leaving your browser.
            </p>
          </div>

          <h3 className="text-xl sm:text-2xl font-semibold pt-6">Editorial standards for helpful, people-first pages</h3>
          <p>
            Search engines and human readers both reward pages that answer follow-up questions before they are asked. That is why we describe not only what each tool does but also typical failure modes: a PDF that looks correct on screen but embeds the wrong font, an image that is sharp on desktop but oversized on mobile, or a DNS record that propagates in one region before another. When you understand those patterns, you waste less time guessing and more time shipping finished work.
          </p>
          <p>
            We also acknowledge the role of advertising in keeping utilities free. Transparency about AdSense, cookies, and opt-out links belongs in the same conversation as feature lists. Visitors deserve to know how the site sustains itself without surprise paywalls. If you are a publisher evaluating SmartTools.fun as a reference for your own audience, you can quote short excerpts with attribution and point readers to our canonical URLs for the latest instructions.
          </p>
        </div>
      </div>
    </section>
  )
}
