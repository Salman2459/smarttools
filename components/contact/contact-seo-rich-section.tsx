import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Headphones, LifeBuoy, MessageCircle } from "lucide-react"

const supportTopics = [
  {
    icon: LifeBuoy,
    title: "Bug reports and errors",
    body: "If a tool shows an error message or produces an unexpected file, tell us which browser and operating system you use, roughly how large the file was, and whether the problem happens every time or only sometimes. Screenshots help when the issue is visual.",
  },
  {
    icon: MessageCircle,
    title: "Feature ideas and partnerships",
    body: "We welcome suggestions for new converters, viewers, or quality-of-life improvements. Briefly describe who would benefit and how it fits alongside existing tools. For business or media inquiries, mention your timeline and preferred contact method.",
  },
  {
    icon: Headphones,
    title: "Privacy and account questions",
    body: "SmartTools.fun does not require accounts for core utilities. If you have questions about cookies, ads, or data handling, you can also read our privacy policy and terms—those documents complement what we share here on the contact page.",
  },
]

export function ContactSeoRichSection() {
  return (
    <section className="py-16 sm:py-20 bg-muted/25 border-y border-border" aria-labelledby="contact-seo-heading">
      <div className="container mx-auto px-4 max-w-4xl space-y-10">
        <div className="text-center space-y-3">
          <Badge variant="outline">Support &amp; editorial</Badge>
          <h2 id="contact-seo-heading" className="text-2xl sm:text-3xl font-bold">
            How we handle messages and what to include for a faster reply
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            The contact form connects you with the SmartTools.fun team for technical help, feedback, and general questions about our free online tools. We read every message; response time is typically within one to two business days depending on volume and complexity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {supportTopics.map((t) => (
            <Card key={t.title} className="border bg-background">
              <CardHeader className="pb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-1">
                  <t.icon className="h-4 w-4" aria-hidden />
                </div>
                <CardTitle className="text-base">{t.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{t.body}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-5 text-sm sm:text-base leading-relaxed text-foreground">
          <p>
            When you write about a specific tool, link to its page or mention the exact name (for example, “PNG to JPG converter” rather than “image tool”). That small detail routes your email to the right mental context immediately. If you are a teacher or student referencing SmartTools.fun in coursework, you are welcome to quote short excerpts from our tool guides with attribution and a link to the canonical URL.
          </p>
          <p>
            Advertising on SmartTools.fun is served through Google AdSense. We do not sell email addresses from contact submissions to third-party marketers. Information you submit through the form is used to respond to you and to improve the service when your feedback identifies a recurring issue. For a full explanation of categories of data, cookies, and third-party processors, see our{" "}
            <Link href="/privacypolicy/" className="text-primary font-medium underline-offset-4 hover:underline">
              privacy policy
            </Link>
            . For acceptable use, intellectual property, and limitation of liability, see the{" "}
            <Link href="/terms/" className="text-primary font-medium underline-offset-4 hover:underline">
              terms of service
            </Link>
            .
          </p>
          <p>
            If you prefer not to use the form, you can email{" "}
            <a href="mailto:support@smarttools.fun" className="text-primary font-medium underline-offset-4 hover:underline">
              support@smarttools.fun
            </a>{" "}
            directly from your mail client. Include the same details you would in the form so we can troubleshoot efficiently. For the fastest self-service help, browse the{" "}
            <Link href="/features/" className="text-primary font-medium underline-offset-4 hover:underline">
              full tool directory
            </Link>{" "}
            and open the long FAQ section at the bottom of each tool page—many common questions about file limits, formats, and privacy are answered there in detail.
          </p>
        </div>
      </div>
    </section>
  )
}
