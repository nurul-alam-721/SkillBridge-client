import { TutorProfile } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { TutorCard } from "@/app/(commonRoute)/_components/tutors/TutorCard";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedTutorsSectionProps {
  tutors: TutorProfile[];
  loading: boolean;
}

function TutorCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function FeaturedTutorsSection({
  tutors,
  loading,
}: FeaturedTutorsSectionProps) {
  return (
    <section className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-14">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
              Top Picks
            </p>
            <h2 className="font-serif text-3xl font-bold tracking-tight">
              Featured Tutors
            </h2>
          </div>
          <Link
            href="/tutors"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Browse all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <TutorCardSkeleton key={i} />
            ))}
          </div>
        ) : tutors.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">
            No tutors available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...tutors]
              .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
              .slice(0, 6)
              .map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
