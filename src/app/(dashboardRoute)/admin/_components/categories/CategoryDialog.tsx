"use client";
import { Category, CategoryPayload } from "@/types";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";


interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CategoryPayload) => Promise<void>;
  initial?: Category | null;
}

export function CategoryDialog({ open, onClose, onSubmit, initial }: CategoryDialogProps) {
  const [name,        setName]        = useState("");
  const [description, setDescription] = useState("");
  const [busy,        setBusy]        = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setDescription(initial?.description ?? "");
      setError(null);
    }
  }, [open, initial]);

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Name is required."); return; }
    setBusy(true);
    setError(null);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() || undefined });
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const isEdit = !!initial;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "New Category"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the category name or description." : "Add a new subject category for tutors."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Name <span className="text-destructive">*</span></Label>
            <Input
              id="cat-name"
              placeholder="e.g. Mathematics"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(null); }}
              className="rounded-xl"
              disabled={busy}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-desc">Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Textarea
              id="cat-desc"
              placeholder="Brief description of this category…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl resize-none"
              rows={3}
              disabled={busy}
            />
          </div>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" className="rounded-xl" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button className="rounded-xl gap-2" onClick={handleSubmit} disabled={busy}>
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isEdit ? "Save Changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}