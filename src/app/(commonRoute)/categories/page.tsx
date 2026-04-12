"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  ArrowRight,
  Dna,
  FlaskConical,
  ScrollText,
  BookOpen,
  Calculator,
  Atom,
  TrendingUp,
  Code2,
  GraduationCap,
  Microscope,
  Globe2,
  PenLine,
  Music,
  Palette,
  Landmark,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Category, categoryService } from "@/services/category.service";

const CARD_ACCENTS = [
  { bg: "bg-violet-500/10", text: "text-violet-600", ring: "ring-violet-500/20" },
  { bg: "bg-sky-500/10",    text: "text-sky-600",    ring: "ring-sky-500/20"    },
  { bg: "bg-emerald-500/10",text: "text-emerald-600",ring: "ring-emerald-500/20"},
  { bg: "bg-amber-500/10",  text: "text-amber-600",  ring: "ring-amber-500/20"  },
  { bg: "bg-rose-500/10",   text: "text-rose-600",   ring: "ring-rose-500/20"   },
  { bg: "bg-cyan-500/10",   text: "text-cyan-600",   ring: "ring-cyan-500/20"   },
  { bg: "bg-indigo-500/10", text: "text-indigo-600", ring: "ring-indigo-500/20" },
  { bg: "bg-orange-500/10", text: "text-orange-600", ring: "ring-orange-500/20" },
  { bg: "bg-teal-500/10",   text: "text-teal-600",   ring: "ring-teal-500/20"   },
  { bg: "bg-pink-500/10",   text: "text-pink-600",   ring: "ring-pink-500/20"   },
  { bg: "bg-lime-500/10",   text: "text-lime-600",   ring: "ring-lime-500/20"   },
  { bg: "bg-fuchsia-500/10",text: "text-fuchsia-600",ring: "ring-fuchsia-500/20"},
];

function getSubjectIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("bio"))          return Dna;
  if (n.includes("chem"))         return FlaskConical;
  if (n.includes("hist"))         return ScrollText;
  if (n.includes("english") || n.includes("literature") || n.includes("writing")) return PenLine;
  if (n.includes("math"))         return Calculator;
  if (n.includes("physics"))      return Atom;
  if (n.includes("econ"))         return TrendingUp;
  if (n.includes("computer") || n.includes("coding") || n.includes("programming")) return Code2;
  if (n.includes("science"))      return Microscope;
  if (n.includes("geo"))          return Globe2;
  if (n.includes("music"))        return Music;
  if (n.includes("art"))          return Palette;
  if (n.includes("civic") || n.includes("politic") || n.includes("social")) return Landmark;
  return GraduationCap;
}

function CategoryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4 animate-pulse">
      <div className="flex items-start justify-between">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <Skeleton className="h-5 w-28 rounded-full" />
      </div>
      <div className="space-y-2 pt-1">
        <Skeleton className="h-5 w-3/5 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-4/5 rounded-md" />
      </div>
      <Skeleton className="h-4 w-1/3 rounded-md" />
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              Subjects
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Browse by Subject
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm max-w-lg">
            Choose a subject to instantly find tutors specialising in that area.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {categories.map((cat, i) => {
              const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
              const SubjectIcon = getSubjectIcon(cat.name);
              return (
                <Link
                  key={cat.id}
                  href={`/tutors?search=${encodeURIComponent(cat.name)}`}
                  className="group rounded-2xl border border-border/60 bg-card p-6 flex flex-col gap-4
                             hover:border-border hover:shadow-md hover:-translate-y-0.5
                             transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  {/* Icon + tutor count */}
                  <div className="flex items-start justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${accent.bg} ${accent.ring}`}>
                      <SubjectIcon className={`h-5 w-5 ${accent.text}`} />
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted rounded-full px-2.5 py-1 shrink-0">
                      <Users className="h-3 w-3 shrink-0" />
                      {cat._count?.tutors ?? 0} tutors
                    </span>
                  </div>

                  {/* Name + description */}
                  <div className="flex-1">
                    <h2 className="font-semibold text-foreground text-base leading-snug mb-1.5 group-hover:text-primary transition-colors duration-150">
                      {cat.name}
                    </h2>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {cat.description || "Explore expert tutors in this subject."}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    View tutors
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
              <GraduationCap className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">No categories found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Check back soon — we&apos;re adding more subjects.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}