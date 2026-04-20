import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function TutorDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Back link */}
        <Skeleton className="h-4 w-32 mb-8 rounded-full" />

        {/* Profile header card */}
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar with ring effect */}
              <div className="relative shrink-0">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-background" />
              </div>

              <div className="flex-1 space-y-3.5 min-w-0 pt-1">
                {/* Name + badge */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <Skeleton className="h-7 w-44 rounded-md" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <Skeleton className="h-4 w-28 rounded-full" />
                  <Skeleton className="h-4 w-32 rounded-full" />
                  <Skeleton className="h-4 w-36 rounded-full" />
                </div>

                {/* Rate */}
                <Skeleton className="h-8 w-28 rounded-md" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <Separator className="mb-5" />
            <Skeleton className="h-4 w-14 mb-3 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full rounded-full" />
              <Skeleton className="h-3.5 w-[88%] rounded-full" />
              <Skeleton className="h-3.5 w-[72%] rounded-full" />
            </div>
          </CardContent>
        </Card>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left: tabs + slots */}
          <div className="md:col-span-2 space-y-4">
            {/* Tab bar */}
            <div className="flex gap-1.5 p-1 rounded-lg bg-muted/60">
              <Skeleton className="h-8 flex-1 rounded-md" />
              <Skeleton className="h-8 flex-1 rounded-md" />
            </div>

            {/* Slots card */}
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-36 rounded-md" />
                <Skeleton className="h-4 w-64 rounded-full mt-1.5" />
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Two date groups */}
                {[3, 4].map((count, gi) => (
                  <div key={gi}>
                    {/* Date header */}
                    <div className="flex items-center gap-2 mb-3">
                      <Skeleton className="h-3.5 w-3.5 rounded-sm shrink-0" />
                      <Skeleton className="h-4 w-40 rounded-full" />
                      <Skeleton className="h-4 w-12 rounded-full ml-auto" />
                    </div>
                    {/* Slot chips */}
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: count }).map((_, i) => (
                        <div
                          key={i}
                          className="rounded-xl border bg-muted/30 px-4 py-3 flex flex-col gap-1 w-[90px]"
                          style={{ animationDelay: `${i * 80}ms` }}
                        >
                          <Skeleton className="h-3.5 w-3.5 rounded-sm" />
                          <Skeleton className="h-3.5 w-14 rounded-full mt-0.5" />
                          <Skeleton className="h-3 w-14 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right: booking card */}
          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-32 rounded-md" />
                <Skeleton className="h-4 w-48 rounded-full mt-1.5" />
              </CardHeader>

              <CardContent className="space-y-4">
                <Separator />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-4 w-28 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28 rounded-full" />
                  <Skeleton className="h-4 w-8 rounded-full" />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 pt-2">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-3.5 w-52 rounded-full mx-auto" />
              </CardFooter>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}