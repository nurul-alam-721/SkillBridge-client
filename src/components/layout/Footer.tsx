"use client";

import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Twitter,
  Github,
  Linkedin,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types";
import { Roles } from "@/constant/Roles";
import { useMounted } from "@/hooks/useMounted";

const PUBLIC_LINKS = [
  { label: "Browse Tutors", href: "/tutors" },
  { label: "Categories", href: "/categories" },
];

const ROLE_LINKS: Record<
  string,
  { title: string; links: { label: string; href: string }[] }
> = {
  [Roles.student]: {
    title: "My Account",
    links: [
      { label: "Dashboard", href: "/student/dashboard" },
      { label: "My Bookings", href: "/student/bookings" },
      { label: "Profile", href: "/student/profile" },
      {
        label: "Payment History",
        href: "/student/payments/history"
      },
    ],
  },
  [Roles.tutor]: {
    title: "Tutor Portal",
    links: [
      { label: "Dashboard", href: "/tutor/dashboard" },
      { label: "Availability Slots", href: "/tutor/availability" },
      { label: "Profile", href: "/tutor/profile" },
      {
        label: "Earnings",
        href: "/tutor/payments/earnings"
      },
    ],
  },
  [Roles.admin]: {
    title: "Admin",
    links: [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Users", href: "/admin/users" },
      { label: "Bookings", href: "/admin/bookings" },
      { label: "Categories", href: "/admin/categories" },
      { label: "Payments", href: "/admin/payments"},
    ],
  },
};

const GUEST_LINKS = {
  title: "Account",
  links: [
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
    { label: "Register as Tutor", href: "/register" },
  ],
};

const SOCIAL_LINKS = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
];

export function Footer() {
  const { data: session } = authClient.useSession();
  const user = session?.user as User | undefined;
  const role = user?.role as string | undefined;

  const mounted = useMounted();

  const accountColumn = !mounted
    ? GUEST_LINKS
    : role
      ? ROLE_LINKS[role]
      : GUEST_LINKS;

  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Skill<span className="text-primary">Bridge</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Connecting learners with expert tutors. Find the perfect match for
              any subject and start learning today.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Platform — always visible */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Platform
            </p>
            <ul className="space-y-2">
              {PUBLIC_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {accountColumn && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
                {accountColumn.title}
              </p>
              <ul className="space-y-2">
                {accountColumn.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Support — always visible */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Support
            </p>
            <ul className="space-y-2">
              {[
                { label: "Contact Us", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Use", href: "#" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* ── Bottom bar ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
