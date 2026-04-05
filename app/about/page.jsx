"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Lightbulb, Users, Shield, Zap, Globe, Lock, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AboutSeoRichSection } from "@/components/about/about-seo-rich-section"

const values = [
    {
        icon: Lightbulb,
        title: "Innovation",
        description:
            "We continuously build new tools and improve existing ones based on real user needs. Our goal is to stay ahead of the curve in productivity technology.",
    },
    {
        icon: Users,
        title: "User-Centric Design",
        description:
            "Every tool is designed with the end user in mind. Simple, intuitive interfaces mean you can get work done without reading a manual.",
    },
    {
        icon: Shield,
        title: "Privacy & Security",
        description:
            "We believe your data is yours. Files are processed and immediately deleted. We never store, share, or read your uploaded files.",
    },
]

const stats = [
    { number: "30+", label: "Free Tools", icon: Zap },
    { number: "50K+", label: "Files Processed", icon: Globe },
    { number: "10K+", label: "Monthly Users", icon: Users },
    { number: "0", label: "Required Sign-Ups", icon: Lock },
]

export default function AboutPage() {
    return (
        <>
            <head>
                <link rel="canonical" href="https://smarttools.fun/about/" />
                <meta name="title" content="About SmartTools.fun – Free Online Productivity Tools" />
                <meta
                    name="description"
                    content="Learn about SmartTools.fun – our mission to provide 30+ free, privacy-focused online tools for image conversion, PDF creation, video editing, and AI-powered productivity."
                />
            </head>
            <main className="bg-muted/20">
                {/* Hero */}
                <motion.section
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative py-24 sm:py-32 bg-cover bg-center text-white"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop')",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40 backdrop-blur-sm"></div>
                    <div className="relative container mx-auto px-4 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
                            <Star className="w-4 h-4" />
                            <span>Our Story</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">About SmartTools.fun</h1>
                        <p className="mt-4 text-lg sm:text-xl text-neutral-200 max-w-3xl mx-auto">
                            We&apos;re passionate developers dedicated to making powerful digital tools accessible to everyone — for free.
                        </p>
                    </div>
                </motion.section>

                {/* Stats */}
                <section className="py-10 bg-background border-b">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="text-center p-6 bg-muted/30 rounded-xl border"
                                >
                                    <div className="flex justify-center mb-2">
                                        <stat.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="text-3xl font-bold text-primary">{stat.number}</div>
                                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our Mission */}
                <section className="py-16 sm:py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <Badge variant="outline" className="mb-4">Our Mission</Badge>
                                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Making Productivity Free for Everyone</h2>
                                <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
                                    SmartTools.fun was built on a simple belief: <strong>essential digital tools should be free and accessible to everyone</strong>, without the need to create accounts, pay subscriptions, or sacrifice privacy.
                                </p>
                                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                                    Whether you&apos;re a student, freelancer, small business owner, or just someone who needs to convert a file, our platform gives you instant access to 30+ professional-grade tools — directly in your browser.
                                </p>
                                <Button asChild size="lg">
                                    <Link href="/features">
                                        Explore Our Tools <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className="rounded-xl overflow-hidden shadow-xl"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=2670&auto=format&fit=crop"
                                    alt="Developer working on productivity tools"
                                    className="w-full h-80 object-cover"
                                />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* What We Offer */}
                <section className="py-16 sm:py-24 bg-muted/20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <Badge variant="outline" className="mb-4">What We Offer</Badge>
                            <h2 className="text-3xl sm:text-4xl font-bold">A Complete Toolkit for Modern Work</h2>
                            <p className="mt-4 text-muted-foreground text-lg max-w-3xl mx-auto">
                                From image editing to AI-powered writing tools, SmartTools.fun covers every tool you need to be productive online.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { title: "Image Tools", desc: "Convert between JPG, PNG, WebP, SVG formats. Compress, resize, crop, and watermark images.", icon: "🖼️" },
                                { title: "PDF Tools", desc: "Convert Word, Excel, HTML, and images to PDF. Also convert PDF back to Word, Excel, or text.", icon: "📄" },
                                { title: "Video Tools", desc: "Compress large video files, trim, and crop videos — all directly in your browser.", icon: "🎬" },
                                { title: "AI Text Tools", desc: "Humanize AI-generated text, check grammar, and make your content sound more natural.", icon: "🤖" },
                                { title: "Generator Tools", desc: "Create custom QR codes and barcodes for links, text, contact info, and product IDs.", icon: "📱" },
                                { title: "Voice Tools", desc: "Convert text to natural-sounding speech in multiple voices and languages.", icon: "🎙️" },
                            ].map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="h-full bg-background border hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <div className="text-3xl mb-2">{item.icon}</div>
                                            <CardTitle>{item.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground text-sm">{item.desc}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="py-16 sm:py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <Badge variant="outline" className="mb-4">Our Values</Badge>
                            <h2 className="text-3xl sm:text-4xl font-bold">What Drives Us</h2>
                            <p className="mt-3 text-muted-foreground text-lg">
                                The principles behind every tool we build.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {values.map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="h-full text-center border-0 bg-muted/30">
                                        <CardHeader>
                                            <div className="mx-auto w-14 h-14 bg-primary/10 flex items-center justify-center rounded-full mb-4">
                                                <value.icon className="w-8 h-8 text-primary" />
                                            </div>
                                            <CardTitle>{value.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">{value.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <AboutSeoRichSection />

                {/* Advertising Disclosure */}
                <section className="py-12 bg-muted/20 border-t">
                    <div className="container mx-auto px-4 max-w-3xl text-center">
                        <h2 className="text-2xl font-bold mb-3">How We Stay Free</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            SmartTools.fun is a completely free platform. To cover server costs and continue building new tools, our site
                            displays advertisements through <strong>Google AdSense</strong>. These ads are clearly marked and delivered by Google.
                            We do not control which ads are displayed, and <strong>we never sell your personal data</strong>. If you prefer not to see
                            personalized ads, you can opt out via{" "}
                            <a
                                href="https://www.google.com/settings/ads"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline"
                            >
                                Google Ads Settings
                            </a>
                            . For more information, read our{" "}
                            <Link href="/privacypolicy" className="text-primary underline">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 sm:py-24 bg-background">
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Try Our Tools?</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                                Browse our full collection of free online tools. No account, no fees — just results.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg">
                                    <Link href="/features">
                                        Browse All Tools <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <Link href="/contact">Contact Us</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
        </>
    )
}