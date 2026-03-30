"use client";

import { useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { type Category } from "@/services/tutor.service";
import { CategoryCard } from "@/components/modules/categories/CategoryCard";

interface CategoriesClientProps {
  initialCategories: Category[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [search, setSearch] = useState("");

  const filtered = initialCategories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Search */}
      <div className="relative mb-8 max-w-sm mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subjects..."
          className="pl-9 h-10 rounded-xl"
        />
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium">No subjects found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try a different search term
          </p>
        </div>
      )}

      {/* Results */}
      {filtered.length > 0 && (
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
  );
}