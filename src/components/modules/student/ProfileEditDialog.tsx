import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

import { userService, CurrentUser } from "@/services/user.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function EditProfileDialog({
  open,
  user,
  onClose,
  onUpdated,
}: {
  open: boolean;
  user: CurrentUser;
  onClose: () => void;
  onUpdated: (u: CurrentUser) => void;
}) {
  const form = useForm({
    defaultValues: {
      name:  user.name  ?? "",
      phone: user.phone ?? "",
      image: user.image ?? "",
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Saving...");
      try {
        const updated = await userService.updateMyProfile({
          name:  value.name  || undefined,
          phone: value.phone || undefined,
          image: value.image || undefined,
        });
        onUpdated(updated);
        toast.success("Profile updated!", { id: toastId });
        onClose();
      } catch {
        toast.error("Failed to update profile.", { id: toastId });
      }
    },
  });

  const submitting = form.state.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your name, phone number, and avatar.
          </DialogDescription>
        </DialogHeader>

        {/* Avatar preview */}
        <div className="flex items-center gap-4 py-1">
          <Avatar className="h-16 w-16 text-xl shrink-0">
            <AvatarImage src={form.state.values.image || undefined} />
            <AvatarFallback>
              {(form.state.values.name || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your avatar updates live as you type a URL below.
          </p>
        </div>

        <Separator />

        <form
          className="space-y-4"
          onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
        >
          {/* Name */}
          <form.Field name="name">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Your full name"
                  className="rounded-xl"
                  disabled={submitting}
                />
              </div>
            )}
          </form.Field>

          {/* Phone */}
          <form.Field name="phone">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="+8801XXXXXXXXX"
                  className="rounded-xl"
                  disabled={submitting}
                />
              </div>
            )}
          </form.Field>

          {/* Avatar URL */}
          <form.Field name="image">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="edit-image">Avatar URL</Label>
                <Input
                  id="edit-image"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="https://example.com/photo.jpg"
                  className="rounded-xl"
                  disabled={submitting}
                />
              </div>
            )}
          </form.Field>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl gap-2" disabled={submitting}>
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
