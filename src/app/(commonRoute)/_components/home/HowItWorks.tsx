import { Search, CalendarCheck, Star } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Find Your Tutor",
    description:
      "Browse tutors by subject, price, and rating. Read reviews from real students to find your perfect match.",
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
      "Attend your session and leave a review to help other students discover great tutors.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-5xl px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-widest mb-4">
            Simple Process
          </span>
          <h2 className="font-serif text-3xl font-bold tracking-tight mb-3">
            How SkillBridge Works
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            From finding the right tutor to completing your first session — it takes just minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="hidden md:block absolute top-9 left-[calc(16.666%+2rem)] right-[calc(16.666%+2rem)] h-px bg-border" />

          {STEPS.map(({ icon: Icon, step, title, description }) => (
            <div key={step} className="flex flex-col items-center text-center group">

              <div className="relative mb-6 z-10">
                <div className="flex h-18 w-18 items-center justify-center rounded-2xl border border-border bg-card shadow-sm group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-200"
                  style={{ width: "4.5rem", height: "4.5rem" }}
                >
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {step.replace("0", "")}
                </span>
              </div>

              {/* Text */}
              <h3 className="text-base font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}