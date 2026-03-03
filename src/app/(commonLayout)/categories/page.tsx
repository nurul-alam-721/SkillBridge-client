"use client";

import { useEffect, useState } from "react";
import { Search, BookOpen, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { tutorService, Category } from "@/services/tutor.service";
import { CategoryCard, CategorySkeleton } from "@/components/modules/categories/CategoryCard";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");

  useEffect(() => {
    tutorService
      .getCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">

      <div className="border-b bg-card">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 mb-4">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Browse by Subject</h1>

          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Explore expert tutors across{" "}
            {loading ? "..." : categories.length} subjects.
            Find the right match for your learning goals.
          </p>

          {/* Search */}
          <div className="relative mt-6 max-w-sm mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subjects..."
              className="pl-9 h-10 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategorySkeleton
               key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium">No subjects found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try a different search term
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">
                {filtered.length} subject{filtered.length !== 1 ? "s" : ""} available
              </p>
              {search && (
                <Badge variant="secondary" className="text-xs">
                  &ldquo;{search}&rdquo;
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}