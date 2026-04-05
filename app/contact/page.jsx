// app/contact/page.jsx

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Mail, MessageSquare, Clock, HelpCircle, CheckCircle, XCircle, Zap } from "lucide-react"
import { ContactSeoRichSection } from "@/components/contact/contact-seo-rich-section"

const contactReasons = [
    {
        icon: HelpCircle,
        title: "Technical Support",
        description: "Having trouble with one of our tools? We're here to help diagnose and fix the issue.",
    },
    {
        icon: MessageSquare,
        title: "General Feedback",
        description: "Have a suggestion or idea for a new tool? We love hearing from our community.",
    },
    {
        icon: Zap,
        title: "Business Inquiries",
        description: "Interested in partnerships, advertising, or bulk licensing? Let's talk.",
    },
]

function ContactForm() {
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submissionStatus, setSubmissionStatus] = useState(null)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmissionStatus(null)

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                setSubmissionStatus('success')
                setFormData({ name: "", email: "", subject: "", message: "" })
            } else {
                setSubmissionStatus('error')
            }
        } catch (error) {
            console.error('Submission error:', error)
            setSubmissionStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (submissionStatus === 'success') {
        return (
            <div className="text-center flex flex-col items-center justify-center h-full p-8 min-h-[300px]">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">Thanks for reaching out. We'll get back to you within 1–2 business days.</p>
                <Button variant="outline" className="mt-6" onClick={() => setSubmissionStatus(null)}>
                    Send Another Message
                </Button>
            </div>
        )
    }

    return (
        <motion.form
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" value={formData.email} onChange={handleChange} required />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" type="text" placeholder="What is this about?" value={formData.subject} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea id="message" placeholder="Describe your issue or question in detail..." value={formData.message} onChange={handleChange} required rows={5} />
            </div>

            {submissionStatus === 'error' && (
                <p className="text-destructive flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Oops! Something went wrong. Please try again or email us directly.
                </p>
            )}

            <div className="pt-2">
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    {!isSubmitting && <Send className="w-4 h-4 ml-2" />}
                </Button>
            </div>
        </motion.form>
    )
}

export default function ContactPage() {
    return (
        <>
            <head>
                <link rel="canonical" href="https://smarttools.fun/contact/" />
                <meta name="title" content="Contact SmartTools.fun – Support, Feedback & Inquiries" />
                <meta name="description" content="Get in touch with SmartTools.fun for technical support, tool feedback, or business inquiries. We respond within 1–2 business days." />
            </head>
            <main className="bg-muted/20">
                {/* Hero */}
                <motion.section
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative py-24 sm:py-32 bg-cover bg-center text-white"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2674&auto=format&fit=crop')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/50 backdrop-blur-sm"></div>
                    <div className="relative container mx-auto px-4 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
                            <Mail className="w-4 h-4" />
                            <span>We're here to help</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">Contact Us</h1>
                        <p className="mt-4 text-lg sm:text-xl text-neutral-300 max-w-3xl mx-auto">
                            Have a question, feedback, or need help with a tool? We'd love to hear from you. We typically respond within 1–2 business days.
                        </p>
                    </div>
                </motion.section>

                {/* How Can We Help */}
                <section className="py-16 sm:py-20 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How Can We Help?</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Whether you need technical assistance or have a partnership idea, we're just a message away.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {contactReasons.map((reason, index) => (
                                <motion.div
                                    key={reason.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="h-full text-center border-0 bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <CardHeader>
                                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <reason.icon className="w-7 h-7 text-primary" />
                                            </div>
                                            <CardTitle className="text-xl">{reason.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">{reason.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Form + Info */}
                <section className="py-16 sm:py-24">
                    <div className="container mx-auto px-4">
                        <Card className="overflow-hidden shadow-lg">
                            <div className="grid lg:grid-cols-5">
                                {/* Left Side: Contact Info */}
                                <div className="lg:col-span-2 p-8 sm:p-12 bg-gradient-to-br from-primary to-purple-700 text-white">
                                    <motion.div
                                        initial={{ opacity: 0, x: -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6 }}
                                        viewport={{ once: true }}
                                        className="space-y-8 h-full flex flex-col"
                                    >
                                        <div>
                                            <h2 className="text-3xl font-bold mb-3">Get in Touch</h2>
                                            <p className="text-white/80 leading-relaxed">
                                                Fill out the form and our team will get back to you as soon as possible. We&apos;re committed to providing excellent support for all our users.
                                            </p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-white/10 p-3 rounded-full flex-shrink-0">
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">Email Us</h3>
                                                    <a href="mailto:support@smarttools.fun" className="text-white/80 hover:text-white transition-colors">
                                                        support@smarttools.fun
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="bg-white/10 p-3 rounded-full flex-shrink-0">
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">Response Time</h3>
                                                    <p className="text-white/80">Within 1–2 business days</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="bg-white/10 p-3 rounded-full flex-shrink-0">
                                                    <Zap className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">Free Tools</h3>
                                                    <p className="text-white/80">All our tools are 100% free, no sign-up required</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-6 border-t border-white/20">
                                            <p className="text-white/60 text-sm">
                                                For urgent technical issues, please include your browser type and operating system in your message to help us resolve it faster.
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Right Side: Form */}
                                <div className="lg:col-span-3 p-8 sm:p-12">
                                    <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
                                    <ContactForm />
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>

                <ContactSeoRichSection />

                {/* FAQ Section */}
                <section className="py-16 sm:py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground text-lg">Quick answers to common questions.</p>
                        </div>
                        <div className="max-w-3xl mx-auto grid gap-4">
                            {[
                                {
                                    q: "Are all tools completely free?",
                                    a: "Yes! All tools on SmartTools.fun are 100% free to use with no registration or account required."
                                },
                                {
                                    q: "Are my uploaded files safe?",
                                    a: "Absolutely. Files you upload for processing are used only for the requested conversion and are automatically deleted immediately after. We never store or share your files."
                                },
                                {
                                    q: "Why do I see ads on the site?",
                                    a: "Advertising through Google AdSense helps us keep all tools free for everyone. The ads are delivered by Google and may be personalized based on your browsing history."
                                },
                                {
                                    q: "How do I opt out of personalized ads?",
                                    a: "You can opt out of personalized advertising by visiting Google Ads Settings at https://www.google.com/settings/ads or through your browser cookie settings."
                                },
                                {
                                    q: "How do I report a bug or suggest a new tool?",
                                    a: "Use the contact form above or email us directly at support@smarttools.fun. We love feature requests and bug reports from our community!"
                                }
                            ].map((faq, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="border bg-muted/20">
                                        <CardContent className="p-6">
                                            <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                                            <p className="text-muted-foreground">{faq.a}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}