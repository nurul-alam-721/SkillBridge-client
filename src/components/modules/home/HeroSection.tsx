import Link from "next/link";
import { Search, Star, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  search, onSearchChange, onSearchSubmit,
  totalTutors, totalSubjects, avgRating, loading,
}: HeroSectionProps) {

  const stats = [
    {
      icon: Users,
      value: loading ? "..." : totalTutors > 0 ? `${totalTutors}+` : "—",
      label: "Expert Tutors",
    },
    {
      icon: BookOpen,
      value: loading ? "..." : totalSubjects > 0 ? String(totalSubjects) : "—",
      label: "Subjects",
    },
    {
      icon: Star,
      value: loading ? "..." : avgRating > 0 ? avgRating.toFixed(1) : "—",
      label: "Average Rating",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b">

      <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-background to-background dark:from-primary/12 dark:via-background dark:to-background" />
      <div className="absolute -top-32 -left-32 h-125 w-125 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />
      <div className="absolute -bottom-24 -right-24 h-100 w-100 rounded-full bg-blue-500/6 blur-3xl dark:bg-blue-500/10" />
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center">

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
          Connect with Expert Tutors,{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-primary">Learn Anything</span>
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-primary/30" />
          </span>
        </h1>

        <p className="text-muted-foreground text-base max-w-xl mx-auto mb-8">
          Find the perfect tutor for any subject. Browse profiles, check
          availability, and book sessions — all in one place.
        </p>

        {/* Search */}
        <div className="flex gap-2 max-w-lg mx-auto mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
              placeholder="Search by subject or tutor name..."
              className="pl-10 h-11 rounded-xl bg-background/80 backdrop-blur-sm"
            />
          </div>
          <Button onClick={onSearchSubmit} className="h-11 px-5 rounded-xl font-medium shrink-0">
            Search
          </Button>
        </div>

        {/* Popular quick links */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <span className="text-xs text-muted-foreground">Popular:</span>
          {["Math", "Physics", "English", "Chemistry", "Biology"].map((subject) => (
            <Link
              key={subject}
              href={`/tutors?search=${subject}`}
              className="rounded-full border bg-background/60 backdrop-blur-sm px-3 py-0.5 text-xs text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
            >
              {subject}
            </Link>
          ))}
        </div>

        {/* Dynamic stats */}
        <div className="flex flex-wrap items-center justify-center gap-8">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={label} className="flex items-center gap-2.5">
              {i > 0 && <div className="hidden sm:block h-8 w-px bg-border mr-5" />}
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className={`text-sm font-bold leading-none ${loading ? "animate-pulse text-muted-foreground" : ""}`}>
                  {value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}