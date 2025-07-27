"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Lightbulb, Users, Shield, Github, Linkedin, Twitter } from "lucide-react"

// --- Data for Core Values ---
const values = [
    {
        icon: Lightbulb,
        title: "Innovation",
        description: "We constantly seek better ways to solve problems, pushing the boundaries of what's possible with creativity and technology."
    },
    {
        icon: Users,
        title: "Customer-Centric",
        description: "Our users are at the heart of everything we do. We listen, learn, and build tools that truly meet their needs and exceed expectations."
    },
    {
        icon: Shield,
        title: "Integrity & Trust",
        description: "We are committed to transparency and security. Your data is sacred, and we build our products with the utmost respect for your privacy."
    }
];

// --- Data for Team Members ---
const teamMembers = [
    {
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2487&auto=format&fit=crop",
        name: "Alex Johnson",
        title: "Founder & CEO",
        socials: {
            linkedin: "#",
            twitter: "#"
        }
    },
    {
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2487&auto=format&fit=crop",
        name: "Jane Doe",
        title: "Lead Developer",
        socials: {
            github: "#",
            linkedin: "#"
        }
    },
    {
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2487&auto=format&fit=crop",
        name: "Samuel Lee",
        title: "UX/UI Designer",
        socials: {
            twitter: "#",
            linkedin: "#"
        }
    },
];

// --- Reusable Component for Value Cards ---
const ValueCard = ({ icon: Icon, title, description, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
    >
        <Card className="h-full text-center border-0 bg-background/50 backdrop-blur-sm">
            <CardHeader>
                <div className="mx-auto w-14 h-14 bg-primary/10 flex items-center justify-center rounded-full mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    </motion.div>
);

// --- MODIFIED: Reusable Component for Team Member Cards with Box Shape ---
const TeamMemberCard = ({ image, name, title, socials, index }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="text-center group"
    >
        <div className="relative w-40 h-40 mx-auto mb-4">
            <Image
                src={image}
                alt={name}
                width={160}
                height={160}
                // Changed from rounded-full to rounded-xl
                className="rounded-xl object-cover transition-all duration-300 group-hover:grayscale"
            />
            {/* The overlay also needs to match the new shape */}
            {/* <div className="absolute inset-0 rounded-xl bg-primary/50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80"><Linkedin /></a>}
                {socials.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80"><Twitter /></a>}
                {socials.github && <a href={socials.github} target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80"><Github /></a>}
            </div> */}
        </div>
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-primary">{title}</p>
    </motion.div>
);

export default function AboutPage() {
    return (
        <main className="bg-muted/20">
            {/* Section 1: Hero */}
            <motion.section
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative py-24 sm:py-32 bg-cover bg-center text-white"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40 backdrop-blur-sm"></div>
                <div className="relative container mx-auto px-4 text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">About SmartTools</h1>
                    <p className="mt-4 text-lg sm:text-xl text-neutral-200 max-w-3xl mx-auto">
                        We're a passionate team dedicated to building simple, powerful, and accessible tools to boost your productivity.
                    </p>
                </div>
            </motion.section>

            {/* Section 2: Our Mission */}
            <section className="py-16 sm:py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Mission</h2>
                            <p className="text-muted-foreground text-lg mb-6">
                                In a world filled with complex software, our mission is to create a suite of intuitive, fast, and secure tools that anyone can use. We believe that productivity should be effortless, not a chore. We focus on single-purpose, high-quality utilities that do one thing and do it exceptionally well.
                            </p>
                            <Button asChild size="lg">
                                <Link href="/features">
                                    Explore Our Tools <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="h-80 lg:h-96"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574&auto=format&fit=crop"
                                alt="Team working collaboratively"
                                width={600}
                                height={400}
                                className="rounded-xl object-cover w-full h-full shadow-lg"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section 3: Our Core Values */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold">What Drives Us</h2>
                        <p className="mt-3 text-muted-foreground text-lg">Our principles are the foundation of our work.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {values.map((value, index) => (
                            <ValueCard key={value.title} {...value} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 4: Meet the Team */}
            <section className="py-16 sm:py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold">Meet the Team</h2>
                        <p className="mt-3 text-muted-foreground text-lg">The minds behind the magic.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                        {teamMembers.map((member, index) => (
                            <TeamMemberCard key={member.name} {...member} index={index} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}