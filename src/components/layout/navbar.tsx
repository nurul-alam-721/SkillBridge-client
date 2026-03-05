import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "./ModeToggle";
import { NavbarActions } from "../modules/home/NevbarActions";

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
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Skill<span className="text-primary">Bridge</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {PUBLIC_LINKS.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <NavbarActions />
        </div>
      </div>
    </header>
  );
}
