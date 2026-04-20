import { Category } from "@/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  BookOpen, FlaskConical, Leaf, Zap,
  Calculator, Monitor, BookMarked, Code2, GraduationCap,
} from "lucide-react";



export type CategoryConfig = {
  icon: React.FC<{ className?: string }>;
  color: string;
};


export const CATEGORY_MAP: Record<string, CategoryConfig> = {
  english: {
    icon: BookOpen,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
  },
  chemistry: {
    icon: FlaskConical,
    color: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
  },
  biology: {
    icon: Leaf,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  physics: {
    icon: Zap,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
  },
  math: {
    icon: Calculator,
    color: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
  },
  "computer science": {
    icon: Monitor,
    color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400",
  },
  accounting: {
    icon: BookMarked,
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
  },
  programming: {
    icon: Code2,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
  },
};

export const DEFAULT_CATEGORY_CONFIG: CategoryConfig = {
  icon: GraduationCap,
  color: "bg-muted text-muted-foreground",
};


export function getCategoryConfig(name: string): CategoryConfig {
  const key = name.toLowerCase().trim();
  if (CATEGORY_MAP[key]) return CATEGORY_MAP[key];
  for (const [k, config] of Object.entries(CATEGORY_MAP)) {
    if (key.includes(k) || k.includes(key)) return config;
  }
  return DEFAULT_CATEGORY_CONFIG;
}


interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { icon: Icon, color } = getCategoryConfig(category.name);

  return (
    <Link
      href={`/tutors?categoryId=${category.id}`}
      className="group flex flex-col gap-3 rounded-2xl border bg-card p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 space-y-1">
        <h3 className="text-sm font-semibold leading-tight">{category.name}</h3>
        {category.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {category.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-primary">
        <span>Browse tutors</span>
        <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 animate-pulse">
      <div className="h-11 w-11 rounded-xl bg-muted" />
      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-3/4 rounded bg-muted" />
      </div>
      <div className="h-3 w-20 rounded bg-muted" />
    </div>
  );
}