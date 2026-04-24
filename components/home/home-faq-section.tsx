import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const faqs = [
    {
        q: "Are all tools on SmartTools.fun completely free?",
        a: "Core utilities stay free at the point of use: open a tool, run your job, download or copy the result. SmartTools.fun is supported in part by Google AdSense display ads, which helps pay for bandwidth and development instead of charging per conversion. Fair-use expectations and our terms still apply—this is not unlimited API-style automation.",
    },
    {
        q: "Do I need to create an account to use the tools?",
        a: "No. We skip mandatory sign-up so teachers, travelers, and contractors can finish one-off tasks on shared PCs. Bookmark individual /tools/ URLs if you revisit weekly; accounts are optional only if we add them later for saved preferences.",
    },
    {
        q: "Are my uploaded files secure?",
        a: "Files are handled to produce your output and should not linger for unrelated analytics. Avoid regulated or classified data on any consumer website—including ours—and follow your employer’s policy on public Wi‑Fi. Clear downloads and close tabs on kiosks after sensitive work.",
    },
    {
        q: "What file formats are supported?",
        a: "Coverage spans raster images, common Office formats, HTML, plain text, video, and many developer formats inside the viewers. Because each converter is different, read the accept list on the specific tool page; similar-sounding utilities (for example PNG→JPG versus PNG→WebP) exist for different trade-offs.",
    },
    {
        q: "Why do I see advertisements on the site?",
        a: "AdSense placements fund hosting and improvements while keeping tools accessible globally. You may see contextual or interest-based ads; Google’s settings explain how to limit personalization. We aim to balance revenue with readable layouts and substantive articles—not empty grids.",
    },
    {
        q: "Can I use SmartTools.fun on my phone or tablet?",
        a: "Layouts are responsive. Quick image tweaks, QR generation, or text checks work well on phones; large video jobs or huge spreadsheets are usually smoother on Wi‑Fi with a desktop browser. No app store install is required—just use a current mobile browser.",
    },
]

export function HomeFAQSection() {
    return (
        <section className="py-16 sm:py-20 px-4 bg-background">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4">FAQ</Badge>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to know about SmartTools.fun. Can't find the answer? Contact our support team.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <details
                            key={idx}
                            className="group bg-muted/30 border rounded-xl overflow-hidden"
                        >
                            <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-base hover:bg-muted/50 transition-colors list-none">
                                <span>{faq.q}</span>
                                <span className="ml-4 flex-shrink-0 text-muted-foreground group-open:rotate-45 transition-transform duration-200 text-2xl font-light">+</span>
                            </summary>
                            <div className="px-5 pb-5 text-muted-foreground leading-relaxed text-sm border-t border-muted">
                                <div className="pt-4">{faq.a}</div>
                            </div>
                        </details>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <p className="text-muted-foreground mb-4">Still have questions?</p>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/contact">
                            Contact Our Support Team <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
