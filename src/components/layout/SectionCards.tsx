import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Booking } from "@/services/booking.service";

export function SectionCards({ bookings }: { bookings: Booking[] }) {
  const total = bookings.length;
  const upcoming = bookings.filter((b) =>
    ["PENDING", "CONFIRMED"].includes(b.status),
  ).length;
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;
  const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;

  const cards = [
    {
      title: "Total Bookings",
      value: total,
      description: "All time sessions",
      badge: "All time",
    },
    {
      title: "Upcoming",
      value: upcoming,
      description: "Pending or confirmed",
      badge: upcoming > 0 ? "Active" : "None",
    },
    {
      title: "Completed",
      value: completed,
      description: "Sessions attended",
      badge:
        completed > 0
          ? `${Math.round((completed / (total || 1)) * 100)}%`
          : "0%",
    },
    {
      title: "Cancelled",
      value: cancelled,
      description: "Sessions cancelled",
      badge: cancelled > 0 ? "Review" : "None",
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:from-primary/10 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
      {cards.map((card) => (
        <Card key={card.title} data-slot="card">
          <CardHeader className="relative">
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="text-3xl font-bold tabular-nums">
              {card.value}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="text-xs">
                {card.badge}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            {card.description}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
