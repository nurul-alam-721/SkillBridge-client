"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Star, BriefcaseBusiness, Mail, Phone,
  AlertCircle, ChevronLeft, LogIn, Loader2, Users,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { AvailabilitySlot, TutorProfile, tutorService } from "@/services/tutor.service";
import { bookingService, Booking } from "@/services/booking.service";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types/types";
import { Roles } from "@/constant/Roles";
import { TutorDetailsSkeleton } from "@/components/modules/tutorDetails/TutorDetailsSkeleton";
import { AvailabilitySlots } from "@/components/modules/tutorDetails/AvailabilitySlots";
import { ReviewsList } from "@/components/modules/tutorDetails/ReviewsList";


function getErrorMessage(err: unknown, fallback = "Something went wrong."): string {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response;
    if (res?.data?.message) return res.data.message;
  }
  return fallback;
}


function useTutor(id: string) {
  const [tutor,   setTutor]   = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await tutorService.getById(id);
        setTutor(data);
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
            availability: prev.availability?.map((s) =>
              s.id === slotId ? { ...s, isBooked: true } : s
            ),
          }
        : prev
    );

  return { tutor, loading, error, markSlotBooked };
}


export default function TutorDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { tutor, loading, error, markSlotBooked } = useTutor(id);
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const user = session?.user as User | undefined;

  const [selectedSlot,   setSelectedSlot]   = useState<AvailabilitySlot | null>(null);
  const [booking,        setBooking]        = useState(false);
  const [myBookedSlots,  setMyBookedSlots]  = useState<Set<string>>(new Set());
  const [bookingsLoading,setBookingsLoading]= useState(false);

  const isStudent = user?.role === Roles.student;
  const isGuest   = !user && !sessionPending;

  useEffect(() => {
    if (!isStudent) return;
    setBookingsLoading(true);
    bookingService.getMyBookings()
      .then((bookings: Booking[]) => {
        const bookedSlotIds = new Set(
          bookings
            .filter((b) => b.tutorProfile?.id === tutor?.id && b.status !== "CANCELLED")
            .map((b) => b.slotId)
        );
        setMyBookedSlots(bookedSlotIds);
      })
      .catch(() => {})
      .finally(() => setBookingsLoading(false));
  }, [isStudent, tutor?.id]);

  const handleBook = async () => {
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

    setBooking(true);
    try {
      await bookingService.create({
        tutorProfileId: tutor.id,
        slotId: selectedSlot.id,
      });

      markSlotBooked(selectedSlot.id);
      setMyBookedSlots((prev) => new Set(prev).add(selectedSlot.id));
      setSelectedSlot(null);

      toast.success("Session booked! Check your dashboard for details.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to book. Please try again."));
    } finally {
      setBooking(false);
    }
  };

  if (loading || sessionPending) return <TutorDetailsSkeleton />;

  if (error || !tutor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground" />
        <p className="font-semibold">Tutor not found</p>
        <p className="text-sm text-muted-foreground">This tutor may no longer be available.</p>
        <Button variant="outline" className="rounded-xl mt-1" onClick={() => router.push("/tutors")}>
          Browse tutors
        </Button>
      </div>
    );
  }

  const availableCount = tutor.availability?.filter((s) => !s.isBooked).length ?? 0;

  const selectedAlreadyBooked = selectedSlot ? myBookedSlots.has(selectedSlot.id) : false;
  const canBook = isStudent && selectedSlot && !selectedAlreadyBooked && !booking && !bookingsLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        <button
          onClick={() => router.push("/tutors")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to tutors
        </button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <Avatar className="h-20 w-20 text-2xl">
                <AvatarImage src={tutor.user.image ?? undefined} alt={tutor.user.name ?? "Tutor"} />
                <AvatarFallback>{(tutor.user.name ?? "T").charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <CardTitle className="text-2xl">{tutor.user.name ?? "Unknown"}</CardTitle>
                  <Badge variant="secondary">{tutor.category.name}</Badge>
                </div>

                <CardDescription className="flex flex-wrap gap-3 mt-1">
                  <span className="flex items-center gap-1">
                    <BriefcaseBusiness className="h-3.5 w-3.5" />
                    {tutor.experience} yr{tutor.experience !== 1 ? "s" : ""} experience
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {tutor.rating.toFixed(1)} ({tutor.totalReviews} review{tutor.totalReviews !== 1 ? "s" : ""})
                  </span>
                  {tutor.user.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />{tutor.user.email}
                    </span>
                  )}
                  {tutor.user.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />{tutor.user.phone}
                    </span>
                  )}
                </CardDescription>

                <div className="mt-3">
                  <span className="text-2xl font-bold">BDT {tutor.hourlyRate}</span>
                  <span className="text-sm text-muted-foreground"> / hr</span>
                </div>
              </div>
            </div>
          </CardHeader>

          {tutor.bio && (
            <CardContent>
              <Separator className="mb-4" />
              <p className="text-sm font-semibold mb-1">About</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{tutor.bio}</p>
            </CardContent>
          )}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="md:col-span-2">
            <Tabs defaultValue="availability">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="availability" className="flex-1">
                  Availability
                  {availableCount > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">{availableCount}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">
                  Reviews
                  {(tutor.reviews?.length ?? 0) > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">{tutor.reviews?.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="availability">
                <Card>
                  <CardHeader>
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
                      onSelect={isStudent ? setSelectedSlot : () => {}}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Student Reviews</CardTitle>
                    <CardDescription>
                      {tutor.totalReviews} review{tutor.totalReviews !== 1 ? "s" : ""} · {tutor.rating.toFixed(1)} avg rating
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReviewsList reviews={tutor.reviews ?? []} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
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

              <CardContent className="space-y-4">
                {/* Selected slot preview */}
                {selectedSlot && isStudent && (
                  <div className={`rounded-xl border p-3 text-sm space-y-0.5 ${
                    selectedAlreadyBooked
                      ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                      : "bg-primary/5 border-primary/20"
                  }`}>
                    <p className={`font-medium ${selectedAlreadyBooked ? "text-amber-600 dark:text-amber-400" : "text-primary"}`}>
                      {selectedAlreadyBooked ? "Already booked by you" : "Selected slot"}
                    </p>
                    <p className="text-muted-foreground">
                      {format(new Date(selectedSlot.startTime), "EEEE, MMM d, yyyy")}
                    </p>
                    <p className="text-muted-foreground">
                      {format(new Date(selectedSlot.startTime), "hh:mm a")}
                      {" – "}
                      {format(new Date(selectedSlot.endTime), "hh:mm a")}
                    </p>
                  </div>
                )}

                {!isGuest && !isStudent && (
                  <div className="rounded-xl bg-muted px-3 py-2.5 text-xs text-muted-foreground">
                    Only students can book tutoring sessions.
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hourly rate</span>
                  <span className="font-semibold">BDT {tutor.hourlyRate} / hr</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Available slots
                  </span>
                  <span className={`font-semibold ${availableCount === 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}`}>
                    {availableCount}
                  </span>
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
                    className="w-full rounded-xl gap-2"
                    disabled={!canBook}
                    onClick={handleBook}
                  >
                    {booking && <Loader2 className="h-4 w-4 animate-spin" />}
                    {booking
                      ? "Booking..."
                      : selectedAlreadyBooked
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
    </div>
  );
}