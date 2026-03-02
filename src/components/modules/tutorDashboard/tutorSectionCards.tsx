import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TutorStats } from "@/services/tutor.service";

export function TutorSectionCards({ stats }: { stats: TutorStats }) {
  const cards = [
    {
      title: "Total Sessions",
      value: stats.totalSessions,
      badge: "All time",
      description: "Sessions booked with you",
    },
    {
      title: "Upcoming",
      value: stats.upcoming,
      badge: stats.upcoming > 0 ? "Active" : "None",
      description: "Pending or confirmed",
    },
    {
      title: "Total Earnings",
      value: `$${stats.totalEarnings}`,
      badge: `${stats.completed} completed`,
      description: "From completed sessions",
    },
    {
      title: "Rating",
      value: stats.rating.toFixed(1),
      badge: `${stats.totalReviews} review${stats.totalReviews !== 1 ? "s" : ""}`,
      description: "Average student rating",
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:from-primary/10 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
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
