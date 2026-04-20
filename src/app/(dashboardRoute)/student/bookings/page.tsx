"use client";
import { CurrentUser, Booking, BookingReview } from "@/types";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useMyBookings } from "@/hooks/useMyBookings";
import { userService } from "@/services/user.service";

import { cn } from "@/lib/utils";
import { BookingCard, BookingEmptyState } from "../_components/bookings/BookingCard";

/* ── Tab definitions ────────────────────────────────────────────────────── */

type TabValue = "upcoming" | "past" | "reviews" | "all";

const TABS: { label: string; value: TabValue }[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Past",     value: "past" },
  { label: "Reviews",  value: "reviews" },
  { label: "All",      value: "all" },
];

/* ── Filter tabs ────────────────────────────────────────────────────────── */

function BookingFilterTabs({
  activeTab,
  onTabChange,
  counts,
  loading,
}: {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
  counts: Record<TabValue, number>;
  loading: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.value;
        const count = counts[tab.value];
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all border",
              isActive
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-muted-foreground border-border/60 hover:border-border hover:text-foreground",
            )}
          >
            {tab.label}
            {!loading && (
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  isActive
                    ? "bg-background/20 text-background"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── Skeletons ──────────────────────────────────────────────────────────── */

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-xl" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
    </div>
  );
}

/* ── BookingGrid ────────────────────────────────────────────────────────── */

function BookingGrid({
  bookings,
  loading,
  emptyMessage,
  showEmptyAction,
  currentUser,
  onReviewed,
  patchReview,
  onCancel,
}: {
  bookings: Booking[];
  loading: boolean;
  emptyMessage: string;
  showEmptyAction?: boolean;
  currentUser: CurrentUser | null;
  onReviewed: () => void;
  patchReview: (id: string, review: BookingReview | null) => void;
  onCancel: (id: string) => Promise<void>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
      ) : bookings.length === 0 ? (
        <BookingEmptyState message={emptyMessage} showAction={showEmptyAction} />
      ) : (
        bookings.map((b) => (
          <BookingCard
            key={b.id}
            booking={b}
            currentUser={currentUser}
            onReviewed={onReviewed}
            patchReview={patchReview}
            onCancel={onCancel}
          />
        ))
      )}
    </div>
  );
}

/* ── Tab section headers ────────────────────────────────────────────────── */

const TAB_META: Record<TabValue, { title: string; subtitle: (counts: Record<TabValue, number>) => string }> = {
  upcoming: {
    title: "Upcoming Sessions",
    subtitle: () => "Pending and confirmed sessions",
  },
  past: {
    title: "Past Sessions",
    subtitle: () => "Completed and cancelled sessions",
  },
  reviews: {
    title: "My Reviews",
    subtitle: (counts) =>
      `${counts.reviews} review${counts.reviews !== 1 ? "s" : ""} submitted`,
  },
  all: {
    title: "All Bookings",
    subtitle: () => "Complete booking history",
  },
};

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function BookingsPage() {
  const { bookings, upcoming, past, loading, refresh, patchReview, cancelBooking } =
    useMyBookings();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>("upcoming");

  useEffect(() => {
    userService.getMe().then(setCurrentUser).catch(console.error);
  }, []);

  const reviewed   = bookings.filter((b) => !!b.review);
  const unreviewed = bookings.filter(
    (b) => !b.review && (b.status === "COMPLETED" || b.status === "CONFIRMED"),
  );

  const counts: Record<TabValue, number> = {
    upcoming: upcoming.length,
    past:     past.length,
    reviews:  reviewed.length,
    all:      bookings.length,
  };

  const meta = TAB_META[activeTab];

  const sharedGridProps = {
    currentUser,
    onReviewed: refresh,
    patchReview,
    onCancel: cancelBooking,
  };

  return (
    <div className="flex flex-col gap-5 py-4 md:py-6">
      {/* ── Page header ── */}
      <div className="px-4 lg:px-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold leading-tight">My Bookings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {loading
              ? "Loading..."
              : `${bookings.length} total · ${upcoming.length} upcoming · ${reviewed.length} reviewed`}
          </p>
        </div>
        <Button
          variant="outline" size="sm"
          className="rounded-xl gap-1.5 text-xs"
          onClick={refresh}
          disabled={loading}
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="px-4 lg:px-6 space-y-5">
        {/* ── Filter tabs ── */}
        <BookingFilterTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
          loading={loading}
        />

        {/* ── Section header ── */}
        <div>
          <h2 className="text-base font-semibold">{meta.title}</h2>
          <p className="text-sm text-muted-foreground">{meta.subtitle(counts)}</p>
        </div>

        {/* ── Content ── */}
        {activeTab === "upcoming" && (
          <BookingGrid
            bookings={upcoming}
            loading={loading}
            emptyMessage="No upcoming sessions"
            showEmptyAction
            {...sharedGridProps}
          />
        )}

        {activeTab === "past" && (
          <BookingGrid
            bookings={past}
            loading={loading}
            emptyMessage="No past sessions yet"
            {...sharedGridProps}
          />
        )}

        {activeTab === "reviews" && (
          <div className="space-y-5">
            {/* Awaiting review */}
            {unreviewed.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Awaiting your review
                </p>
                <BookingGrid
                  bookings={unreviewed}
                  loading={false}
                  emptyMessage=""
                  {...sharedGridProps}
                />
              </div>
            )}

            {/* Submitted reviews */}
            {reviewed.length > 0 && (
              <div className="space-y-3">
                {unreviewed.length > 0 && (
                  <>
                    <Separator />
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Submitted reviews
                    </p>
                  </>
                )}
                <BookingGrid
                  bookings={reviewed}
                  loading={false}
                  emptyMessage=""
                  {...sharedGridProps}
                />
              </div>
            )}

            {reviewed.length === 0 && unreviewed.length === 0 && !loading && (
              <BookingEmptyState message="No reviews yet" />
            )}
          </div>
        )}

        {activeTab === "all" && (
          <BookingGrid
            bookings={bookings}
            loading={loading}
            emptyMessage="No bookings yet"
            showEmptyAction
            {...sharedGridProps}
          />
        )}
      </div>
    </div>
  );
}