"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  BriefcaseBusiness,
  Tag,
  Mail,
  Phone,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
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
import {
  AvailabilitySlot,
  TutorProfile,
  tutorService,
} from "@/services/tutor.service";
import { TutorDetailsSkeleton } from "@/components/modules/tutorDetails/TutorDetailsSkeleton";
import { AvailabilitySlots } from "@/components/modules/tutorDetails/AvailabilitySlots";
import { ReviewsList } from "@/components/modules/tutorDetails/ReviewsList";

export function useTutor(id: string) {
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
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

    fetch();
  }, [id]);

  return { tutor, loading, error };
}

export default function TutorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { tutor, loading, error } = useTutor(id);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null,
  );
  const [booking, setBooking] = useState(false);

  const handleBook = async () => {
    if (!selectedSlot) {
      toast.error("Please select an available time slot.");
      return;
    }
    setBooking(true);
    try {
      toast.success("Session booked successfully!");
      setSelectedSlot(null);
    } catch {
      toast.error("Failed to book session. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <TutorDetailsSkeleton />;

  if (error || !tutor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground" />
        <p className="font-semibold">Tutor not found</p>
        <p className="text-sm text-muted-foreground">
          This tutor may no longer be available.
        </p>
        <Button
          variant="outline"
          className="rounded-xl mt-1"
          onClick={() => router.push("/tutors")}
        >
          Browse tutors
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back */}
        <button
          onClick={() => router.push("/tutors")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to tutors
        </button>

        {/* Profile header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <Avatar className="h-20 w-20 text-2xl">
                <AvatarImage
                  src={tutor.user.image ?? undefined}
                  alt={tutor.user.name ?? "Tutor"}
                />
                <AvatarFallback>
                  {(tutor.user.name ?? "T").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <CardTitle className="text-2xl">
                    {tutor.user.name ?? "Unknown"}
                  </CardTitle>
                  <Badge variant="secondary">{tutor.category.name}</Badge>
                </div>

                <CardDescription className="flex flex-wrap gap-3 mt-1">
                  <span className="flex items-center gap-1">
                    <BriefcaseBusiness className="h-3.5 w-3.5" />
                    {tutor.experience} yr{tutor.experience !== 1 ? "s" : ""}{" "}
                    experience
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {tutor.rating.toFixed(1)} ({tutor.totalReviews} review
                    {tutor.totalReviews !== 1 ? "s" : ""})
                  </span>
                  {tutor.user.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {tutor.user.email}
                    </span>
                  )}
                  {tutor.user.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {tutor.user.phone}
                    </span>
                  )}
                </CardDescription>

                <div className="mt-3">
                  <span className="text-2xl font-bold">
                    ${tutor.hourlyRate}
                  </span>
                  <span className="text-sm text-muted-foreground"> / hr</span>
                </div>
              </div>
            </div>
          </CardHeader>

          {tutor.bio && (
            <CardContent>
              <Separator className="mb-4" />
              <p className="text-sm font-semibold mb-1">About</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tutor.bio}
              </p>
            </CardContent>
          )}
        </Card>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="availability">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="availability" className="flex-1">
                  Availability
                  {(tutor.availability?.filter((s) => !s.isBooked).length ??
                    0) > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {tutor.availability?.filter((s) => !s.isBooked).length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">
                  Reviews
                  {(tutor.reviews?.length ?? 0) > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {tutor.reviews?.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="availability">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Available Slots</CardTitle>
                    <CardDescription>
                      Select a slot to book a session with{" "}
                      {tutor.user.name?.split(" ")[0]}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AvailabilitySlots
                      slots={tutor.availability ?? []}
                      selectedSlotId={selectedSlot?.id ?? null}
                      onSelect={setSelectedSlot}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Student Reviews</CardTitle>
                    <CardDescription>
                      {tutor.totalReviews} review
                      {tutor.totalReviews !== 1 ? "s" : ""} ·{" "}
                      {tutor.rating.toFixed(1)} avg rating
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
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-base">Book a Session</CardTitle>
                <CardDescription>
                  {selectedSlot
                    ? "Review your selected slot below."
                    : "Pick a slot from the availability tab."}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {selectedSlot && (
                  <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-sm space-y-0.5">
                    <p className="font-medium text-primary">Selected slot</p>
                    <p className="text-muted-foreground">
                      {new Date(selectedSlot.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-muted-foreground">
                      {new Date(selectedSlot.startTime).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                        },
                      )}
                      {" – "}
                      {new Date(selectedSlot.endTime).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hourly rate</span>
                  <span className="font-semibold">
                    BDT {tutor.hourlyRate} / hr
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-2">
                <Button
                  className="w-full rounded-xl"
                  disabled={!selectedSlot || booking}
                  onClick={handleBook}
                >
                  {booking ? "Booking..." : "Confirm Booking"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  You won&apos;t be charged until the session is confirmed.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
