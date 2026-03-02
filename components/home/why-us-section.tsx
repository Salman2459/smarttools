import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Lock, Users, Globe, Star } from "lucide-react"

const stats = [
    { number: "50K+", label: "Files Processed", icon: Globe },
    { number: "30+", label: "Free Tools Available", icon: Zap },
    { number: "10K+", label: "Happy Users", icon: Users },
    { number: "100%", label: "Free — No Sign-Up", icon: Star },
]

const reasons = [
    {
        icon: Shield,
        title: "Privacy First, Always",
        description:
            "Your files are processed securely and deleted immediately after conversion. We never store, read, or share your personal data or uploaded files.",
    },
    {
        icon: Zap,
        title: "Lightning Fast Processing",
        description:
            "Our optimized tools deliver results in seconds. No queues, no waiting — just instant conversions and downloads ready for use.",
    },
    {
        icon: Lock,
        title: "No Account Needed",
        description:
            "Unlike many platforms, SmartTools.fun requires zero registration. Just open a tool, upload your file, and get results instantly.",
    },
    {
        icon: Globe,
        title: "Works On Any Device",
        description:
            "All tools are browser-based and fully optimized for desktop, tablet, and mobile — no software downloads or installations required.",
    },
]

export function WhyUsSection() {
    return (
        <section className="py-16 sm:py-20 px-4 bg-muted/20">
            <div className="max-w-6xl mx-auto">

                {/* Stats Strip */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center bg-background rounded-xl p-5 border shadow-sm">
                            <div className="flex justify-center mb-2">
                                <stat.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Why Choose Us */}
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4">Why SmartTools?</Badge>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                        Built for Speed, Privacy, and Simplicity
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
                        We built SmartTools.fun to solve a simple problem: most online tools are too slow, require sign-ups, or
                        can't be trusted with your data. We built something better.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reasons.map((reason, index) => (
                        <div
                            key={index}
                            className="flex gap-4 p-6 bg-background rounded-xl border hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <reason.icon className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">{reason.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{reason.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
