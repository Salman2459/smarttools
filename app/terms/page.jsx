"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, FileText, ShieldCheck, UserCheck, Gavel, Ban, XCircle, Mail, Scale, Globe, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

const termsSections = [
    {
        id: "agreement",
        icon: Gavel,
        title: "1. Agreement to Terms",
        content: (
            <>
                <p className="lead text-lg text-muted-foreground">
                    By accessing or using the website <strong>SmartTools.fun</strong> ("Site", "we", "us", or "our"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to all of these Terms, you are expressly prohibited from using the Site and must discontinue use immediately.
                </p>
                <p className="mt-4">
                    These Terms were last updated on <strong>February 26, 2026</strong>. We reserve the right to make changes to these Terms at any time. When we do, we will revise the updated date. Your continued use of the Site after any modification constitutes your acceptance of the new Terms.
                </p>
            </>
        )
    },
    {
        id: "user-representations",
        icon: UserCheck,
        title: "2. User Representations",
        content: (
            <>
                <p>By using the Site, you represent and warrant that:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>You have the legal capacity to enter into these Terms and agree to comply with them.</li>
                    <li>You are not a minor in the jurisdiction in which you reside, or you have parental permission to use the Site.</li>
                    <li>You will not access the Site through automated or non-human means (bots, scripts, etc.)</li>
                    <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                    <li>Your use of the Site will not violate any applicable law or regulation.</li>
                    <li>Any files you upload for processing are owned by you or you have the legal right to use them.</li>
                </ul>
            </>
        )
    },
    {
        id: "services",
        icon: Globe,
        title: "3. Our Services",
        content: (
            <>
                <p>
                    SmartTools.fun provides a suite of <strong>free online productivity tools</strong> including but not limited to: image conversion, PDF conversion, image compression, video tools, AI-powered text tools, and QR/barcode generators.
                </p>
                <h3 className="text-lg font-semibold mt-5 mb-2">Free Tools</h3>
                <p>
                    All tools on SmartTools.fun are provided free of charge. We reserve the right to modify, suspend, or discontinue any tool at any time without prior notice.
                </p>
                <h3 className="text-lg font-semibold mt-5 mb-2">File Handling</h3>
                <p>
                    Files uploaded to our tools are processed for the sole purpose of providing you with the requested service. Files are automatically deleted after processing and are never stored, shared, or analyzed by us. By uploading files, you confirm you have the right to do so.
                </p>
                <h3 className="text-lg font-semibold mt-5 mb-2">Third-Party Advertising</h3>
                <p>
                    Our Site is supported by advertising, including <strong>Google AdSense</strong>. Third-party ad partners may use cookies to serve relevant ads. By using this Site, you consent to the use of such advertising technologies as described in our{" "}
                    <Link href="/privacypolicy" className="text-primary underline">Privacy Policy</Link>.
                </p>
            </>
        )
    },
    {
        id: "prohibited-activities",
        icon: Ban,
        title: "4. Prohibited Activities",
        content: (
            <>
                <p>You may not access or use the Site for any purpose other than that for which we make the Site available. As a user of the Site, you agree <strong>not</strong> to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Use the Site in any way that violates applicable federal, state, local, or international law or regulation.</li>
                    <li>Systematically retrieve data or other content from the Site to create compilations, databases, or directories without written permission.</li>
                    <li>Use any automated means (bots, crawlers, scrapers) to access or interact with the Site.</li>
                    <li>Interfere with, disrupt, or create an undue burden on the Site's infrastructure or networks.</li>
                    <li>Attempt to gain unauthorized access to any portion of the Site or its related systems.</li>
                    <li>Upload or transmit viruses, malware, or any other malicious code.</li>
                    <li>Upload content that is illegal, offensive, hateful, defamatory, or infringes upon the intellectual property rights of others.</li>
                    <li>Use the Site to send unsolicited communications (spam).</li>
                    <li>Copy, adapt, reverse engineer, or decompile any software on the Site.</li>
                    <li>Use any device or technique to circumvent ad-blocking detection or ad-serving systems.</li>
                </ul>
            </>
        )
    },
    {
        id: "ip-rights",
        icon: FileText,
        title: "5. Intellectual Property Rights",
        content: (
            <>
                <p>
                    Unless otherwise indicated, the Site and all its content — including source code, designs, software, text, graphics, logos, and trademarks — are the proprietary property of <strong>SmartTools.fun</strong> and are protected by applicable copyright and intellectual property laws.
                </p>
                <p className="mt-4">
                    You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Site for your personal, non-commercial use. This license does not include the right to:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Reproduce, distribute, or publicly display any site content without prior written consent.</li>
                    <li>Modify or create derivative works from the Site's content.</li>
                    <li>Use our trademarks or brand elements in any way not expressly authorized.</li>
                </ul>
            </>
        )
    },
    {
        id: "liability-limitation",
        icon: XCircle,
        title: "6. Limitation of Liability",
        content: (
            <>
                <p>
                    To the maximum extent permitted by applicable law, SmartTools.fun and its affiliates, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to: loss of profits, loss of data, loss of goodwill, service interruption, computer damage, or system failure — even if advised of the possibility of such damages.
                </p>
                <p className="mt-4">
                    Our total liability to you for all claims arising out of or relating to the use of the Site shall not exceed <strong>$100 USD</strong> in any case.
                </p>
            </>
        )
    },
    {
        id: "disclaimer",
        icon: ShieldCheck,
        title: "7. Disclaimer of Warranties",
        content: (
            <p>
                THE SITE IS PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS. YOUR USE OF THE SITE AND OUR SERVICES IS AT YOUR SOLE RISK. WE EXPRESSLY DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE.
            </p>
        )
    },
    {
        id: "third-party-links",
        icon: Globe,
        title: "8. Third-Party Websites & Ads",
        content: (
            <>
                <p>
                    The Site may contain links to third-party websites, and advertisements provided by Google AdSense may lead to external websites. These third-party sites have their own privacy policies and terms of service, and we do not accept responsibility or liability for their practices or content.
                </p>
                <p className="mt-4">
                    We encourage you to review the privacy policies and terms of any third-party sites you visit through our Site or advertisements.
                </p>
            </>
        )
    },
    {
        id: "governing-law",
        icon: Scale,
        title: "9. Governing Law",
        content: (
            <p>
                These Terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction, without regard to its conflict of law provisions. By using the Site, you submit to the personal jurisdiction of the courts applicable in the governing jurisdiction for the purpose of litigating all claims or disputes.
            </p>
        )
    },
    {
        id: "modifications",
        icon: RefreshCw,
        title: "10. Modifications to Terms",
        content: (
            <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will update the "Last Updated" date at the top of this page. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Site after any revisions become effective, you agree to be bound by the revised Terms.
            </p>
        )
    },
    {
        id: "contact-us",
        icon: Mail,
        title: "11. Contact Us",
        content: (
            <>
                <p>If you have any questions about these Terms and Conditions, please contact us:</p>
                <ul className="list-none mt-3 space-y-2">
                    <li><strong>Email:</strong> <a href="mailto:support@smarttools.fun" className="text-primary underline">support@smarttools.fun</a></li>
                    <li><strong>Website:</strong> <a href="https://smarttools.fun/contact" className="text-primary underline">https://smarttools.fun/contact</a></li>
                </ul>
            </>
        )
    },
];

export default function TermsAndConditionsPage() {
    const lastUpdated = "February 26, 2026";

    return (
        <>
            <head>
                <link rel="canonical" href="https://smarttools.fun/terms/" />
                <meta name="title" content="Terms & Conditions of Use | SmartTools.fun" />
                <meta name="description" content="Read the SmartTools.fun Terms & Conditions. Understand the rules for using our free online tools, including file handling, prohibited activities, and our advertising policies." />
            </head>
            <main className="bg-background">
                {/* Section 1: Hero */}
                <motion.section
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative py-24 sm:py-32 bg-cover bg-center text-white"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2670&auto=format&fit=crop')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/60 backdrop-blur-sm"></div>
                    <div className="relative container mx-auto px-4 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
                            <Scale className="w-4 h-4" />
                            <span>Legal Information</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">Terms &amp; Conditions</h1>
                        <p className="mt-4 text-lg text-neutral-300">Please read our terms carefully. Last Updated: {lastUpdated}</p>
                    </div>
                </motion.section>

                {/* Section 2: Content with Sticky Navigation */}
                <section className="py-16 sm:py-24">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-4 gap-12">

                            {/* Left Side: Sticky Table of Contents */}
                            <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
                                <div className="bg-muted/30 rounded-xl p-5 border">
                                    <h3 className="text-lg font-semibold mb-4">Sections</h3>
                                    <ul className="space-y-2">
                                        {termsSections.map(section => (
                                            <li key={section.id}>
                                                <Link href={`#${section.id}`} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm py-1">
                                                    <section.icon className="w-4 h-4 flex-shrink-0" />
                                                    <span>{section.title}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </aside>

                            {/* Right Side: Main Content */}
                            <div className="lg:col-span-3">
                                <div className="space-y-12">
                                    {termsSections.map(section => (
                                        <motion.div
                                            key={section.id}
                                            id={section.id}
                                            initial={{ opacity: 0, y: 40 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.1 }}
                                            viewport={{ once: true }}
                                        >
                                            <h2 className="text-2xl sm:text-3xl font-bold border-b pb-4 mb-6 flex items-center gap-3">
                                                <section.icon className="w-7 h-7 text-primary" />
                                                {section.title}
                                            </h2>
                                            <div className="prose prose-neutral dark:prose-invert max-w-none prose-p:text-muted-foreground prose-li:text-muted-foreground prose-ul:list-disc prose-ul:pl-6">
                                                {section.content}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Contact Call-to-Action */}
                <section className="py-16 sm:py-24 bg-muted/30">
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h2 className="text-3xl font-bold mb-3">Have Legal Questions?</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                                If you have any questions about these Terms, please contact us and we&apos;ll get back to you as soon as possible.
                            </p>
                            <Link href="/contact">
                                <Button size="lg">
                                    Get in Touch <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>
        </>
    );
}