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
    <section className="mx-auto max-w-6xl px-4 py-14">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
          Simple Process
        </p>
        <h2 className="text-2xl font-bold tracking-tight">How SkillBridge Works</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Get started in minutes — from finding the right tutor to booking your first session.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {STEPS.map(({ icon: Icon, step, title, description }) => (
          <div
            key={step}
            className="relative flex flex-col gap-4 rounded-2xl border bg-card p-6"
          >
            {/* Step number */}
            <span className="absolute top-5 right-5 text-4xl font-black text-muted/30 select-none">
              {step}
            </span>

            {/* Icon */}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-1.5">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}