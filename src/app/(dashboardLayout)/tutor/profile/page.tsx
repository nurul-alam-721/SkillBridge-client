"use client";

import { useEffect, useState } from "react";
import { Star, Clock, Mail, Phone, Pencil, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <CardContent className="pt-5 flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileView({
  profile,
  onEdit,
}: {
  profile: TutorProfile;
  onEdit: () => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Tutor Profile</CardTitle>
        <Button size="sm" variant="outline" className="rounded-xl gap-1.5" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Avatar + name */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-16 w-16 text-2xl shrink-0">
            <AvatarImage src={profile.user.image ?? undefined} />
            <AvatarFallback>
              {(profile.user.name ?? "T").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-lg font-bold">{profile.user.name}</h2>
              <Badge variant="secondary">{profile.category.name}</Badge>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {profile.rating.toFixed(1)} · {profile.totalReviews} review{profile.totalReviews !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {profile.experience} year{profile.experience !== 1 ? "s" : ""} experience
              </span>
              <span className="font-medium text-foreground">
                BDT {profile.hourlyRate}/hr
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
              {profile.user.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {profile.user.email}
                </span>
              )}
              {profile.user.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {profile.user.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                Bio
              </p>
              <p className="text-sm leading-relaxed">{profile.bio}</p>
            </div>
          </>
        )}

        {/* Stats row */}
        <Separator />
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold tabular-nums">{profile.totalReviews}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Reviews</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">{profile.experience}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Year Experience</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">BDT {profile.hourlyRate}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Per Hour</p>
          </div>
        </div>
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
    <div className="flex flex-col gap-6 py-4 md:py-6 px-4 lg:px-6 max-w-2xl">
      {!editing ? (
        <ProfileView profile={profile} onEdit={() => setEditing(true)} />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Editing Profile
            </h2>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-xl gap-1.5 text-muted-foreground"
              onClick={() => setEditing(false)}
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
          </div>
          <TutorProfileForm
            profile={profile}
            categories={categories}
            onSuccess={(updated) => {
              setProfile(updated);
              setEditing(false); 
            }}
          />
        </div>
      )}
    </div>
  );
}