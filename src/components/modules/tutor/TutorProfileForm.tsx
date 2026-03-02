"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export function TutorProfileForm({
  profile,
  categories,
  onSuccess,
}: TutorProfileFormProps) {
  const isEdit = profile !== null;

  const form = useForm({
    defaultValues: {
      bio: profile?.bio ?? "",
      hourlyRate: profile?.hourlyRate?.toString() ?? "",
      experience: profile?.experience?.toString() ?? "",
      categoryId: profile?.categoryId ?? "",
    },
    onSubmit: async ({ value }) => {
      if (!value.categoryId) {
        toast.error("Please select a category.");
        return;
      }
      if (!value.hourlyRate || isNaN(Number(value.hourlyRate))) {
        toast.error("Enter a valid hourly rate.");
        return;
      }
      if (!value.experience || isNaN(Number(value.experience))) {
        toast.error("Enter valid years of experience.");
        return;
      }

      const payload = {
        bio: value.bio || undefined,
        hourlyRate: Number(value.hourlyRate),
        experience: Number(value.experience),
        categoryId: value.categoryId,
      };

      const toastId = toast.loading(
        isEdit ? "Saving changes..." : "Creating profile...",
      );
      try {
        const result = isEdit
          ? await tutorService.updateProfile(payload)
          : await tutorService.createProfile(payload);
        onSuccess(result);
        toast.success(
          isEdit ? "Profile updated!" : "Profile created successfully!",
          { id: toastId },
        );
      } catch {
        toast.error(
          isEdit ? "Failed to update profile." : "Failed to create profile.",
          { id: toastId },
        );
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {isEdit ? "Edit Tutor Profile" : "Create Your Tutor Profile"}
        </CardTitle>
        <CardDescription>
          {isEdit
            ? "Update your bio, hourly rate, experience and category."
            : "Fill in your details to start accepting students."}
        </CardDescription>
      </CardHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <CardContent className="space-y-4">
          {/* Category */}
          <form.Field name="categoryId">
            {(field) => (
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="hourlyRate">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Hourly Rate (BDT)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="e.g. 30"
                    className="rounded-xl"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="experience">
              {(field) => (
                <div className="space-y-1.5">
                  <Label>Experience (years)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="e.g. 3"
                    className="rounded-xl"
                  />
                </div>
              )}
            </form.Field>
          </div>

          {/* Bio */}
          <form.Field name="bio">
            {(field) => (
              <div className="space-y-1.5">
                <Label>
                  Bio{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Tell students about yourself, your teaching style, expertise..."
                  className="rounded-xl min-h-[100px] resize-none"
                />
              </div>
            )}
          </form.Field>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="rounded-xl">
            {isEdit ? "Save Changes" : "Create Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
