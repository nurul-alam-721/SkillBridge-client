"use client";

import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import {
  Dialog, DialogContent,
  DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { tutorService, TutorProfile, Category } from "@/services/tutor.service";
import { TutorProfileForm } from "./TutorProfileForm";

interface CreateProfileDialogProps {
  open: boolean;
  onCreated: (profile: TutorProfile) => void;
}

export function CreateProfileDialog({ open, onCreated }: CreateProfileDialogProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    tutorService.getCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold leading-tight">
                Complete Your Tutor Profile
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Required before you can accept students
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <TutorProfileForm
          profile={null}
          categories={categories}
          onSuccess={onCreated}
        />
      </DialogContent>
    </Dialog>
  );
}