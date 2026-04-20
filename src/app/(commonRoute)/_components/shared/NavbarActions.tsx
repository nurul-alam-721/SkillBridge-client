"use client";

import Link from "next/link";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  UserCircle,
  Users,
  BookMarked,
  Tag,
  Clock,
  Receipt,
  WalletCards,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types";
import { Roles } from "@/constant/Roles";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/signOut";
import { useMounted } from "@/hooks/useMounted";

const PUBLIC_LINKS = [
  { title: "Home", href: "/" },
  { title: "Tutors", href: "/tutors" },
  { title: "Categories", href: "/categories" },
];

const DASHBOARD_LINKS: Record<
  string,
  { label: string; href: string; icon: React.ElementType }[]
> = {
  [Roles.student]: [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Profile", href: "/student/profile", icon: UserCircle },
    { label: "My Bookings", href: "/student/bookings", icon: CalendarDays },
    {
      label: "Payment History",
      href: "/student/payments/history",
      icon: Receipt,
    },
  ],
  [Roles.tutor]: [
    { label: "Dashboard", href: "/tutor/dashboard", icon: LayoutDashboard },
    { label: "Availability", href: "/tutor/availability", icon: Clock },
    { label: "Profile", href: "/tutor/profile", icon: UserCircle },
    { label: "Earnings", href: "/tutor/payments/earnings", icon: WalletCards },
  ],
  [Roles.admin]: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Bookings", href: "/admin/bookings", icon: BookMarked },
    { label: "Categories", href: "/admin/categories", icon: Tag },
    { label: "Payments", href: "/admin/payments", icon: Receipt },
  ],
};

const ROLE_LABELS: Record<string, string> = {
  [Roles.student]: "Student",
  [Roles.tutor]: "Tutor",
  [Roles.admin]: "Admin",
};

const ROLE_BADGE_COLORS: Record<string, string> = {
  [Roles.student]:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  [Roles.tutor]:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  [Roles.admin]:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
};

export function NavbarActions() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const mounted = useMounted();

  const user = session?.user as User | undefined;
  const role = user?.role as string | undefined;
  const dashLinks = role ? (DASHBOARD_LINKS[role] ?? []) : [];

  if (!mounted || isPending) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!user && (
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="rounded-lg">
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" asChild className="rounded-lg">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      )}

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden md:flex items-center gap-2 rounded-xl border bg-card px-2 py-1.5 text-sm hover:bg-muted">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                  {(user.name ?? "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="max-w-24 truncate font-medium">{user.name}</span>
              {role && (
                <span
                  className={cn(
                    "hidden lg:inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                    ROLE_BADGE_COLORS[role],
                  )}
                >
                  {ROLE_LABELS[role]}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52 rounded-xl">
            <DropdownMenuLabel>
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {dashLinks.map(({ label, href, icon: Icon }) => (
              <DropdownMenuItem key={href} asChild>
                <Link href={href} className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  {label}
                </Link>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={signOut}
              className="flex items-center gap-2 text-destructive cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-72 flex flex-col">
          <SheetHeader>
            <SheetTitle>SkillBridge</SheetTitle>
          </SheetHeader>

          <div className="mt-6 flex flex-col gap-1 flex-1">
            {PUBLIC_LINKS.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm",
                  pathname === item.href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.title}
              </Link>
            ))}

            <div className="mt-auto pt-4 border-t flex flex-col gap-2">
              {user ? (
                <Button onClick={signOut}>Logout</Button>
              ) : (
                <>
                  <Button asChild variant="outline">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
