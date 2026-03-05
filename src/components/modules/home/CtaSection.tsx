import Link from "next/link";
import { GraduationCap, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden border-t bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background dark:from-primary/10" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-primary/8 blur-3xl dark:bg-primary/12" />

      <div className="relative mx-auto max-w-6xl px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
            Get Started
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Join SkillBridge Today
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            Whether you want to learn or teach — there&apos;s a place for you
            here.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card p-7 flex flex-col shadow-sm">
            {/* Glows */}
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl pointer-events-none dark:bg-primary/15" />
            <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-primary/5 blur-xl pointer-events-none" />
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />

            <div className="relative flex flex-col flex-1">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-white/10 mb-5">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 mb-6">
                <h3 className="text-xl font-bold  mb-2">
                  Start Learning
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Browse expert tutors, pick a time that works for you, and book
                  your first session in minutes.
                </p>
              </div>
              <Button
                asChild
                className="w-fit h-9 rounded-xl text-sm font-semibold gap-1.5 bg-white text-black hover:bg-white/90 shadow-sm"
              >
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Tutor card — card surface */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card p-7 flex flex-col shadow-sm">
            {/* Glows */}
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl pointer-events-none dark:bg-primary/15" />
            <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-primary/5 blur-xl pointer-events-none" />

            <div className="relative flex flex-col flex-1">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/10 mb-5">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 mb-6">
                <h3 className="text-xl font-bold mb-2">Become a Tutor</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Share your knowledge, set your own hours, and grow a student
                  base that values what you teach.
                </p>
              </div>
              <Button
                asChild
                className="w-fit h-9 rounded-xl text-sm font-semibold gap-1.5"
              >
                <Link href="/register">
                  Join as Tutor
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
