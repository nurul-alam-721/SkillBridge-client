"use client";

import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SectionCards } from "@/components/layout/SectionCards";
import { BookingsTable } from "@/components/modules/bookings/bookingsTable";
import { useMyBookings } from "@/hooks/useMyBookings";

export default function StudentDashboardPage() {
  const { bookings, upcoming, loading, refresh, patchReview } = useMyBookings();

  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards bookings={loading ? [] : bookings} />

      <div className="px-4 lg:px-6">
        <Tabs defaultValue="bookings">
          <TabsList className="mb-4">
            <TabsTrigger value="bookings">
              Bookings
              {upcoming.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {upcoming.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <BookingsTable
              bookings={loading ? [] : bookings}
              onReviewed={refresh}
              patchReview={patchReview}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}