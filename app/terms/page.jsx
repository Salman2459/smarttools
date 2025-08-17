"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ArrowRight, FileText, ShieldCheck, UserCheck, Gavel, Ban, XCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

// --- Content for Terms is structured as data, just like the Privacy Policy ---
const termsSections = [
    {
        id: "agreement",
        icon: Gavel,
        title: "1. Agreement to Terms",
        content: (
            <>
                <p className="lead text-lg text-muted-foreground">
                    By using the services provided on SmartTools.fun ("Site"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must not access or use the Site.
                </p>
                <p className="border-l-4 border-primary pl-4 text-sm bg-primary/5 rounded-md p-4">
                    <strong>LEGAL DISCLAIMER:</strong> This document is a template and does not constitute legal advice. You must consult with a qualified legal professional to draft a Terms & Conditions agreement that is tailored to your specific business needs and compliant with all relevant laws.
                </p>
            </>
        )
    },
    {
        id: "user-representations",
        icon: UserCheck,
        title: "2. User Representations",
        content: (
            <p>By using the Site, you represent and warrant that: (1) you have the legal capacity and you agree to comply with these Terms and Conditions; (2) you are not a minor in the jurisdiction in which you reside; (3) you will not access the Site through automated or non-human means, whether through a bot, script or otherwise; (4) you will not use the Site for any illegal or unauthorized purpose.</p>
        )
    },
    {
        id: "prohibited-activities",
        icon: Ban,
        title: "3. Prohibited Activities",
        content: (
            <>
                <p>You may not access or use the Site for any purpose other than that for which we make the Site available. Prohibited activity includes, but is not limited to:</p>
                <ul>
                    <li>Systematically retrieving data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
                    <li>Engaging in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</li>
                    <li>Interfering with, disrupting, or creating an undue burden on the Site or the networks or services connected to the Site.</li>
                    <li>Attempting to bypass any measures of the Site designed to prevent or restrict access to the Site, or any portion of the Site.</li>
                </ul>
            </>
        )
    },
    {
        id: "ip-rights",
        icon: FileText,
        title: "4. Intellectual Property Rights",
        content: (
            <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.</p>
        )
    },
    {
        id: "liability-limitation",
        icon: XCircle,
        title: "5. Limitation of Liability",
        content: (
            <p>In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.</p>
        )
    },
    {
        id: "disclaimer",
        icon: ShieldCheck,
        title: "6. Disclaimer",
        content: (
            <p>The Site is provided on an as-is and as-available basis. You agree that your use of the site and our services will be at your sole risk. To the fullest extent permitted by law, we disclaim all warranties, express or implied, in connection with the site and your use thereof, including, without limitation, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
        )
    }
];

export default function TermsAndConditionsPage() {
    const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (

        <>
            <head>
                <link rel="canonical" href="https://smarttools.fun/terms" />
                <meta name="title" content="Smart Tools Terms & Conditions of Use & Legal Information" />
                <meta name="description" content="Read the SmartTools Terms & Conditions: includes usage guidelines, legal information and conditions for using our smart online tool platform." />
            </head>
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
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">Terms & Conditions</h1>
                        <p className="mt-4 text-lg text-neutral-300">Please read our terms carefully. Last Updated: {lastUpdated}</p>
                    </div>
                </motion.section>

                {/* Section 2: Content with Sticky Navigation */}
                <section className="py-16 sm:py-24">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-4 gap-12">

                            {/* Left Side: Sticky Table of Contents */}
                            <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
                                <h3 className="text-lg font-semibold mb-4">Sections</h3>
                                <ul className="space-y-2">
                                    {termsSections.map(section => (
                                        <li key={section.id}>
                                            <Link href={`#${section.id}`} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                                                <section.icon className="w-4 h-4 flex-shrink-0" />
                                                <span>{section.title}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </aside>

                            {/* Right Side: Main Policy Content */}
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
                            <h2 className="text-3xl font-bold mb-3">Contact Us</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                                If you have any questions about these Terms, please contact us.
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