"use client";

import { useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Clock, Star, CalendarDays, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TutorSectionCards } from "@/app/(dashboardRoute)/tutor/_components/dashboard/tutorSectionCards";
import { TutorSessionsTable } from "@/app/(dashboardRoute)/tutor/_components/dashboard/TutorSessionsTable";
import { CreateProfileDialog } from "@/app/(dashboardRoute)/tutor/_components/profile/CreateProfileDialog";
import { useTutorDashboard } from "@/hooks/useTutorDashboard";

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16 mt-1" />
            </CardHeader>
            <CardContent><Skeleton className="h-3 w-32" /></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <div>
        <p className="font-semibold">Failed to load dashboard</p>
        <p className="text-sm text-muted-foreground mt-1">
          Something went wrong. Please try again.
        </p>
      </div>
      <Button variant="outline" className="rounded-xl gap-2" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}

export default function TutorDashboardPage() {
  const { state, refresh } = useTutorDashboard();

  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  if (state.status === "loading") return <DashboardSkeleton />;

  if (state.status === "error") return <ErrorState onRetry={refresh} />;

  if (state.status === "no_profile") {
    return (
      <CreateProfileDialog
        open={true}
        onCreated={refresh}
      />
    );
  }

  const { stats, tutorProfile, recentBookings, recentReviews } = state.data;

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

      {/* Profile header */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-5">
            <Avatar className="h-16 w-16 text-2xl shrink-0">
              <AvatarImage src={tutorProfile.user.image ?? undefined} />
              <AvatarFallback>
                {(tutorProfile.user.name ?? "T").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-lg font-bold">{tutorProfile.user.name}</h2>
                <Badge variant="secondary">{tutorProfile.category.name}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {(tutorProfile.rating ?? 0).toFixed(1)} · {tutorProfile.totalReviews} review{tutorProfile.totalReviews !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {tutorProfile.experience} year{tutorProfile.experience !== 1 ? "s" : ""} exp
                </span>
                <span className="font-medium text-foreground">
                  BDT {tutorProfile.hourlyRate}/hr
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {stats.availableSlots} slot{stats.availableSlots !== 1 ? "s" : ""} available
                </span>
              </div>
              {tutorProfile.bio && (
                <p className="text-sm text-muted-foreground mt-1.5 line-clamp-1">
                  {tutorProfile.bio}
                </p>
              )}
            </div>

            <div className="flex gap-2 shrink-0">
              <Button variant="outline" asChild size="sm" className="rounded-xl">
                <Link href="/tutor/profile">Edit Profile</Link>
              </Button>
              <Button asChild size="sm" className="rounded-xl">
                <Link href="/tutor/availability">Manage Slots</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <TutorSectionCards stats={stats} />

      {/* Tabs */}
      <div className="px-4 lg:px-6">
        <Tabs defaultValue="sessions">
          <TabsList className="mb-4">
            <TabsTrigger value="sessions">
              Sessions
              {recentBookings.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {recentBookings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews
              {recentReviews.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {recentReviews.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sessions">
            <TutorSessionsTable bookings={recentBookings} onRefresh={refresh} />
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
                <CardDescription>
                  {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""} · {stats.rating.toFixed(1)} avg rating
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-0">
                {recentReviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    No reviews yet. Complete sessions to receive reviews.
                  </p>
                ) : (
                  recentReviews.map((review, i) => (
                    <div key={review.id}>
                      <div className="flex items-start justify-between gap-3 py-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={review.student?.image ?? undefined} />
                            <AvatarFallback>
                              {(review.student?.name ?? "S").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-none">
                              {review.student?.name ?? "Student"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {format(new Date(review.createdAt), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground leading-relaxed pb-2">
                          {review.comment}
                        </p>
                      )}
                      {i < recentReviews.length - 1 && <Separator />}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}