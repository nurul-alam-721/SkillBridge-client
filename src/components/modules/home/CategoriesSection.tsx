"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Category } from "@/services/tutor.service";
import { getCategoryConfig } from "../categories/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoriesSectionProps {
  categories: Category[];
  loading: boolean;       
}

export function CategoriesSection({
  categories,
  loading,
}: CategoriesSectionProps) {
  const displayedCategories = categories.slice(0, 6);

  const CategoryCardSkeleton = () => (
    <div className="rounded-2xl border bg-card p-5 space-y-4">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3.5 w-48" />
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
            Subjects
          </p>
          <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
        </div>

        {!loading && categories.length > 6 && (
          <Link
            href="/categories"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))
        ) : displayedCategories.length === 0 ? (
          <p className="col-span-full py-12 text-center text-muted-foreground">
            No categories available yet.
          </p>
        ) : (
          displayedCategories.map((cat) => {
            const { icon: Icon, color } = getCategoryConfig(cat.name);

            return (
              <Link
                key={cat.id}
                href={`/tutors?categoryId=${cat.id}`}
                className="group flex items-center gap-3 rounded-2xl border bg-card px-5 py-5 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{cat.name}</p>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5 line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}