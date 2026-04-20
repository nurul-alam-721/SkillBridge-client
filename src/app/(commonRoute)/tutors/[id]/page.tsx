"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  BriefcaseBusiness,
  Mail,
  Phone,
  AlertCircle,
  ChevronLeft,
  LogIn,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { tutorService } from "@/services/tutor.service";
import { bookingService } from "@/services/booking.service";
import { authClient } from "@/lib/auth-client";
import { CurrentUser, AvailabilitySlot, TutorProfile, Booking, User } from "@/types";
import { Roles } from "@/constant/Roles";
import { TutorDetailsSkeleton } from "@/app/(commonRoute)/_components/tutorDetails/TutorDetailsSkeleton";
import { AvailabilitySlots } from "@/app/(commonRoute)/_components/tutorDetails/AvailabilitySlots";
import { ReviewsList } from "@/app/(commonRoute)/_components/tutorDetails/ReviewsList";
import { BookingConfirmDialog } from "@/app/(dashboardRoute)/student/_components/bookings/BookingConfirmDialog";
import { PaymentDialog } from "@/app/(dashboardRoute)/student/_components/bookings/PaymentDialog";


function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong.",
): string {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { data?: { message?: string } } })
      .response;
    if (res?.data?.message) return res.data.message;
  }
  return fallback;
}

function useTutor(id: string) {
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        setTutor(await tutorService.getById(id));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const markSlotBooked = (slotId: string) =>
    setTutor((prev) =>
      prev
        ? {
          ...prev,
          availability: prev.availability?.map((s) => {
            if (s.id !== slotId) return s;
            const newTotal = (s.totalBookings ?? 0) + 1;
            return {
              ...s,
              totalBookings: newTotal,
              isBooked: newTotal >= (s.maxCapacity ?? 50),
            };
          }),
        }
        : prev,
    );

  return { tutor, loading, error, markSlotBooked };
}

export default function TutorDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { tutor, loading, error, markSlotBooked } = useTutor(id);
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const user = session?.user as User | undefined;

  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [booking, setBooking] = useState(false);
  const [myBookedSlots, setMyBookedSlots] = useState<Set<string>>(new Set());
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  const isStudent = user?.role === Roles.student;
  const isGuest = !user && !sessionPending;

  useEffect(() => {
    if (!isStudent) return;
    setBookingsLoading(true);
    bookingService
      .getMyBookings()
      .then((bookings: Booking[]) => {
        const ids = new Set(
          bookings
            .filter(
              (b) =>
                b.tutorProfile?.id === tutor?.id && b.status !== "CANCELLED",
            )
            .map((b) => b.slotId as string),
        );
        setMyBookedSlots(ids);
      })
      .catch(() => { })
      .finally(() => setBookingsLoading(false));
  }, [isStudent, tutor?.id]);

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !tutor) return;
    setBooking(true);
    try {
      const newBooking = await bookingService.create({
        tutorProfileId: tutor.id,
        slotId: selectedSlot.id,
      });
      markSlotBooked(selectedSlot.id);
      setMyBookedSlots((prev) => new Set(prev).add(selectedSlot.id));
      setSelectedSlot(null);
      setConfirmOpen(false);
      setCreatedBooking(newBooking);
      setPaymentOpen(true);
      toast.success("Booking secured! Please complete your payment.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to book. Please try again."));
    } finally {
      setBooking(false);
    }
  };

  const handleBookClick = () => {
    if (!selectedSlot || !tutor) return;
    if (isGuest) {
      router.push(`/login?redirect=/tutors/${id}`);
      return;
    }
    if (!isStudent) {
      toast.error("Only students can book sessions.");
      return;
    }
    if (myBookedSlots.has(selectedSlot.id)) {
      toast.error("You have already booked this slot.");
      return;
    }
    setConfirmOpen(true);
  };

  // ── Guards ──────────────────────────────────────────────────────────────────

  if (loading || sessionPending) return <TutorDetailsSkeleton />;

  if (error || !tutor || !tutor.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <p className="font-semibold text-lg">Tutor not found</p>
          <p className="text-sm text-muted-foreground mt-1">
            This tutor may no longer be available.
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => router.push("/tutors")}
        >
          Browse tutors
        </Button>
      </div>
    );
  }

  const availableCount =
    tutor.availability?.filter((s) => !s.isBooked).length ?? 0;
  const selectedAlreadyBooked = selectedSlot
    ? myBookedSlots.has(selectedSlot.id)
    : false;
  const canBook =
    isStudent &&
    selectedSlot &&
    !selectedAlreadyBooked &&
    !booking &&
    !bookingsLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back */}
        <button
          onClick={() => router.push("/tutors")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to tutors
        </button>

        {/* ── Profile header ── */}
        <div className="mb-6 rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
          <div className="h-24 bg-linear-to-br from-primary/8 via-primary/4 to-transparent" />

          <div className="px-6 pb-6 -mt-12">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <Avatar className="h-20 w-20 text-2xl ring-4 ring-background shadow-lg shrink-0">
                <AvatarImage
                  src={tutor.user.image ?? undefined}
                  alt={tutor.user.name ?? "Tutor"}
                />
                <AvatarFallback className="text-2xl font-bold bg-linear-to-br from-primary/30 to-primary/10 text-primary">
                  {(tutor.user.name ?? "T").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 pt-3 sm:pt-0 sm:mt-12">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold tracking-tight">
                    {tutor.user.name ?? "Unknown"}
                  </h1>
                  <Badge variant="secondary" className="rounded-full">
                    {tutor.category.name}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <BriefcaseBusiness className="h-3.5 w-3.5" />
                    {tutor.experience} year{tutor.experience !== 1 ? "s" : ""}{" "}
                    experience
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground">
                      {(tutor.rating ?? 0).toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({tutor.totalReviews} review
                      {tutor.totalReviews !== 1 ? "s" : ""})
                    </span>
                  </span>
                  {tutor.user.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      {tutor.user.email}
                    </span>
                  )}
                  {tutor.user.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      {tutor.user.phone}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight">
                    BDT {tutor.hourlyRate}
                  </span>
                  <span className="text-sm text-muted-foreground">/hr</span>
                </div>
              </div>
            </div>

            {tutor.bio && (
              <>
                <Separator className="my-5" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    About
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tutor.bio}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left */}
          <div className="md:col-span-2">
            <Tabs defaultValue="availability">
              <TabsList className="mb-5 w-full rounded-xl">
                <TabsTrigger value="availability" className="flex-1 rounded-lg">
                  Availability
                  {availableCount > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {availableCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1 rounded-lg">
                  Reviews
                  {(tutor.reviews?.length ?? 0) > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {tutor.reviews?.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="availability">
                <Card className="rounded-2xl border-border/50 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Available Slots</CardTitle>
                    <CardDescription>
                      {isStudent
                        ? `Select a slot to book a session with ${tutor.user.name?.split(" ")[0]}.`
                        : isGuest
                          ? "Log in as a student to book a session."
                          : "Only students can book sessions."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AvailabilitySlots
                      slots={tutor.availability ?? []}
                      selectedSlotId={selectedSlot?.id ?? null}
                      myBookedSlotIds={myBookedSlots}
                      onSelect={isStudent ? setSelectedSlot : () => { }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card className="rounded-2xl border-border/50 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Student Reviews</CardTitle>
                    <CardDescription>
                      {tutor.totalReviews} review
                      {tutor.totalReviews !== 1 ? "s" : ""} ·{" "}
                      {(tutor.rating ?? 0).toFixed(1)} avg
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReviewsList reviews={tutor.reviews ?? []} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: booking card */}
          <div className="md:col-span-1">
            <Card className="sticky top-6 rounded-2xl border-border/50 shadow-sm overflow-hidden">
              <div className="h-1.5 bg-linear-to-r from-primary/60 to-primary" />
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Book a Session</CardTitle>
                <CardDescription>
                  {isGuest
                    ? "Sign in as a student to book."
                    : !isStudent
                      ? "Only students can make bookings."
                      : selectedAlreadyBooked
                        ? "You've already booked this slot."
                        : selectedSlot
                          ? "Review your selected slot below."
                          : "Pick a slot from the availability tab."}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3.5">
                {selectedSlot && isStudent && (
                  <div
                    className={`rounded-xl border p-3.5 text-sm space-y-1 ${selectedAlreadyBooked
                        ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700"
                        : "bg-primary/5 border-primary/20"
                      }`}
                  >
                    <p
                      className={`text-xs font-semibold uppercase tracking-wide ${selectedAlreadyBooked
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-primary"
                        }`}
                    >
                      {selectedAlreadyBooked
                        ? "Already booked"
                        : "Selected slot"}
                    </p>
                    <p className="font-medium">
                      {format(
                        new Date(selectedSlot.startTime),
                        "EEEE, MMM d, yyyy",
                      )}
                    </p>
                    <p className="text-muted-foreground tabular-nums text-xs">
                      {format(new Date(selectedSlot.startTime), "h:mm a")} →{" "}
                      {format(new Date(selectedSlot.endTime), "h:mm a")}
                    </p>
                  </div>
                )}

                {!isGuest && !isStudent && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-900/10 dark:border-amber-700 px-3 py-2.5 text-xs text-amber-700 dark:text-amber-400 font-medium text-center">
                    Only students can book tutoring sessions.
                  </div>
                )}

                <Separator />

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Hourly rate</span>
                    <span className="font-semibold">
                      BDT {tutor.hourlyRate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      Available slots
                    </span>
                    <span
                      className={`font-semibold ${availableCount === 0
                          ? "text-destructive"
                          : "text-emerald-600 dark:text-emerald-400"
                        }`}
                    >
                      {availableCount}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-2">
                {isGuest ? (
                  <Button
                    className="w-full rounded-xl gap-2"
                    onClick={() => router.push(`/login?redirect=/tutors/${id}`)}
                  >
                    <LogIn className="h-4 w-4" />
                    Login to Book
                  </Button>
                ) : (
                  <Button
                    className="w-full rounded-xl"
                    disabled={!canBook}
                    onClick={handleBookClick}
                  >
                    {selectedAlreadyBooked
                      ? "Already Booked"
                      : "Confirm Booking"}
                  </Button>
                )}
                <p className="text-xs text-center text-muted-foreground">
                  {isStudent
                    ? "You won't be charged until the session is confirmed."
                    : isGuest
                      ? "Create a free account to get started."
                      : ""}
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {confirmOpen && selectedSlot && (
        <BookingConfirmDialog
          open={confirmOpen}
          tutor={tutor}
          slot={selectedSlot}
          onConfirm={handleConfirmBooking}
          onCancel={() => setConfirmOpen(false)}
          confirming={booking}
        />
      )}

      <PaymentDialog
        open={paymentOpen}
        booking={createdBooking}
        user={(user as unknown as CurrentUser) ?? null}
        onClose={() => {
          setPaymentOpen(false);
          setCreatedBooking(null);
        }}
        onSuccess={() => {
          toast.success("Payment completed successfully!");
          router.push("/student/bookings");
        }}
      />
    </div>
  );
}
