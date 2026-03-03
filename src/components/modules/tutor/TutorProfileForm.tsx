"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tutorService, TutorProfile, Category } from "@/services/tutor.service";

interface TutorProfileFormProps {
  profile: TutorProfile | null;
  categories: Category[];
  onSuccess: (profile: TutorProfile) => void;
}

export function TutorProfileForm({ profile, categories, onSuccess }: TutorProfileFormProps) {
  const isEdit = profile !== null;

  const form = useForm({
    defaultValues: {
      bio:        profile?.bio        ?? "",
      hourlyRate: profile?.hourlyRate?.toString() ?? "",
      experience: profile?.experience?.toString() ?? "",
      categoryId: profile?.categoryId ?? "",
    },
    onSubmit: async ({ value }) => {
      if (!value.categoryId)                              { toast.error("Please select a category.");        return; }
      if (!value.hourlyRate || isNaN(Number(value.hourlyRate))) { toast.error("Enter a valid hourly rate."); return; }
      if (!value.experience || isNaN(Number(value.experience))) { toast.error("Enter years of experience."); return; }

      const payload = {
        bio:        value.bio || undefined,
        hourlyRate: Number(value.hourlyRate),
        experience: Number(value.experience),
        categoryId: value.categoryId,
      };

      const toastId = toast.loading(isEdit ? "Saving changes..." : "Creating profile...");
      try {
        const result = isEdit
          ? await tutorService.updateProfile(payload)
          : await tutorService.createProfile(payload);
        onSuccess(result);
        toast.success(isEdit ? "Profile updated!" : "Profile created successfully!", { id: toastId });
      } catch {
        toast.error(isEdit ? "Failed to update profile." : "Failed to create profile.", { id: toastId });
      }
    },
  });

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
      className="space-y-5"
    >
      {/* Category */}
      <form.Field name="categoryId">
        {(field) => (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Subject / Category</Label>
            <Select value={field.state.value} onValueChange={field.handleChange}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </form.Field>

      {/* Rate + Experience */}
      <div className="grid grid-cols-2 gap-4">
        <form.Field name="hourlyRate">
          {(field) => (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Hourly Rate (BDT)</Label>
              <Input
                type="number" min={1}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="e.g. 500"
                className="h-10 rounded-xl"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="experience">
          {(field) => (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Experience (years)</Label>
              <Input
                type="number" min={0}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="e.g. 3"
                className="h-10 rounded-xl"
              />
            </div>
          )}
        </form.Field>
      </div>

      {/* Bio */}
      <form.Field name="bio">
        {(field) => (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Bio</Label>
              <span className="text-xs text-muted-foreground">Optional</span>
            </div>
            <Textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Describe your teaching style, expertise, and what students can expect..."
              className="rounded-xl min-h-27.5 resize-none text-sm leading-relaxed"
            />
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" className="w-full h-10 rounded-xl font-medium" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Profile"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}