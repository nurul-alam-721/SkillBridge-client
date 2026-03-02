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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { TutorBooking, BookingStatus } from "@/services/tutor.service";

const STATUS_MAP: Record<
  BookingStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDING: { label: "Pending", variant: "outline" },
  CONFIRMED: { label: "Confirmed", variant: "default" },
  COMPLETED: { label: "Completed", variant: "secondary" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
};

export function TutorSessionsTable({
  bookings,
  onRefresh,
}: {
  bookings: TutorBooking[];
  onRefresh: () => void;
}) {
  const handleStatusChange = async (bookingId: string, status: string) => {
    try {
      await api.put(`/api/bookings/${bookingId}/status`, { status });
      toast.success("Status updated");
      onRefresh();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
        <CardDescription>
          Manage your tutoring sessions and update their status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No sessions yet. Students will appear here once they book with you.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => {
                const { label, variant } = STATUS_MAP[booking.status];
                return (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage
                            src={booking.student.image ?? undefined}
                          />
                          <AvatarFallback>
                            {(booking.student.name ?? "S")
                              .charAt(0)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {booking.student.name ?? "Student"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {booking.student.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.slot.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.slot.startTime), "h:mm a")}
                      {" – "}
                      {format(new Date(booking.slot.endTime), "h:mm a")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={variant}>{label}</Badge>
                    </TableCell>
                    <TableCell>
                      {["PENDING", "CONFIRMED"].includes(booking.status) ? (
                        <Select
                          defaultValue={booking.status}
                          onValueChange={(val) =>
                            handleStatusChange(booking.id, val)
                          }
                        >
                          <SelectTrigger className="h-8 w-32 rounded-lg text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CONFIRMED" className="text-xs">
                              Confirm
                            </SelectItem>
                            <SelectItem value="COMPLETED" className="text-xs">
                              Complete
                            </SelectItem>
                            <SelectItem value="CANCELLED" className="text-xs">
                              Cancel
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
