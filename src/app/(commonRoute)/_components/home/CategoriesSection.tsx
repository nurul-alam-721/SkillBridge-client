"use client";
import { Category } from "@/types";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    <div className="rounded-2xl border bg-card p-6 space-y-4">
      <Skeleton className="h-14 w-14 rounded-2xl" />
      <div className="space-y-2.5">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-52" />
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
            SUBJECTS
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight">Browse by Category</h2>
        </div>

        {!loading && categories.length > 6 && (
          <Link
            href="/categories"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            View all categories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))
        ) : displayedCategories.length === 0 ? (
          <p className="col-span-full py-16 text-center text-muted-foreground">
            No categories available yet.
          </p>
        ) : (
          displayedCategories.map((cat) => {
            const { icon: Icon, color } = getCategoryConfig(cat.name);

            return (
              <Link
                key={cat.id}
                href={`/tutors?categoryId=${cat.id}`}
                className="group flex items-center gap-4 rounded-3xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-base leading-tight truncate">
                    {cat.name}
                  </p>
                  {cat.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5">
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