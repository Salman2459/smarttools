"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, FileText, Shield, Cookie, Users, Info, Mail, Eye, Globe, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

const policySections = [
    {
        id: "introduction",
        icon: Info,
        title: "Introduction",
        content: (
            <>
                <p className="lead text-lg text-muted-foreground">
                    Welcome to <strong>SmartTools.fun</strong>. We are committed to protecting your privacy and being transparent about how we use data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at <strong>https://smarttools.fun</strong>.
                </p>
                <p className="mt-4 text-muted-foreground">
                    Please read this policy carefully. If you disagree with its terms, please discontinue use of the site. This policy was last updated on <strong>February 26, 2026</strong>.
                </p>
            </>
        )
    },
    {
        id: "information-collection",
        icon: FileText,
        title: "1. Information We Collect",
        content: (
            <>
                <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>

                <h3 className="text-lg font-semibold mt-5 mb-2">Personal Data You Provide</h3>
                <p>When you use our contact form, you voluntarily provide us with personally identifiable information such as your <strong>name</strong> and <strong>email address</strong>. You are under no obligation to provide us with personal information of any kind.</p>

                <h3 className="text-lg font-semibold mt-5 mb-2">Automatically Collected Usage Data</h3>
                <p>When you visit SmartTools.fun, our servers and third-party services may automatically collect certain technical information, including:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Your Internet Protocol (IP) address</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Referring URLs</li>
                    <li>Date and time of your visit</li>
                </ul>

                <h3 className="text-lg font-semibold mt-5 mb-2">Files You Upload</h3>
                <p>Certain tools on our platform require you to upload files (images, documents, etc.) for processing. <strong>These files are processed entirely in your browser or on our servers and are immediately deleted after processing is complete.</strong> We do not store, read, or share the contents of your files.</p>
            </>
        )
    },
    {
        id: "use-of-information",
        icon: Users,
        title: "2. How We Use Your Information",
        content: (
            <>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Respond to your comments, questions, and provide customer support</li>
                    <li>Monitor and analyze usage trends to improve the Site and its tools</li>
                    <li>Protect against fraudulent, unauthorized, or illegal activity</li>
                    <li>Compile anonymous statistical data for internal analysis</li>
                    <li>Send you communications in reply to your contact form submissions</li>
                    <li>Display relevant advertisements via Google AdSense</li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                    We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
                </p>
            </>
        )
    },
    {
        id: "google-adsense",
        icon: Globe,
        title: "3. Google AdSense & Advertising",
        content: (
            <>
                <p>
                    We use <strong>Google AdSense</strong>, a third-party advertising service provided by Google LLC, to display ads on our website. Google AdSense uses cookies and web beacons to serve ads based on your prior visits to our website and other sites on the Internet.
                </p>
                <p className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <strong>Ad serving and data collection:</strong> Third parties, including Google, may be placing and reading cookies on your browser, or using web beacons or IP addresses to collect information as a result of ad serving on this website. This data may be used to show you relevant ads and to measure ad performance.
                </p>
                <p className="mt-4">
                    To learn how Google uses data when you use our site or our partners&apos; sites and apps, see:{" "}
                    <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-primary font-medium underline">
                        How Google uses data when you use our partners&apos; sites or apps
                    </a>.
                </p>
                <h3 className="text-lg font-semibold mt-5 mb-2">How Google Uses Information</h3>
                <p>
                    Google may use the data collected to personalize the ads you see across the web. Google&apos;s ability to use and share information collected by Google AdSense about your visits to our site is governed by the{" "}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                        Google Privacy Policy
                    </a>.
                </p>
                <h3 className="text-lg font-semibold mt-5 mb-2">Opting Out of Personalized Ads</h3>
                <p>
                    You can opt out of personalized advertising by visiting{" "}
                    <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                        Google Ads Settings
                    </a>{" "}
                    or by visiting the{" "}
                    <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                        Network Advertising Initiative opt-out page
                    </a>.
                </p>
                <p className="mt-3 p-3 bg-primary/5 border-l-4 border-primary rounded-md text-sm">
                    <strong>Note:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to our website. Users may opt out of the use of the DoubleClick cookie for interest-based advertising by visiting{" "}
                    <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                        Ads Settings
                    </a>.
                </p>
            </>
        )
    },
    {
        id: "cookies",
        icon: Cookie,
        title: "4. Cookies and Tracking Technologies",
        content: (
            <>
                <p>
                    We and our third-party partners use <strong>cookies</strong>, <strong>web beacons</strong>, <strong>IP addresses</strong>, and similar tracking technologies to enhance your experience and deliver relevant content and advertisements. As a result of ad serving on this website, third parties (including Google) may place and read cookies on your browser or use web beacons and IP addresses to collect information.
                </p>
                <h3 className="text-lg font-semibold mt-5 mb-2">Types of Cookies We Use</h3>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for the website to function properly.</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website (e.g., Google Analytics).</li>
                    <li><strong>Advertising Cookies:</strong> Used by Google AdSense to serve personalized advertisements based on your browsing history.</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings, such as theme preferences (light/dark mode).</li>
                </ul>
                <h3 className="text-lg font-semibold mt-5 mb-2">Managing Cookies</h3>
                <p>
                    Most browsers allow you to refuse or accept cookies. You can set your browser to refuse all cookies or indicate when a cookie is being sent. However, some features of the Site may not function properly without cookies.
                </p>
            </>
        )
    },
    {
        id: "third-party",
        icon: Settings,
        title: "5. Third-Party Services",
        content: (
            <>
                <p>Our website may use the following third-party services, each governed by their own privacy policies:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li><strong>Google AdSense</strong> – Advertising network. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Privacy Policy</a></li>
                    <li><strong>Google Analytics</strong> – Website analytics. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Privacy Policy</a></li>
                    <li><strong>Google Fonts</strong> – Typography service that may log font loading requests.</li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                    We are not responsible for the privacy practices or content of third-party services. We encourage you to read the privacy policies of any third-party services you interact with through our Site.
                </p>
            </>
        )
    },
    {
        id: "data-security",
        icon: Shield,
        title: "6. Data Security",
        content: (
            <p>
                We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. While we have taken reasonable steps to secure your personal information, please be aware that no security system is impenetrable and we cannot guarantee the absolute security of our systems.
            </p>
        )
    },
    {
        id: "user-rights",
        icon: Eye,
        title: "7. Your Privacy Rights",
        content: (
            <>
                <p>Depending on your location, you may have the following rights regarding your personal data:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li><strong>Right to Access:</strong> Request a copy of personal data we hold about you.</li>
                    <li><strong>Right to Rectification:</strong> Request correction of inaccurate personal data.</li>
                    <li><strong>Right to Erasure:</strong> Request deletion of your personal data (where applicable).</li>
                    <li><strong>Right to Object:</strong> Object to the processing of your personal data for direct marketing purposes.</li>
                    <li><strong>CCPA (California Residents):</strong> You have the right to know what personal information is collected, the right to opt-out of the sale of personal information, and the right to non-discrimination for exercising your rights.</li>
                </ul>
                <p className="mt-4">To exercise these rights, contact us at <a href="mailto:support@smarttools.fun" className="text-primary underline">support@smarttools.fun</a>.</p>
            </>
        )
    },
    {
        id: "childrens-privacy",
        icon: Users,
        title: "8. Children's Privacy",
        content: (
            <p>
                Our Site is not directed to children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately at <a href="mailto:support@smarttools.fun" className="text-primary underline">support@smarttools.fun</a>, and we will take steps to delete such information.
            </p>
        )
    },
    {
        id: "changes",
        icon: Mail,
        title: "9. Changes to This Policy",
        content: (
            <p>
                We may update this Privacy Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any significant changes by updating the "Last Updated" date at the top of this page. Your continued use of the Site after any changes constitutes your acceptance of the updated Privacy Policy.
            </p>
        )
    },
];

export default function PrivacyPolicyPage() {
    const lastUpdated = "February 26, 2026";

    return (
        <>
            <main className="bg-background">
                {/* Section 1: Hero */}
                <motion.section
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative py-24 sm:py-32 bg-cover bg-center text-white"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2574&auto=format&fit=crop')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/60 backdrop-blur-sm"></div>
                    <div className="relative container mx-auto px-4 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
                            <Shield className="w-4 h-4" />
                            <span>Your Privacy Matters</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">Privacy Policy</h1>
                        <p className="mt-4 text-lg text-neutral-300">Your trust is important to us. Last Updated: {lastUpdated}</p>
                    </div>
                </motion.section>

                {/* Section 2: Policy Content with Sticky Navigation */}
                <section className="py-16 sm:py-24">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-4 gap-12">

                            {/* Left Side: Sticky Table of Contents */}
                            <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
                                <div className="bg-muted/30 rounded-xl p-5 border">
                                    <h3 className="text-lg font-semibold mb-4">On this page</h3>
                                    <ul className="space-y-2">
                                        {policySections.map(section => (
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

                            {/* Right Side: Main Policy Content */}
                            <div className="lg:col-span-3">
                                <div className="space-y-12">
                                    {policySections.map((section, index) => (
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
                                            <div className="prose prose-neutral dark:prose-invert max-w-none prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary">
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
                            <h2 className="text-3xl font-bold mb-3">Have Questions About Your Privacy?</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                                If you have any questions or concerns about our Privacy Policy or your data, please don&apos;t hesitate to reach out. We typically respond within 1–2 business days.
                            </p>
                            <Link href="/contact">
                                <Button size="lg">
                                    Contact Us <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>
        </>
    );
}