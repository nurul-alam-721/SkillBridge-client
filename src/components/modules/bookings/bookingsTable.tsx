"use client";

import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Booking, BookingStatus } from "@/services/booking.service";

const STATUS_MAP: Record<BookingStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING:   { label: "Pending",   variant: "outline"     },
  CONFIRMED: { label: "Confirmed", variant: "default"     },
  COMPLETED: { label: "Completed", variant: "secondary"   },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
};

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Your latest tutoring sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No bookings yet. Browse tutors to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => {
                  const { label, variant } = STATUS_MAP[booking.status];
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.tutorProfile.user?.name ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {booking.tutorProfile.category?.name ?? "—"}
                      </TableCell>
                      <TableCell>
                        {format(new Date(booking.slot.date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(booking.slot.startTime), "h:mm a")}
                        {" – "}
                        {format(new Date(booking.slot.endTime), "h:mm a")}
                      </TableCell>
                      <TableCell>BDT {booking.tutorProfile.hourlyRate}/hr</TableCell>
                      <TableCell>
                        <Badge variant={variant}>{label}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}