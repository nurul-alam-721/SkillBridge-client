"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, GraduationCap, LayoutDashboard, LogOut,
  CalendarDays, UserCircle, Users, BookMarked, Tag, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "./ModeToggle";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types/types";
import { Roles } from "@/constant/Roles";
import { useMounted } from "@/hooks/userMounted";


const PUBLIC_LINKS = [
  { title: "Home",       href: "/"           },
  { title: "Tutors",     href: "/tutors"     },
  { title: "Categories", href: "/categories" },
];


const DASHBOARD_LINKS: Record<
  string,
  { label: string; href: string; icon: React.ElementType }[]
> = {
  [Roles.student]: [
    { label: "Dashboard",   href: "/dashboard",          icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays    },
    { label: "Profile",     href: "/dashboard/profile",  icon: UserCircle      },
  ],
  [Roles.tutor]: [
    { label: "Dashboard",    href: "/tutor/dashboard",    icon: LayoutDashboard },
    { label: "Availability", href: "/tutor/availability", icon: Clock           },
    { label: "Profile",      href: "/tutor/profile",      icon: UserCircle      },
  ],
  [Roles.admin]: [
    { label: "Dashboard",  href: "/admin",            icon: LayoutDashboard },
    { label: "Users",      href: "/admin/users",      icon: Users           },
    { label: "Bookings",   href: "/admin/bookings",   icon: BookMarked      },
    { label: "Categories", href: "/admin/categories", icon: Tag             },
  ],
};

const ROLE_LABELS: Record<string, string> = {
  [Roles.student]: "Student",
  [Roles.tutor]:   "Tutor",
  [Roles.admin]:   "Admin",
};

const ROLE_BADGE_COLORS: Record<string, string> = {
  [Roles.student]: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  [Roles.tutor]:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  [Roles.admin]:   "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
};


export function Navbar({ className }: { className?: string }) {
  const mounted  = useMounted();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as User | undefined;
  const role = user?.role as string | undefined;

  const dashLinks = role ? (DASHBOARD_LINKS[role] ?? []) : [];

  const handleLogout = async () => {
    await authClient.signOut();
    document.cookie = "user-role=; path=/; max-age=0";
    window.location.href = "/";
  };

  return (
    <header className={cn("sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm", className)}>
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

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {PUBLIC_LINKS.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                      pathname === item.href ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {mounted && <ModeToggle />}

          {/* Skeleton while loading */}
          {isPending && (
            <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
          )}

          {/* Guest buttons */}
          {!isPending && !user && (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="rounded-lg">
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild className="rounded-lg">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}

          {!isPending && user && mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:flex items-center gap-2 rounded-xl border bg-card px-2 py-1.5 text-sm transition-colors hover:bg-muted focus:outline-none">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.image ?? undefined} />
                    <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                      {(user.name ?? "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-24 truncate font-medium">{user.name}</span>
                  {role && (
                    <span className={cn(
                      "hidden lg:inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                      ROLE_BADGE_COLORS[role]
                    )}>
                      {ROLE_LABELS[role]}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52 rounded-xl">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {dashLinks.map(({ label, href, icon: Icon }) => (
                  <DropdownMenuItem key={href} asChild>
                    <Link href={href} className="gap-2 cursor-pointer">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      {label}
                    </Link>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile sheet */}
          {mounted && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 rounded-lg">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-72 flex flex-col">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                      <GraduationCap className="h-4 w-4 text-primary-foreground" />
                    </div>
                    SkillBridge
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-1 flex-1">

                  {/* Public links */}
                  <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Navigation
                  </p>
                  {PUBLIC_LINKS.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                        pathname === item.href ? "bg-muted text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}

                  {user && dashLinks.length > 0 && (
                    <>
                      <div className="my-3 h-px bg-border" />
                      <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {ROLE_LABELS[role!]} Menu
                      </p>
                      {dashLinks.map(({ label, href, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                            pathname === href ? "bg-muted text-foreground" : "text-muted-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {label}
                        </Link>
                      ))}
                    </>
                  )}

                  {/* Bottom auth block */}
                  <div className="mt-auto pt-4 flex flex-col gap-2 border-t">
                    {user ? (
                      <>
                        <div className="flex items-center gap-2.5 rounded-lg bg-muted px-3 py-2.5">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.image ?? undefined} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {(user.name ?? "U").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold truncate">{user.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                          </div>
                          {role && (
                            <span className={cn(
                              "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                              ROLE_BADGE_COLORS[role]
                            )}>
                              {ROLE_LABELS[role]}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleLogout}
                          className="rounded-lg gap-2 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Log out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" asChild className="rounded-lg">
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button size="sm" asChild className="rounded-lg">
                          <Link href="/register">Get Started</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}