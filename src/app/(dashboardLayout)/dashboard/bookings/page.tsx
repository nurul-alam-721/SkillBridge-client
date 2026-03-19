"use client";

import Link from "next/link";
import { BookOpen, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyBookings } from "@/hooks/useMyBookings";
import { BookingCard } from "@/components/modules/bookings/bookingCard";

function BookingCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

function EmptyState({ message, showAction }: { message: string; showAction?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
        <BookOpen className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Your sessions will appear here once booked.
        </p>
      </div>
      {showAction && (
        <Button asChild size="sm" className="rounded-xl mt-1">
          <Link href="/tutors">Browse Tutors</Link>
        </Button>
      )}
    </div>
  );
}

export default function BookingsPage() {
  const { bookings, upcoming, past, loading, refresh, patchReview } = useMyBookings();

  const reviewed   = bookings.filter((b) => !!b.review);
  const unreviewed = bookings.filter(
    (b) => !b.review && (b.status === "COMPLETED" || b.status === "CONFIRMED")
  );

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

      {/* Header */}
      <div className="px-4 lg:px-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold leading-tight">My Bookings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {loading ? "Loading..." : `${bookings.length} total · ${upcoming.length} upcoming · ${reviewed.length} reviewed`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl gap-1.5 text-xs"
          onClick={refresh}
          disabled={loading}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="px-4 lg:px-6">
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-5">
            <TabsTrigger value="upcoming">
              Upcoming
              {upcoming.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">{upcoming.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">
              Past
              {past.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">{past.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews
              {reviewed.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">{reviewed.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">
              All
              {bookings.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">{bookings.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Upcoming */}
          <TabsContent value="upcoming">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Upcoming Sessions</CardTitle>
                <CardDescription className="text-xs">Pending and confirmed sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => <BookingCardSkeleton key={i} />)}
                  </div>
                ) : upcoming.length === 0 ? (
                  <EmptyState message="No upcoming sessions" showAction />
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {upcoming.map((b) => <BookingCard key={b.id} booking={b} onReviewed={refresh} patchReview={patchReview} />)}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Past */}
          <TabsContent value="past">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Past Sessions</CardTitle>
                <CardDescription className="text-xs">Completed and cancelled sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => <BookingCardSkeleton key={i} />)}
                  </div>
                ) : past.length === 0 ? (
                  <EmptyState message="No past sessions yet" />
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {past.map((b) => <BookingCard key={b.id} booking={b} onReviewed={refresh} patchReview={patchReview} />)}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">My Reviews</CardTitle>
                <CardDescription className="text-xs">
                  {reviewed.length} review{reviewed.length !== 1 ? "s" : ""} submitted
                  {unreviewed.length > 0 && ` · ${unreviewed.length} pending`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pending reviews */}
                {unreviewed.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                      Awaiting your review
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {unreviewed.map((b) => (
                        <BookingCard key={b.id} booking={b} onReviewed={refresh} patchReview={patchReview} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Submitted reviews */}
                {reviewed.length > 0 && (
                  <div>
                    {unreviewed.length > 0 && (
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                        Submitted reviews
                      </p>
                    )}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {reviewed.map((b) => (
                        <BookingCard key={b.id} booking={b} onReviewed={refresh} patchReview={patchReview} />
                      ))}
                    </div>
                  </div>
                )}

                {reviewed.length === 0 && unreviewed.length === 0 && (
                  <EmptyState message="No reviews yet" />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All */}
          <TabsContent value="all">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">All Bookings</CardTitle>
                <CardDescription className="text-xs">Complete booking history</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => <BookingCardSkeleton key={i} />)}
                  </div>
                ) : bookings.length === 0 ? (
                  <EmptyState message="No bookings yet" showAction />
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {bookings.map((b) => <BookingCard key={b.id} booking={b} onReviewed={refresh} patchReview={patchReview} />)}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}