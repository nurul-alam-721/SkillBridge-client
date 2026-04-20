"use client";
import { Category } from "@/types";

import { useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";


interface DeleteCategoryDialogProps {
  category: Category | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function DeleteCategoryDialog({ category, onClose, onConfirm }: DeleteCategoryDialogProps) {
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    if (!category) return;
    setBusy(true);
    await onConfirm(category.id);
    setBusy(false);
    onClose();
  };

  const tutorCount = category?._count?.tutors ?? 0;

  return (
    <Dialog open={!!category} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TriangleAlert className="h-4 w-4 text-destructive" />
            Delete Category
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-3">
          <p className="text-sm">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{category?.name}</span>?
          </p>
          {tutorCount > 0 && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5 text-xs text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">
              ⚠️ {tutorCount} tutor{tutorCount !== 1 ? "s are" : " is"} assigned to this category. Deleting it will affect their profiles.
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" className="rounded-xl" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button variant="destructive" className="rounded-xl gap-2" onClick={handleConfirm} disabled={busy}>
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}