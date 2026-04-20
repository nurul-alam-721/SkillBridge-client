"use client";
import { CurrentUser } from "@/types";

import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  ShieldCheck,
  CalendarDays,
  Pencil,
  User,
  BadgeCheck,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { userService } from "@/services/user.service";
import { EditProfileDialog } from "../_components/profile/ProfileEditDialog";

// Detail Row Component
function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium mt-0.5 break-all">{value}</p>
      </div>
    </div>
  );
}

// Skeleton while loading
function ProfileSkeleton() {
  return (
    <div className="px-4 lg:px-6 py-6 max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-24 w-24 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Separator />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Main Page
export default function StudentProfilePage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userService
      .getMe()
      .then(setUser)
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ProfileSkeleton />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>No profile found.</div>;

  return (
    <div className="px-4 lg:px-6 py-6 max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <Avatar className="h-24 w-24 text-3xl shrink-0 ring-4 ring-background shadow-md">
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback className="text-2xl font-bold">
            {(user.name ?? "U").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">
            {user.name ?? "—"}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {user.role.toLowerCase()}
            </Badge>
            {user.emailVerified ? (
              <Badge className="gap-1 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-800">
                <BadgeCheck className="h-3 w-3" /> Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 text-muted-foreground">
                Not verified
              </Badge>
            )}
            {user.status === "BANNED" && (
              <Badge variant="destructive">Banned</Badge>
            )}
          </div>
        </div>

        <Button
          size="sm"
          className="rounded-xl gap-1.5 shrink-0"
          onClick={() => setEditing(true)}
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit Profile
        </Button>
      </div>

      <Separator />

      {/* Details */}
      <div className="divide-y divide-border/60">
        <DetailRow icon={User} label="Full Name" value={user.name ?? "—"} />
        <DetailRow icon={Mail} label="Email" value={user.email} />
        <DetailRow
          icon={Phone}
          label="Phone"
          value={
            user.phone ?? (
              <span className="text-muted-foreground italic">Not provided</span>
            )
          }
        />
        <DetailRow
          icon={ShieldCheck}
          label="Email Verification"
          value={user.emailVerified ? "Verified" : "Not verified"}
        />
        <DetailRow
          icon={Clock}
          label="Member Since"
          value={
            user.createdAt
              ? format(new Date(user.createdAt), "MMMM d, yyyy")
              : "—"
          }
        />
        <DetailRow
          icon={CalendarDays}
          label="Last Updated"
          value={
            user.updatedAt
              ? format(new Date(user.updatedAt), "MMMM d, yyyy")
              : "—"
          }
        />
      </div>

      {/* Edit Dialog */}
      {editing && (
        <EditProfileDialog
          open={editing}
          user={user}
          onClose={() => setEditing(false)}
          onUpdated={(updated) => {
            setUser(updated);
            setEditing(false);
          }}
        />
      )}
    </div>
  );
}