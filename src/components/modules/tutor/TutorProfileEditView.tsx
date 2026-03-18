"use client";

import { X, GraduationCap, User, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { TutorProfile, Category } from "@/services/tutor.service";
import { userService, CurrentUser } from "@/services/user.service";
import { TutorProfileForm } from "@/components/modules/tutor/TutorProfileForm";
import { ImageUpload } from "@/app/utils/ImageUpload";

function PersonalInfoForm({
  user,
  onSaved,
}: {
  user: CurrentUser;
  onSaved: (updated: CurrentUser) => void;
}) {
  const form = useForm({
    defaultValues: {
      name: user.name ?? "",
      phone: user.phone ?? "",
      image: user.image ?? "",
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Saving...");
      try {
        const updated = await userService.updateMyProfile({
          name: value.name || undefined,
          phone: value.phone || undefined,
          image: value.image || undefined,
        });
        onSaved(updated);
        toast.success("Personal info updated!", { id: toastId });
      } catch {
        toast.error("Failed to update personal info.", { id: toastId });
      }
    },
  });

  const submitting = form.state.isSubmitting;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <ImageUpload
        value={form.state.values.image}
        onChange={(url) => form.setFieldValue("image", url)}
        fallback={form.state.values.name || "T"}
        disabled={submitting}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="name">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="p-name">Full Name</Label>
              <Input
                id="p-name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Your full name"
                className="rounded-xl"
                disabled={submitting}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="phone">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="p-phone">Phone</Label>
              <Input
                id="p-phone"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="+8801XXXXXXXXX"
                className="rounded-xl"
                disabled={submitting}
              />
            </div>
          )}
        </form.Field>
      </div>

      <Button
        type="submit"
        size="sm"
        className="rounded-xl gap-2"
        disabled={submitting}
      >
        {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Save Personal Info
      </Button>
    </form>
  );
}

export function TutorProfileEditView({
  profile,
  categories,
  user,
  onPersonalInfoSaved,
  onSuccess,
  onCancel,
}: {
  profile: TutorProfile;
  categories: Category[];
  user: CurrentUser;
  onPersonalInfoSaved: (updated: CurrentUser) => void;
  onSuccess: (p: TutorProfile) => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Personal info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">
                Personal Info
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Name, phone and avatar
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 rounded-lg gap-1.5 text-xs text-muted-foreground"
            onClick={onCancel}
          >
            <X className="h-3 w-3" />
            Cancel
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <PersonalInfoForm user={user} onSaved={onPersonalInfoSaved} />
        </CardContent>
      </Card>

      {/* Tutor details */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">
                Tutor Details
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Bio, rate, experience and subject
              </p>
            </div>
          </div>
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
    </div>
  );
}
