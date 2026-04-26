"use client";

import Link from "next/link";
import { Search, Star, Users, BookOpen, ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, Variants, animate } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import type { LucideIcon } from "lucide-react";

interface HeroSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  totalStudents: number;
  totalTutors: number;
  totalSubjects: number;
  avgRating: number;
  loading: boolean;
  categories?: { id: string; name: string }[];
}

function StatCounter({ value, label, icon: Icon, delay = 0, loading }: { value: number; label: string; icon: LucideIcon; delay?: number; loading: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    if (value === 0 || loading) return;
    
    const timeout = setTimeout(() => {
      const controls = animate(countRef.current, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          countRef.current = latest;
          setDisplayValue(latest);
        }
      });
      return () => controls.stop();
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [value, delay, loading]);

  const formattedValue = label === "Average Rating" 
    ? (loading ? "..." : displayValue.toFixed(1)) 
    : (loading ? "..." : `${Math.floor(displayValue)}+`);

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 ring-1 ring-primary/12">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="text-left">
          <p className={`text-sm font-semibold leading-none tabular-nums ${loading ? "text-muted-foreground" : "text-foreground"}`}>
            {formattedValue}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

function AnimatedTitle() {
  const line1 = "Browse Tutors. Book a Session.";
  const line2 = "Start Your Learning Journey.";

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.018, delayChildren: 0.1 },
    },
  };

  const charVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const renderChars = (text: string, isPrimary: boolean) =>
    text.split("").map((char, i) => (
      <motion.span
        key={i}
        variants={charVariants}
        className={
          char === " "
            ? "inline-block w-[0.25em]"
            : isPrimary
            ? "inline-block"
            : "inline-block text-primary"
        }
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ));

  return (
    <motion.h1
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="font-serif text-[2.75rem] sm:text-5xl font-bold tracking-tight leading-[1.2] mb-5 text-foreground"
    >
      <span className="block">{renderChars(line1, true)}</span>
      <span className="block">{renderChars(line2, false)}</span>
    </motion.h1>
  );
}

export function HeroSection({
  search,
  onSearchChange,
  onSearchSubmit,
  totalStudents,
  totalTutors,
  totalSubjects,
  avgRating,
  loading,
  categories = [],
}: HeroSectionProps) {
  const popularSubjects =
    categories.length > 0
      ? categories.slice(0, 5).map((c) => c.name)
      : ["Mathematics", "Physics", "English", "Chemistry", "Biology"];

  return (
    <section className="relative overflow-hidden border-b bg-background">
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-150 rounded-full bg-primary/8 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
        <AnimatedTitle />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Browse verified tutors, check real availability, and book sessions
          that fit your schedule — all without the back-and-forth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="flex gap-2.5 max-w-md mx-auto mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
              placeholder="Subject, topic, or tutor name..."
              className="pl-10 h-11 rounded-xl bg-background border-border/70 shadow-sm focus-visible:ring-1 focus-visible:ring-primary/50"
            />
          </div>
          <Button
            onClick={onSearchSubmit}
            className="h-11 px-5 rounded-xl font-medium shrink-0 gap-1.5 shadow-sm"
          >
            Search
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-16"
        >
          <span className="text-xs text-muted-foreground/60 font-medium">
            Popular:
          </span>
          {popularSubjects.map((subject) => (
            <Link
              key={subject}
              href={`/tutors?search=${encodeURIComponent(subject)}`}
              className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-150"
            >
              {subject}
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-0"
        >
          <StatCounter icon={GraduationCap} value={totalStudents} label="Students Joined" loading={loading} />
          <div className="h-8 w-px bg-border/60 mx-5 hidden sm:block" />
          <div className="sm:hidden w-3" />
          <StatCounter icon={Users} value={totalTutors} label="Expert Tutors" loading={loading} />
          <div className="h-8 w-px bg-border/60 mx-5 hidden sm:block" />
          <div className="sm:hidden w-3" />
          <StatCounter icon={BookOpen} value={totalSubjects} label="Subjects Covered" loading={loading} />
          <div className="h-8 w-px bg-border/60 mx-5 hidden sm:block" />
          <div className="sm:hidden w-3" />
          <StatCounter icon={Star} value={avgRating} label="Average Rating" loading={loading} />
        </motion.div>
      </div>
    </section>
  );
}