"use client";
import { TutorProfile, Category } from "@/types";

import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import {
  Dialog, DialogContent,
  DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { tutorService } from "@/services/tutor.service";
import { TutorProfileForm } from "./TutorProfileForm";

interface CreateProfileDialogProps {
  open: boolean;
  onCreated: () => void;
}

export function CreateProfileDialog({ open, onCreated }: CreateProfileDialogProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    tutorService.getCategories().then(setCategories).catch(() => { });
  }, []);

  const handleSuccess = (_profile: TutorProfile) => {
    onCreated();
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md [&>button:last-child]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
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
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}