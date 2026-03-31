"use client";

import Link from "next/link";
import { Search, Star, Users, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useTypewriter, Cursor } from "react-simple-typewriter";

interface HeroSectionProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  totalTutors: number;
  totalSubjects: number;
  avgRating: number;
  loading: boolean;
}

export function HeroSection({
  search,
  onSearchChange,
  onSearchSubmit,
  totalTutors,
  totalSubjects,
  avgRating,
  loading,
}: HeroSectionProps) {
  const [animatedStats, setAnimatedStats] = useState({
    tutors: 0,
    subjects: 0,
    rating: 0,
  });

  const hasAnimatedRef = useRef(false);

  const [typedText] = useTypewriter({
    words: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "History",
      "Economics",
      "Computer Science",
    ],
    loop: true,
    delaySpeed: 2000,
    deleteSpeed: 40,
    typeSpeed: 70,
  });

  useEffect(() => {
    if (!loading && !hasAnimatedRef.current) {
      hasAnimatedRef.current = true;

      const tutorInterval = setInterval(() => {
        setAnimatedStats((prev) => {
          const next = Math.min(prev.tutors + totalTutors / 150, totalTutors);
          return { ...prev, tutors: next };
        });
      }, 16);
      setTimeout(() => clearInterval(tutorInterval), 2500);

      const subjectInterval = setInterval(() => {
        setAnimatedStats((prev) => {
          const next = Math.min(
            prev.subjects + totalSubjects / 120,
            totalSubjects
          );
          return { ...prev, subjects: next };
        });
      }, 16);
      setTimeout(() => clearInterval(subjectInterval), 2000);

      const ratingInterval = setInterval(() => {
        setAnimatedStats((prev) => {
          const next = Math.min(prev.rating + avgRating / 120, avgRating);
          return { ...prev, rating: next };
        });
      }, 16);
      setTimeout(() => clearInterval(ratingInterval), 2000);
    }
  }, [loading, totalTutors, totalSubjects, avgRating]);

  const stats = [
    {
      icon: Users,
      value: loading
        ? "..."
        : totalTutors > 0
          ? `${Math.floor(animatedStats.tutors)}+`
          : "—",
      label: "Expert Tutors",
    },
    {
      icon: BookOpen,
      value: loading
        ? "..."
        : totalSubjects > 0
          ? Math.floor(animatedStats.subjects).toLocaleString()
          : "—",
      label: "Subjects Covered",
    },
    {
      icon: Star,
      value: loading
        ? "..."
        : avgRating > 0
          ? animatedStats.rating.toFixed(1)
          : "—",
      label: "Average Rating",
    },
  ];

  const popularSubjects = [
    "Mathematics",
    "Physics",
    "English",
    "Chemistry",
    "Biology",
  ];

  return (
    <section className="relative overflow-hidden border-b bg-background">
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-primary/8 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
        {/* Typing animation above headline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 mb-6"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">
            Now tutoring
          </span>
          <span className="text-xs font-medium text-foreground min-w-[140px] text-left">
            {typedText}
            <Cursor cursorStyle="|" cursorColor="currentColor" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-[2.75rem] sm:text-5xl font-bold tracking-tight leading-[1.15] mb-5 text-foreground"
        >
          Browse Tutors. Book a Session.
          <br />
          <span className="text-primary"> Start Your Learning.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Browse verified tutors, check real availability, and book sessions
          that fit your schedule — all without the back-and-forth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
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
          transition={{ duration: 0.5, delay: 0.36 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-16"
        >
          <span className="text-xs text-muted-foreground/60 font-medium">
            Popular:
          </span>
          {popularSubjects.map((subject) => (
            <Link
              key={subject}
              href={`/tutors?search=${subject}`}
              className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-150"
            >
              {subject}
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.44 }}
          className="flex flex-wrap items-center justify-center gap-0"
        >
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={label} className="flex items-center">
              {i > 0 && (
                <div className="h-8 w-px bg-border/60 mx-6 hidden sm:block" />
              )}
              {i > 0 && <div className="sm:hidden w-4" />}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 ring-1 ring-primary/12">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <motion.p
                    key={`${label}-${value}`}
                    className={`text-sm font-semibold leading-none tabular-nums ${loading ? "text-muted-foreground" : "text-foreground"}`}
                    initial={{ scale: 1 }}
                  >
                    {value}
                  </motion.p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}