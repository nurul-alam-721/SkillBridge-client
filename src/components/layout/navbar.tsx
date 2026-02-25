"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { ModeToggle } from "./ModeToggle";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types/user";
import { Roles } from "@/constant/roles";

interface NavbarProps {
  className?: string;
}

const MENU_ITEMS = [
  { title: "Home", href: "/" },
  { title: "Tutors", href: "/tutors" },
  { title: "Categories", href: "/categories" },
  { title: "About", href: "/about" },
];

export function Navbar({ className }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await authClient.getSession();
        const u = session?.data?.user as User | undefined;
        setUser(u ?? null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    setUser(null);
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case Roles.admin:
        return "/admin/dashboard";
      case Roles.tutor:
        return "/tutor/dashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <header className={cn("border-b bg-background", className)}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Skill<span className="text-primary">Bridge</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {MENU_ITEMS.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    {item.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          <ModeToggle />

          {!loading &&
            (user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href={getDashboardLink()}>Dashboard</Link>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </>
            ))}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-4">
                {MENU_ITEMS.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                ))}

                {!loading &&
                  (user ? (
                    <>
                      <Link href={getDashboardLink()}>Dashboard</Link>
                      <Button variant="outline" onClick={handleLogout}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">Login</Link>
                      <Link href="/register">Register</Link>
                    </>
                  ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}