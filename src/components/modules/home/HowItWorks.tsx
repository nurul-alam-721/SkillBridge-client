import { Search, CalendarCheck, Star } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Find Your Tutor",
    description:
      "Browse tutors by subject, price, and rating. Read reviews from real students to find your best match.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Book a Session",
    description:
      "Pick an available time slot that works for you. Booking is instant — no back-and-forth needed.",
  },
  {
    icon: Star,
    step: "03",
    title: "Learn & Review",
    description:
      "Attend your session and leave a review to help other students find great tutors.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 bg-background">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
          SIMPLE PROCESS
        </p>
        <h2 className="text-3xl font-bold tracking-tight mb-3">
          How SkillBridge Works
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Get started in just three easy steps — from finding the perfect tutor to completing your first session.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {STEPS.map(({ icon: Icon, step, title, description }, index) => (
          <div
            key={step}
            className="group relative flex flex-col items-center text-center bg-card border rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Step Number */}
            <div className="absolute -top-4 right-6 text-6xl font-black text-muted-foreground/10 group-hover:text-primary/10 transition-colors">
              {step}
            </div>

            {/* Icon Container */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-8 w-8 text-primary" />
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            {index < STEPS.length - 1 && (
              <div className="hidden md:block absolute top-20 -right-4 h-0.5 w-8 bg-border" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}