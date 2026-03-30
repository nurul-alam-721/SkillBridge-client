"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { userService } from "@/services/user.service";
import { Roles } from "@/constant/Roles";
import { UserRole } from "@/types/types";

export default function OnboardingRolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<UserRole | null>(null);

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);

    try {
      await userService.updateMyRole(selected);

      document.cookie = `user-role=${selected}; path=/; max-age=604800; SameSite=Lax`;

      toast.success("Welcome to SkillBridge!");

      if (selected === Roles.tutor) {
        router.push("/tutor/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
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
          <p className="mt-2 text-sm text-muted-foreground">
            You can always change this later from your profile settings.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSelected(Roles.student as UserRole)}
            className={`rounded-2xl border-2 p-6 text-left transition-all ${
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
            onClick={() => setSelected(Roles.tutor as UserRole)}
            className={`rounded-2xl border-2 p-6 text-left transition-all ${
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

        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="mt-6 h-11 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
