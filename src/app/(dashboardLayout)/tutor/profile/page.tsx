"use client";

import { useEffect, useState } from "react";
import {
  Star, Clock, Mail, Phone,
  Pencil, X, GraduationCap,
} from "lucide-react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { tutorService, Category, TutorProfile } from "@/services/tutor.service";
import { useTutorProfile } from "@/hooks/useTutorProfile";
import { CreateProfileDialog } from "@/components/modules/tutor/CreateProfileDialog";
import { TutorProfileForm } from "@/components/modules/tutor/TutorProfileForm";


function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6 px-4 lg:px-6 max-w-2xl">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


function ProfileView({ profile, onEdit }: { profile: TutorProfile; onEdit: () => void }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-sm font-semibold">Tutor Profile</CardTitle>
        </div>
        <Button
          size="sm" variant="outline"
          className="h-8 rounded-lg gap-1.5 text-xs"
          onClick={onEdit}
        >
          <Pencil className="h-3 w-3" />
          Edit Profile
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Identity */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-14 w-14 shrink-0">
            <AvatarImage src={profile.user.image ?? undefined} />
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
              {(profile.user.name ?? "T").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h2 className="text-base font-bold leading-none">{profile.user.name}</h2>
              <Badge variant="secondary" className="text-xs">
                {profile.category.name}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {profile.rating.toFixed(1)}
                <span className="text-muted-foreground/60">·</span>
                {profile.totalReviews} review{profile.totalReviews !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {profile.experience} yr{profile.experience !== 1 ? "s" : ""} experience
              </span>
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                BDT {profile.hourlyRate}/hr
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1.5">
              {profile.user.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3" />
                  {profile.user.email}
                </span>
              )}
              {profile.user.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3" />
                  {profile.user.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && profile.bio !== "No bio provided" && (
          <>
            <Separator />
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                About
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {profile.bio}
              </p>
            </div>
          </>
        )}

        {/* Stats */}
        <Separator />
        <div className="grid grid-cols-3 divide-x divide-border text-center">
          <div className="pr-4 space-y-0.5">
            <p className="text-xl font-bold tabular-nums">{profile.totalReviews}</p>
            <p className="text-[11px] text-muted-foreground">Reviews</p>
          </div>
          <div className="px-4 space-y-0.5">
            <p className="text-xl font-bold tabular-nums">{profile.experience}</p>
            <p className="text-[11px] text-muted-foreground">Yrs Exp</p>
          </div>
          <div className="pl-4 space-y-0.5">
            <p className="text-xl font-bold tabular-nums">{profile.hourlyRate}</p>
            <p className="text-[11px] text-muted-foreground">BDT/hr</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


function EditView({
  profile,
  categories,
  onSuccess,
  onCancel,
}: {
  profile: TutorProfile;
  categories: Category[];
  onSuccess: (p: TutorProfile) => void;
  onCancel: () => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Pencil className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold">Edit Profile</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update your public tutor information
            </p>
          </div>
        </div>
        <Button
          size="sm" variant="ghost"
          className="h-8 rounded-lg gap-1.5 text-xs text-muted-foreground"
          onClick={onCancel}
        >
          <X className="h-3 w-3" />
          Cancel
        </Button>
      </CardHeader>

      <Separator />

      <CardContent className="pt-5">
        <TutorProfileForm
          profile={profile}
          categories={categories}
          onSuccess={onSuccess}
        />
      </CardContent>
    </Card>
  );
}


export default function TutorProfilePage() {
  const { profile, loading, setProfile } = useTutorProfile();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    tutorService.getCategories().then(setCategories).catch(() => {});
  }, []);

  if (loading) return <ProfileSkeleton />;

  if (!profile) {
    return (
      <CreateProfileDialog
        open={true}
        onCreated={(p) => setProfile(p)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:py-6 px-4 lg:px-6 max-w-2xl">
      {!editing ? (
        <ProfileView profile={profile} onEdit={() => setEditing(true)} />
      ) : (
        <EditView
          profile={profile}
          categories={categories}
          onSuccess={(updated) => { setProfile(updated); setEditing(false); }}
          onCancel={() => setEditing(false)}
        />
      )}
    </div>
  );
}