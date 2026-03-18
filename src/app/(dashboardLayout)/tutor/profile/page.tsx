"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { tutorService, Category, TutorProfile } from "@/services/tutor.service";
import { userService, CurrentUser } from "@/services/user.service";
import { useTutorProfile } from "@/hooks/useTutorProfile";
import { CreateProfileDialog } from "@/components/modules/tutor/CreateProfileDialog";
import { TutorProfileView } from "@/components/modules/tutor/TutorProfileView";
import { TutorProfileEditView } from "@/components/modules/tutor/TutorProfileEditView";

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

export default function TutorProfilePage() {
  const { profile, loading, setProfile } = useTutorProfile();
  const [categories, setCategories] = useState<Category[]>([]);
  const [user,       setUser]       = useState<CurrentUser | null>(null);
  const [editing,    setEditing]    = useState(false);

  useEffect(() => {
    tutorService.getCategories().then(setCategories).catch(() => {});
    userService.getMe().then(setUser).catch(() => {});
  }, []);

  if (loading) return <ProfileSkeleton />;

  if (!profile) {
    return (
      <CreateProfileDialog
        open={true}
        onCreated={() => window.location.reload()}
      />
    );
  }

  const handlePersonalInfoSaved = (updated: CurrentUser) => {
    setUser(updated);
    setProfile((prev: TutorProfile | null) =>
      prev
        ? {
            ...prev,
            user: {
              ...prev.user,
              name:  updated.name,
              image: updated.image,
              phone: updated.phone,
            },
          }
        : prev
    );
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:py-6 px-4 lg:px-6 max-w-2xl">
      {!editing ? (
        <TutorProfileView
          profile={profile}
          onEdit={() => setEditing(true)}
        />
      ) : (
        <TutorProfileEditView
          profile={profile}
          categories={categories}
          user={user ?? {
            id:            profile.userId,
            name:          profile.user.name,
            email:         profile.user.email ?? "",
            phone:         profile.user.phone ?? null,
            image:         profile.user.image ?? null,
            role:          "TUTOR",
            status:        "ACTIVE",
            emailVerified: true,
            createdAt:     "",
            updatedAt:     "",
          } as CurrentUser}
          onPersonalInfoSaved={handlePersonalInfoSaved}
          onSuccess={(updated) => {
            setProfile(updated);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      )}
    </div>
  );
}