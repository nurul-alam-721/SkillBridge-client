import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./ModeToggle";
import { NavbarActions } from "../modules/home/NavbarActions";
import { Suspense } from "react";

const PUBLIC_LINKS = [
  { title: "Home", href: "/" },
  { title: "Tutors", href: "/tutors" },
  { title: "Categories", href: "/categories" },
];

export function Navbar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm",
        className,
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Skill<span className="text-primary">Bridge</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {PUBLIC_LINKS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Suspense fallback={<div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />}>
            <NavbarActions />
          </Suspense>
        </div>
      </div>
    </header>
  );
}