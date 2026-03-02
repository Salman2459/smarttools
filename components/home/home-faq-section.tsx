import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const faqs = [
    {
        q: "Are all tools on SmartTools.fun completely free?",
        a: "Yes! Every tool on SmartTools.fun is 100% free to use. There are no hidden fees, premium plans, or required subscriptions. We generate revenue through advertising (Google AdSense) which allows us to keep everything free."
    },
    {
        q: "Do I need to create an account to use the tools?",
        a: "No account or registration is required. Simply navigate to any tool, upload your file, and get instant results. We believe productivity tools should be accessible to everyone without barriers."
    },
    {
        q: "Are my uploaded files secure?",
        a: "Absolutely. Files you upload are processed solely for the purpose you intend (e.g., conversion, compression) and are automatically deleted from our servers immediately after processing. We never store, read, analyze, or share your files."
    },
    {
        q: "What file formats are supported?",
        a: "SmartTools.fun supports a wide range of formats including JPG, JPEG, PNG, WebP, SVG, PDF, DOCX (Word), XLSX (Excel), TXT, and more. Each tool page lists all supported input and output formats."
    },
    {
        q: "Why do I see advertisements on the site?",
        a: "Ads served through Google AdSense help us cover server costs and develop new tools — keeping everything free for you. Google may use cookies to show you relevant ads. You can opt out of personalized ads at Google Ads Settings."
    },
    {
        q: "Can I use SmartTools.fun on my phone or tablet?",
        a: "Yes! All our tools are fully responsive and optimized for mobile browsers. No app download is needed — just open your browser and start using any tool instantly."
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
