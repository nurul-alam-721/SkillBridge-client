"use client";

import { useEffect, useState } from "react";
import {
  Dialog, DialogContent,
  DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
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
        className="sm:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Complete Your Tutor Profile</DialogTitle>
          <DialogDescription>
            You need a tutor profile before you can accept students.
            Fill in your details below to get started.
          </DialogDescription>
        </DialogHeader>

        <TutorProfileForm
          profile={null}
          categories={categories}
          onSuccess={onCreated}
        />
      </DialogContent>
    </Dialog>
  );
}