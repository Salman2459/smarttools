import { FileImage, FileText, ImageIcon, Zap, ArrowRight, Shield, Clock, Users, Play } from "lucide-react"
import { HeroSection } from "@/components/home/hero-section"
import { StatsSection } from "@/components/home/stats-section"
import { FeaturesSection } from "@/components/home/features-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { WhyChooseUsSection } from "@/components/home/why-choose-us-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CTASection } from "@/components/home/cta-section"
import Head from "next/head"

export default function HomePage() {
  const features = [
    {
      icon: FileImage,
      title: "Image to PDF",
      description: "Convert your images to high-quality PDF documents instantly",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: FileText,
      title: "Document to PDF",
      description: "Transform Excel and Word files into professional PDFs",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: ImageIcon,
      title: "Image Compression",
      description: "Reduce file sizes while maintaining image quality",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Zap,
      title: "AI Text Humanizer",
      description: "Convert AI-generated text into natural, human-like content",
      color: "text-orange-600 dark:text-orange-400",
    },
  ]

  const benefits = [
    "No registration required",
    "Secure file processing",
    "Fast conversion speeds",
    "Multiple format support",
    "Privacy-focused design",
  ]

  const steps = [
    {
      step: "01",
      title: "Choose Your Tool",
      description: "Select from our suite of productivity tools based on your needs",
      icon: Play,
    },
    {
      step: "02",
      title: "Upload Your Files",
      description: "Drag and drop or browse to upload your files securely",
      icon: FileImage,
    },
    {
      step: "03",
      title: "Process & Download",
      description: "Let our tools work their magic and download your results instantly",
      icon: ArrowRight,
    },
  ]

  const stats = [
    { number: "50K+", label: "Files Processed" },
    { number: "10K+", label: "Happy Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "Less than 30s", label: "Average Processing Time" },
  ]

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "Your files are processed securely and deleted immediately after conversion. We never store or access your personal data.",
    },
    {
      icon: Clock,
      title: "Lightning Fast",
      description:
        "Our optimized processing engines deliver results in seconds, not minutes. Get your work done faster than ever.",
    },
    {
      icon: Users,
      title: "User Friendly",
      description:
        "Intuitive interface designed for everyone. No technical knowledge required - just upload, process, and download.",
    },
  ]

  return (
    <>
      {/* <Head>
        <meta name="description" content="Use free productivity tools to convert images to PDF, compress files, humanize AI text, and more—no sign-up required. Boost your workflow instantly with smart tools" />
        <meta name="description" content="Use free online tools to convert images to PDF, compress files, humanize AI text, and more – fast, secure, and no sign-up required. Contact us today!" />
        <meta name="description" content="Boost productivity with free tools: image compressor, file converter, PDF maker, and more – all in one place. Contact us today!" />
        <meta name="description" content="Compress images, convert documents, and rewrite AI content in seconds with no registration. 100% free, simple, and secure. Contact us today!" />
        <meta name="description" content="All-in-one productivity toolkit: convert images to PDF, compress files, humanize text, and more – easy, fast, and no login needed. Contact us today!" />
        <meta name="description" content="Try free productivity tools to streamline your workflow. Image to PDF, doc converter, text-to-speech, AI rewriter – all online and free with smart tools." />
      </Head> */}
      <div className="min-h-screen">
        <HeroSection />
        {/* <StatsSection stats={stats} /> */}
        <FeaturesSection />
        {/* <HowItWorksSection steps={steps} />
      <WhyChooseUsSection whyChooseUs={whyChooseUs} /> */}
        <TestimonialsSection />
        <CTASection />
      </div>
    </>
  )
}
