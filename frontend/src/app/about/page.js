export default function AboutPage() {
  const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "10K+", label: "Products Sold" },
    { value: "4.9", label: "Average Rating" },
    { value: "99%", label: "Satisfaction Rate" },
  ];

  const team = [
    { name: "Alex Morgan", role: "Founder & CEO", initials: "AM" },
    { name: "Jordan Lee", role: "Head of Operations", initials: "JL" },
    { name: "Sam Chen", role: "Lead Developer", initials: "SC" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          About TechNest
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          TechNest was founded with a simple mission: make premium technology accessible to everyone.
          We curate the best tech products from world-leading brands and deliver them to your doorstep
          with exceptional service.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold text-accent sm:text-4xl">{stat.value}</div>
            <div className="mt-1 text-sm text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-20 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-primary">Our Mission</h2>
          <p className="mt-4 leading-relaxed text-muted">
            We believe everyone deserves access to the latest technology without breaking the bank.
            Our team works tirelessly to negotiate the best prices with manufacturers and pass
            those savings directly to you.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Every product we sell goes through a rigorous quality check. We stand behind everything
            we sell with our comprehensive 2-year warranty and dedicated customer support.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary">Our Values</h2>
          <div className="mt-4 space-y-4">
            {[
              { title: "Quality First", desc: "We only stock products we would use ourselves." },
              { title: "Customer Obsessed", desc: "Your satisfaction drives every decision we make." },
              { title: "Fair Pricing", desc: "Transparent pricing with no hidden fees." },
              { title: "Sustainability", desc: "Eco-friendly packaging and responsible sourcing." },
            ].map((v) => (
              <div key={v.title}>
                <h3 className="font-semibold text-primary">{v.title}</h3>
                <p className="mt-1 text-sm text-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-center text-2xl font-bold text-primary">Meet the Team</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {team.map((member) => (
            <div key={member.name} className="rounded-xl border border-border bg-white p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-lg font-bold text-accent">
                {member.initials}
              </div>
              <h3 className="mt-4 font-semibold text-primary">{member.name}</h3>
              <p className="mt-1 text-sm text-muted">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
