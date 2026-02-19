import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="py-10 space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight text-primary">
              404
            </h1>
            <h2 className="text-xl font-semibold">Page Not Found</h2>
            <p className="text-sm text-muted-foreground">
              Sorry, the page you are looking for doesn’t exist!
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/tutors">Browse Tutors</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
