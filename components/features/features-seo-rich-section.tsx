import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Layers, Search } from "lucide-react"

const topicCards = [
  {
    title: "Browse by category",
    body: "Image Tools, PDF Tools, Text Tools, Video Tools, Viewer Tools, and Other Tools each group related utilities. If you know your end goal—smaller photos, a print-ready PDF, or a scannable QR code—start from the category that matches and open the specific converter or editor you need.",
  },
  {
    title: "Read before you upload",
    body: "Every tool page includes a long guide beneath the interface. Those sections explain typical use cases, privacy expectations, and answers to common questions. Spending two minutes reading often prevents the wrong export settings or an unexpected file size limit.",
  },
  {
    title: "Chain tools together",
    body: "Many projects need more than one step: compress an image, embed it in a document, export to PDF, then share a link. SmartTools.fun is designed so you can move between tools in new tabs without losing momentum.",
  },
]

export function FeaturesSeoRichSection() {
  return (
    <section className="mt-16 sm:mt-20 pt-12 border-t border-border" aria-labelledby="features-seo-heading">
      <div className="max-w-4xl mx-auto space-y-10 px-1">
        <div className="text-center space-y-3">
          <Badge variant="secondary" className="gap-1">
            <Search className="h-3.5 w-3.5" aria-hidden />
            Directory guide
          </Badge>
          <h2 id="features-seo-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">
            How to choose the right SmartTools.fun feature for your task
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            This directory lists every public tool on SmartTools.fun in one scrollable grid. Use it when you know you need “some kind of converter” but are not sure of the exact name, or when you want to compare similar utilities side by side before opening a tool page.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {topicCards.map((c) => (
            <Card key={c.title} className="border bg-muted/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary shrink-0" aria-hidden />
                  {c.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{c.body}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-5 text-sm sm:text-base leading-relaxed text-foreground">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" aria-hidden />
            Understanding the full SmartTools.fun feature set
          </h3>
          <p>
            Image utilities cover compression, resizing, cropping, watermarking, and dozens of format conversions between PNG, JPG, JPEG, WebP, SVG, and related types. Those tools matter for bloggers who must meet strict upload limits, for ecommerce managers who need consistent catalog dimensions, and for students who submit assignments through learning portals with file-size caps. PDF utilities focus on turning editable office files and HTML into stable PDFs for submission and archiving, which is still the default format for legal and academic workflows worldwide.
          </p>
          <p>
            Text and language features include grammar checking and text-to-speech. They support non-native English speakers, accessibility reviewers who listen to copy aloud, and anyone polishing a cover letter before sending it. Video utilities compress, trim, and crop clips so you can respect platform limits on duration and aspect ratio without learning a full nonlinear editor. Generator and network utilities round out the catalog with QR codes, barcodes, and DNS propagation checks—small but critical tasks for IT admins, event organizers, and retail staff.
          </p>
          <p>
            Viewer tools open spreadsheets, Word documents, code files, JSON, Markdown, images, and PDFs in the browser when you only need to read or inspect content. That is especially useful on shared computers or Chromebooks where installing LibreOffice or Adobe Acrobat is not an option. When a file is sensitive, use your organization&apos;s approved workflow; for general-purpose reading, viewers save time and disk space.
          </p>
          <p>
            SmartTools.fun does not lock features behind accounts. The trade-off is that you should keep local backups of important files and note which settings worked for your brand. For more context on our mission, privacy practices, and support channels, read the{" "}
            <Link href="/about/" className="text-primary font-medium underline-offset-4 hover:underline">
              about page
            </Link>
            , then return here whenever you need a different tool. The home page also highlights featured workflows if you prefer a curated path instead of browsing the full grid.
          </p>
        </div>
      </div>
    </section>
  )
}
