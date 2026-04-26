"use client";

import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  CalendarDays,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types";
import { Roles } from "@/constant/Roles";
import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

function getDashboardHref(role: string) {
  if (role === Roles.tutor) return "/tutor/dashboard";
  if (role === Roles.admin) return "/admin/dashboard";
  return "/student/dashboard";
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};


function CardA({
  icon: Icon,
  title,
  description,
  href,
  buttonLabel,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
}) {
  const particles = Array.from({ length: 6 });

  return (
    <motion.div
      initial={{ opacity: 0, x: -48 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      animate="idle"
      className="group relative overflow-hidden rounded-2xl bg-primary p-7 flex flex-col shadow-xl"
    >
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--primary-foreground) / 0.8) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Animated glow orbs */}
      <motion.div
        className="absolute -top-16 -right-16 h-52 w-52 rounded-full bg-white/10 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-white/8 blur-2xl pointer-events-none"
        animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />

      {/* Rising particles on hover */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary-foreground/50 pointer-events-none"
          style={{ left: `${12 + i * 15}%`, bottom: "10%" }}
          variants={{
            idle: { y: 0, opacity: 0, scale: 0.5 },
            hover: {
              y: -(28 + i * 14),
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.3],
              transition: {
                delay: i * 0.08,
                duration: 1.1,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 0.5,
              },
            },
          }}
        />
      ))}

      <div className="relative flex flex-col flex-1 z-10">
        {/* Icon with rotating border ring */}
        <div className="relative h-12 w-12 mb-5">
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-dashed border-primary-foreground/25"
            variants={{
              idle: { rotate: 0 },
              hover: {
                rotate: 180,
                transition: { duration: 0.7, ease: "easeInOut" },
              },
            }}
          />
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-primary-foreground/15">
            <motion.div
              variants={{
                idle: { scale: 1 },
                hover: {
                  scale: 1.18,
                  transition: { type: "spring", stiffness: 300, damping: 12 },
                },
              }}
            >
              <Icon className="h-5 w-5 text-primary-foreground" />
            </motion.div>
          </div>
        </div>

        <div className="flex-1 mb-7">
          <h3 className="font-serif text-xl font-bold mb-2 text-primary-foreground tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-primary-foreground/65 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Ghost/outline button — fits dark card */}
        <Link
          href={href}
          className="inline-flex items-center gap-2 w-fit h-9 px-4 rounded-xl text-sm font-semibold border border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors duration-200"
        >
          {buttonLabel}
          <motion.span
            variants={{
              idle: { x: 0 },
              hover: {
                x: 5,
                transition: { type: "spring", stiffness: 400, damping: 18 },
              },
            }}
            className="inline-flex"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.span>
        </Link>
      </div>
    </motion.div>
  );
}

function CardB({
  icon: Icon,
  title,
  description,
  href,
  buttonLabel,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 48 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      animate="idle"
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 flex flex-col shadow-sm"
    >
      {/* Hover border glow overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        variants={{
          idle: { opacity: 0 },
          hover: { opacity: 1, transition: { duration: 0.25 } },
        }}
        style={{
          boxShadow: "inset 0 0 0 1.5px hsl(var(--primary) / 0.35)",
        }}
      />

      {/* Top-right concentric arc decoration */}
      <motion.div
        className="absolute -top-2 -right-2 pointer-events-none"
        variants={{
          idle: { opacity: 0.5, scale: 1 },
          hover: { opacity: 1, scale: 1.08, transition: { duration: 0.4 } },
        }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="80" cy="0" r="40" stroke="hsl(var(--primary) / 0.12)" strokeWidth="1" fill="none" />
          <circle cx="80" cy="0" r="26" stroke="hsl(var(--primary) / 0.10)" strokeWidth="1" fill="none" />
          <circle cx="80" cy="0" r="14" stroke="hsl(var(--primary) / 0.08)" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>

      {/* Bottom-left soft glow */}
      <motion.div
        className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl pointer-events-none"
        variants={{
          idle: { scale: 1, opacity: 0.5 },
          hover: { scale: 1.4, opacity: 1, transition: { duration: 0.6 } },
        }}
      />

      <div className="relative flex flex-col flex-1 z-10">
        {/* Icon bounces up on hover */}
        <motion.div
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15 mb-5 shadow-sm"
          variants={{
            idle: { y: 0 },
            hover: {
              y: [0, -7, 0],
              transition: { duration: 0.45, ease: "easeInOut" },
            },
          }}
        >
          <Icon className="h-5 w-5 text-primary" />
        </motion.div>

        <div className="flex-1 mb-7">
          {/* Title with animated underline sweep */}
          <div className="relative mb-2 w-fit">
            <h3 className="font-serif text-xl font-bold tracking-tight">{title}</h3>
            <motion.div
              className="absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-primary/50"
              variants={{
                idle: { width: "0%" },
                hover: {
                  width: "100%",
                  transition: { duration: 0.3, ease: "easeOut" },
                },
              }}
            />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Solid filled button — fits light card */}
        <Button asChild className="w-fit h-9 rounded-xl text-sm font-semibold gap-1.5">
          <Link href={href}>
            {buttonLabel}
            <motion.span
              variants={{
                idle: { x: 0 },
                hover: {
                  x: 4,
                  transition: { type: "spring", stiffness: 400, damping: 18 },
                },
              }}
              className="inline-flex"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.span>
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

export function CtaSection() {
  const { data: session } = authClient.useSession();
  const user = session?.user as User | undefined;
  const role = user?.role as string | undefined;
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const card1 = {
    icon: user && role !== Roles.tutor ? CalendarDays : BookOpen,
    title: user
      ? role === Roles.tutor
        ? "Manage Availability Slots"
        : "My Bookings"
      : "Start Learning",
    description: user
      ? role === Roles.tutor
        ? "Review your upcoming sessions, update your availability, and connect with students."
        : "View your upcoming sessions, track your progress, and stay on top of your learning."
      : "Browse expert tutors, pick a time that works for you, and book your first session in minutes.",
    href: user
      ? role === Roles.tutor
        ? "/tutor/availability"
        : "/student/bookings"
      : "/register",
    buttonLabel: user
      ? role === Roles.tutor
        ? "Go to Sessions"
        : "View Bookings"
      : "Get Started Free",
  };

  const card2 = {
    icon: user ? LayoutDashboard : GraduationCap,
    title: user
      ? role === Roles.tutor
        ? "Your Profile"
        : "Find a Tutor"
      : "Become a Tutor",
    description: user
      ? role === Roles.tutor
        ? "Keep your profile, subjects, and hourly rate up to date so students can find and book you."
        : "Explore our full list of verified tutors and book a session that fits your schedule."
      : "Share your knowledge, set your own hours, and grow a student base that values what you teach.",
    href: user
      ? role === Roles.tutor
        ? "/tutor/profile"
        : "/tutors"
      : "/register",
    buttonLabel: user
      ? role === Roles.tutor
        ? "Edit Profile"
        : "Browse Tutors"
      : "Join as Tutor",
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t bg-background"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background dark:from-primary/10 pointer-events-none" />

      <motion.div
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-primary/6 blur-3xl dark:bg-primary/10 pointer-events-none"
        animate={{ scale: [1, 1.07, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="inline-flex items-center gap-1.5 mb-3"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {user ? "Your SkillBridge" : "Get Started"}
            </p>
          </motion.div>

          <motion.h2
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="font-serif text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {user
              ? `Welcome back, ${user.name?.split(" ")[0]}`
              : "Join SkillBridge Today"}
          </motion.h2>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto"
          >
            {user
              ? "Pick up where you left off or explore something new."
              : "Whether you want to learn or teach — there's a place for you here."}
          </motion.p>
        </div>

        {/* Cards — each with its own distinct design */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 max-w-3xl mx-auto">
          <CardA {...card1} />
          <CardB {...card2} />
        </div>

        {/* Dashboard link */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 text-center"
          >
            <Link
              href={getDashboardHref(role ?? "")}
              className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Go to your dashboard
              <motion.span
                className="inline-flex"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </motion.span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}