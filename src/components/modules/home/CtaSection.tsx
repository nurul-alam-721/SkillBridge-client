"use client";

import Link from "next/link";
import { GraduationCap, BookOpen, ArrowRight, CalendarDays, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types/types";
import { Roles } from "@/constant/Roles";

function getDashboardHref(role: string) {
  if (role === Roles.tutor) return "/tutor/dashboard";
  if (role === Roles.admin) return "/admin/dashboard";
  return "/dashboard";
}

export function CtaSection() {
  const { data: session } = authClient.useSession();
  const user = session?.user as User | undefined;
  const role = user?.role as string | undefined;

  return (
    <section className="relative overflow-hidden border-t bg-background">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-background dark:from-primary/10" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-primary/8 blur-3xl dark:bg-primary/12" />

      <div className="relative mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
            {user ? "Your SkillBridge" : "Get Started"}
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {user ? `Welcome back, ${user.name?.split(" ")[0]}` : "Join SkillBridge Today"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            {user
              ? "Pick up where you left off or explore something new."
              : "Whether you want to learn or teach — there's a place for you here."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 max-w-3xl mx-auto">
          {/* Card 1 */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card p-7 flex flex-col shadow-sm">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl pointer-events-none dark:bg-primary/15" />
            <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-primary/5 blur-xl pointer-events-none" />

            <div className="relative flex flex-col flex-1">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/10 mb-5">
                {user && role !== Roles.tutor ? (
                  <CalendarDays className="h-5 w-5 text-primary" />
                ) : (
                  <BookOpen className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1 mb-6">
                <h3 className="text-xl font-bold mb-2">
                  {user
                    ? role === Roles.tutor
                      ? "Manage Availbility Slots"
                      : "My Bookings"
                    : "Start Learning"}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {user
                    ? role === Roles.tutor
                      ? "Review your upcoming sessions, update your availability, and connect with students."
                      : "View your upcoming sessions, track your progress, and stay on top of your learning."
                    : "Browse expert tutors, pick a time that works for you, and book your first session in minutes."}
                </p>
              </div>
              <Button asChild className="w-fit h-9 rounded-xl text-sm font-semibold gap-1.5">
                <Link href={user ? (role === Roles.tutor ? "/tutor/availability" : "/dashboard/bookings") : "/register"}>
                  {user
                    ? role === Roles.tutor ? "Go to Sessions" : "View Bookings"
                    : "Get Started Free"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card p-7 flex flex-col shadow-sm">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl pointer-events-none dark:bg-primary/15" />
            <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-primary/5 blur-xl pointer-events-none" />

            <div className="relative flex flex-col flex-1">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/10 mb-5">
                {user ? (
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                ) : (
                  <GraduationCap className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1 mb-6">
                <h3 className="text-xl font-bold mb-2">
                  {user
                    ? role === Roles.tutor
                      ? "Your Profile"
                      : "Find a Tutor"
                    : "Become a Tutor"}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {user
                    ? role === Roles.tutor
                      ? "Keep your profile, subjects, and hourly rate up to date so students can find and book you."
                      : "Explore our full list of verified tutors and book a session that fits your schedule."
                    : "Share your knowledge, set your own hours, and grow a student base that values what you teach."}
                </p>
              </div>
              <Button asChild className="w-fit h-9 rounded-xl text-sm font-semibold gap-1.5">
                <Link href={user ? (role === Roles.tutor ? "/tutor/profile" : "/tutors") : "/register"}>
                  {user
                    ? role === Roles.tutor ? "Edit Profile" : "Browse Tutors"
                    : "Join as Tutor"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {user && (
          <div className="mt-8 text-center">
            <Link
              href={getDashboardHref(role ?? "")}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Go to your dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}