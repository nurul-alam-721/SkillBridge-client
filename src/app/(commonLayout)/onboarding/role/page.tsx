"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { userService } from "@/services/user.service";
import { Roles } from "@/constant/Roles";
import { UserRole } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function OnboardingRolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleRoleClick = (role: UserRole) => {
    setSelected(role);
    if (role === (Roles.tutor as UserRole)) {
      setShowConfirmDialog(true);
    } else {
      void handleSubmit(role);
    }
  };

  const handleSubmit = async (role: UserRole) => {
    setLoading(true);
    setShowConfirmDialog(false);

    try {
      await userService.updateMyRole(role);

      document.cookie = `user-role=${role}; path=/; max-age=604800; SameSite=None; Secure`;

      toast.success("Welcome to SkillBridge!");

      if (role === (Roles.tutor as UserRole)) {
        window.location.href = "/tutor/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Join as a Student or Tutor?
          </h1>
          
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleRoleClick(Roles.student as UserRole)}
            disabled={loading}
            className={`rounded-2xl border-2 p-6 text-left transition-all disabled:opacity-50 ${
              selected === Roles.student
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="mb-3 text-3xl">🎓</div>
            <div className="font-semibold">I am a Student</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Find tutors and book sessions
            </p>
          </button>

          <button
            onClick={() => handleRoleClick(Roles.tutor as UserRole)}
            disabled={loading}
            className={`rounded-2xl border-2 p-6 text-left transition-all disabled:opacity-50 ${
              selected === Roles.tutor
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="mb-3 text-3xl">👨‍🏫</div>
            <div className="font-semibold">I am a Tutor</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Teach students and earn money
            </p>
          </button>
        </div>

        {loading && (
          <div className="mt-6 h-11 w-full rounded-xl bg-primary/50 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-foreground">
              Saving...
            </span>
          </div>
        )}
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Joining as a Tutor?</DialogTitle>
            <DialogDescription className="pt-1">
              As a tutor you will be able to create a profile, set your
              availability, and accept bookings from students.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground space-y-1">
            <p>✅ Create your tutor profile</p>
            <p>✅ Set hourly rate and availability</p>
            <p>✅ Accept and manage bookings</p>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => {
                setShowConfirmDialog(false);
                setSelected(null);
              }}
              className="flex-1 h-10 rounded-xl border font-medium text-sm hover:bg-muted transition-colors"
            >
              Go back
            </button>
            <button
              onClick={() => handleSubmit(Roles.tutor as UserRole)}
              disabled={loading}
              className="flex-1 h-10 rounded-xl bg-primary font-semibold text-sm text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Yes, join as Tutor"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}