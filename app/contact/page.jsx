// app/contact/page.tsx

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Send, Mail, Phone, ExternalLink, CheckCircle, XCircle } from "lucide-react"

// --- The LocationCard and ContactInfoItem components remain unchanged ---
// (Keeping them here for completeness)
const ContactInfoItem = ({ icon: Icon, title, value, href }) => (
    <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full"><Icon className="w-5 h-5 text-primary" /></div>
        <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <a href={href || "#"} className="text-muted-foreground hover:text-primary transition-colors">{value}</a>
        </div>
    </div>
);
const LocationCard = ({ location, index }) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
    return (
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
            <Card className="h-full text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardHeader><MapPin className="w-10 h-10 mx-auto mb-3 text-primary" /><CardTitle>{location.city}</CardTitle></CardHeader>
                <CardContent><a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground group inline-flex items-center gap-1 hover:text-primary transition-colors">{location.address}<ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" /></a></CardContent>
            </Card>
        </motion.div>
    );
};
const locations = [
    { city: "Bali", address: "508 Bridle Avenue, Newnan, GA 30263" },
    { city: "London", address: "123 Tech Street, London, UK 12345" },
    { city: "Prague", address: "456 Code Square, Prague, CZ 67890" },
    { city: "Moscow", address: "789 Innovation Blvd, Moscow, RU 11223" },
];

function ContactForm() {
    // --- MODIFIED: Replaced Formspree with local state management ---
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmissionStatus(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmissionStatus('success');
                setFormData({ name: "", email: "", subject: "", message: "" }); // Clear form
            } else {
                setSubmissionStatus('error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setSubmissionStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submissionStatus === 'success') {
        return (
            <div className="text-center flex flex-col items-center justify-center h-full p-8">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">Thanks for reaching out. We'll get back to you soon.</p>
            </div>
        );
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
                <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" type="text" placeholder="Your Name" value={formData.name} onChange={handleChange} required /></div>
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="your.email@example.com" value={formData.email} onChange={handleChange} required /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="subject">Subject</Label><Input id="subject" type="text" placeholder="What is this about?" value={formData.subject} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label htmlFor="message">Your Message</Label><Textarea id="message" placeholder="Enter your message here..." value={formData.message} onChange={handleChange} required rows={5} /></div>

            {submissionStatus === 'error' && (
                <p className="text-destructive flex items-center gap-2"><XCircle className="w-4 h-4" /> Oops! Something went wrong. Please try again.</p>
            )}

            <div className="pt-2">
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    {!isSubmitting && <Send className="w-4 h-4 ml-2" />}
                </Button>
            </div>
        </motion.form>
    );
}

export default function ContactPage() {
    // The main page component remains the same.
    return (
        <>
            <head>
                <link rel="canonical" href="https://smarttools.fun/contact" />
                <meta name="description" content="Contact Smart Tools for support, feedback, or inquiries. Your insights help us refine and enhance our free tools and deliver a better user experience." />
            </head>
            <main className="bg-muted/20">
                <motion.section initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative py-24 sm:py-32 bg-cover bg-center text-white" style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1675842663249-a8b70103dbaa?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29udGFjdCUyMHVzfGVufDB8fDB8fHww" }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/50 backdrop-blur-sm"></div>
                    <div className="relative container mx-auto px-4 text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">Get in Touch</h1>
                        <p className="mt-4 text-lg sm:text-xl text-neutral-300 max-w-3xl mx-auto">We’re here to help and answer any question you might have. We look forward to hearing from you.</p>
                    </div>
                </motion.section>
                <section className="py-16 sm:py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12 sm:mb-16"><h2 className="text-3xl sm:text-4xl font-bold">Our Offices</h2><p className="mt-3 text-muted-foreground text-lg">Come say hello at one of our locations.</p></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{locations.map((location, index) => (<LocationCard key={location.city} location={location} index={index} />))}</div>
                    </div>
                </section>
                <section className="py-16 sm:py-24 bg-background">
                    <div className="container mx-auto px-4">
                        <Card className="overflow-hidden">
                            <div className="grid lg:grid-cols-2">
                                <div className="p-8 sm:p-12 bg-muted/50">
                                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="space-y-8">
                                        <h2 className="text-3xl font-bold">Contact Information</h2>
                                        <p className="text-muted-foreground">Can't find what you're looking for? Reach out to us directly.</p>
                                        <div className="space-y-6">
                                            <ContactInfoItem icon={Mail} title="Email Us" value="support@smarttools.fun" href="mailto:support@smarttools.fun" />
                                            <ContactInfoItem icon={MapPin} title="Main Office" value="123 Tech Street, London, UK" />
                                        </div>
                                    </motion.div>
                                </div>
                                <div className="p-8 sm:p-12">
                                    <ContactForm />
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>
            </main>
        </>
    );
}