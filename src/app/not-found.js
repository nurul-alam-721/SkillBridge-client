import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import { BackButton } from "../components/layout/BackButton";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-150 w-150 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-75 w-75 rounded-full bg-primary/3 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-50  w-50 rounded-full bg-muted blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">

        <div className="relative mb-8 select-none">
          <span className="text-[9rem] font-black leading-none tracking-tighter text-border/50 dark:text-border/30">
            404
          </span>
        </div>

        <div className="mb-6 flex items-center gap-3 w-full max-w-xs">
          <div className="h-px flex-1 bg-border/50" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Page not found</span>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-3">
          Something&apos;s missing
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-xs">
          The page doesn&apos;t exist or may have been moved.
        </p>

        <Button asChild size="lg" className="rounded-xl gap-2 max-w-xs shadow-sm">
          <Link href="/">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <BackButton />

      </div>
    </div>
  );
}