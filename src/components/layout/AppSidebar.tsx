"use client";
import { CurrentUser } from "@/types";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMounted } from "@/hooks/useMounted";
import {
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  Users,
  BookMarked,
  Tag,
  UserCircle,
  Clock,
  GraduationCap,
  Receipt,
  WalletCards,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Separator } from "../ui/separator";

const SidebarUserFooter = dynamic(
  () =>
    import("@/components/layout/SidebarUserFooter").then(
      (m) => m.SidebarUserFooter,
    ),
  { ssr: false },
);

const NAV: Record<
  string,
  { title: string; href: string; icon: React.ElementType }[]
> = {
  STUDENT: [
    { title: "Overview", href: "/student/dashboard", icon: LayoutDashboard },
    { title: "Bookings", href: "/student/bookings", icon: CalendarDays },
    { title: "Profile", href: "/student/profile", icon: UserCircle },
    {
      title: "Payment History",
      href: "/student/payments/history",
      icon: Receipt,
    },
  ],
  TUTOR: [
    { title: "Overview", href: "/tutor/dashboard", icon: LayoutDashboard },
    { title: "Availability Slots", href: "/tutor/availability", icon: Clock },
    { title: "Profile", href: "/tutor/profile", icon: UserCircle },
    { title: "Earnings", href: "/tutor/payments/earnings", icon: WalletCards },
  ],
  ADMIN: [
    { title: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Bookings", href: "/admin/bookings", icon: BookMarked },
    { title: "Categories", href: "/admin/categories", icon: Tag },
    { title: "Payments", href: "/admin/payments", icon: Receipt },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: CurrentUser }) {
  const pathname = usePathname();
  const mounted = useMounted();
  const navItems = NAV[user.role] ?? NAV.STUDENT;

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Brand */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">SkillBridge</span>
                  <span className="truncate text-xs text-muted-foreground capitalize">
                    {user.role.toLowerCase()} panel
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={mounted && pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Browse Tutors">
                  <Link href="/tutors">
                    <BookOpen />
                    <span>Browse Tutors</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarUserFooter user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
