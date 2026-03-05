"use client";

import { Suspense } from "react";
import { Search, SlidersHorizontal, BookOpen, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader,
  SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useTutors } from "@/hooks/useTutors";
import { TutorsFilter } from "@/components/modules/tutor/TutorsFilter";
import { TutorCardSkeleton } from "@/components/modules/tutor/TutorCardSkeleton";
import { TutorCard } from "@/components/modules/tutor/TutorCard";

const SORT_OPTIONS = [
  { label: "Top rated",          value: "rating"     },
  { label: "Price: Low to high", value: "price_asc"  },
  { label: "Price: High to low", value: "price_desc" },
  { label: "Most reviews",       value: "reviews"    },
  { label: "Most experienced",   value: "experience" },
];

function TutorsContent() {
  const {
    tutors, categories, total, loading,
    filters, search, sort, totalPages,
    setSearch, setSort, updateFilters, resetFilters,
  } = useTutors();

  // Active filter count for badge
  const activeFilterCount = [
    filters.categoryId,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  const selectedCategory = categories.find((c) => c.id === filters.categoryId);

  return (
    <div className="min-h-screen bg-background">

      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wide">
              Tutors
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {selectedCategory ? selectedCategory.name : "Browse Tutors"}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {loading
                  ? "Finding tutors..."
                  : `${total} tutor${total !== 1 ? "s" : ""} available`}
              </p>
            </div>

            {/* Active filters summary */}
            {(selectedCategory || search) && (
              <div className="flex flex-wrap items-center gap-2">
                {selectedCategory && (
                  <Badge variant="secondary" className="gap-1.5 pr-1.5">
                    {selectedCategory.name}
                    <button
                      onClick={() => updateFilters({ categoryId: undefined })}
                      className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {search && (
                  <Badge variant="secondary" className="gap-1.5 pr-1.5">
                    &ldquo;{search}&rdquo;
                    <button
                      onClick={() => setSearch("")}
                      className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-6">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-48 h-10 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="sm:hidden h-10 rounded-xl gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl pb-8">
              <SheetHeader className="mb-4">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <TutorsFilter
                categories={categories}
                filters={filters}
                onChange={updateFilters}
                onReset={resetFilters}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Layout */}
        <div className="flex gap-6">

          {/* Desktop sidebar */}
          <aside className="hidden sm:block w-60 shrink-0">
            <div className="sticky top-6 rounded-2xl border bg-card">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm font-semibold">Filters</p>
                  {activeFilterCount > 0 && (
                    <Badge className="h-4 px-1.5 text-[10px]">
                      {activeFilterCount}
                    </Badge>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <Separator />
              <div className="p-5">
                <TutorsFilter
                  categories={categories}
                  filters={filters}
                  onChange={updateFilters}
                  onReset={resetFilters}
                />
              </div>
            </div>
          </aside>

          {/* Tutor grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <TutorCardSkeleton key={i} />
                ))}
              </div>
            ) : tutors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-semibold">No tutors found</p>
                <p className="text-sm text-muted-foreground mt-1 mb-5">
                  Try adjusting your search or clearing filters
                </p>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="rounded-xl h-9 text-sm"
                >
                  Reset filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {tutors.map((tutor) => (
                    <TutorCard key={tutor.id} tutor={tutor} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8 pt-8 border-t">
                    <Button
                      variant="outline" size="sm"
                      className="rounded-xl h-9"
                      disabled={filters.page === 1}
                      onClick={() => updateFilters({ page: (filters.page ?? 1) - 1 })}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      Page {filters.page} of {totalPages}
                    </span>
                    <Button
                      variant="outline" size="sm"
                      className="rounded-xl h-9"
                      disabled={filters.page === totalPages}
                      onClick={() => updateFilters({ page: (filters.page ?? 1) + 1 })}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TutorsPage() {
  return (
    <Suspense>
      <TutorsContent />
    </Suspense>
  );
}