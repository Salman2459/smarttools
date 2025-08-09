"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ArrowRight, FileText, Shield, Cookie, Users, Info, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

// --- Content is now structured as data, making it easy to manage ---
const policySections = [
    {
        id: "introduction",
        icon: Info,
        title: "Introduction",
        content: (
            <>
                <p className="lead text-lg text-muted-foreground">
                    Welcome to SmartTools.fun. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                </p>
                <p className="border-l-4 border-primary pl-4 text-sm bg-primary/5 rounded-md p-4">
                    <strong>LEGAL DISCLAIMER:</strong> This is a template and NOT legal advice. You must consult with a legal professional
                    to ensure your Privacy Policy is compliant with all applicable laws and regulations (like GDPR, CCPA, etc.) and accurately reflects your data handling practices.
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
                <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
                <h3 className="text-lg font-semibold mt-4 mb-2">Personal Data</h3>
                <p>Personally identifiable information, such as your name and email address, that you voluntarily give to us when you use our contact form. You are under no obligation to provide us with personal information of any kind.</p>
                <h3 className="text-lg font-semibold mt-4 mb-2">Usage Data</h3>
                <p>Information our servers automatically collect when you access the Site, such as your IP address, browser type, operating system, and access times.</p>
            </>
        )
    },
    {
        id: "use-of-information",
        icon: Users,
        title: "2. How We Use Your Information",
        content: (
            <>
                <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information to:</p>
                <ul>
                    <li>Respond to your comments and questions and provide customer service.</li>
                    <li>Monitor and analyze usage and trends to improve your experience.</li>
                    <li>Protect against fraudulent, unauthorized, or illegal activity.</li>
                    <li>Compile anonymous statistical data for internal or third-party use.</li>
                </ul>
            </>
        )
    },
    {
        id: "cookies",
        icon: Cookie,
        title: "3. Cookies and Tracking",
        content: (
            <p>We may use cookies and other tracking technologies to help customize the Site and improve your experience. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.</p>
        )
    },
    {
        id: "data-security",
        icon: Shield,
        title: "4. Data Security",
        content: (
            <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure your data, please be aware that no security measures are perfect or impenetrable.</p>
        )
    },
];

export default function PrivacyPolicyPage() {
    const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            <head>
                <meta name="description" content="Explore SmartTools.fun: a comprehensive platform offering free and smart online tools, from calculators to converters, to simplify tasks and boost productivity." />
            </head>
            <main className="bg-background">
                {/* Section 1: Hero */}
                <motion.section
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative py-24 sm:py-32 bg-cover bg-center text-white"
                    // New, more fitting background image
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2574&auto=format&fit=crop')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/60 backdrop-blur-sm"></div>
                    <div className="relative container mx-auto px-4 text-center">
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
                                <h3 className="text-lg font-semibold mb-4">On this page</h3>
                                <ul className="space-y-2">
                                    {policySections.map(section => (
                                        <li key={section.id}>
                                            <Link href={`#${section.id}`} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                                                <section.icon className="w-4 h-4" />
                                                {section.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
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
                            <h2 className="text-3xl font-bold mb-3">Have Questions?</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                                If you have any questions or concerns about our Privacy Policy, please don't hesitate to reach out.
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