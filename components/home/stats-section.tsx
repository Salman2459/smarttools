export function StatsSection() {
  const stats = [
    { number: "50K+", label: "Files Processed" },
    { number: "10K+", label: "Happy Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "< 30s", label: "Average Processing Time" },
  ]

  return (
    <section className="py-12 sm:py-16 px-4 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">{stat.number}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
