"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface ImageUploadProps {
  value:     string;
  onChange:  (url: string) => void;
  fallback?: string;
  disabled?: boolean;
}

async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary env vars are not set");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form }
  );

  if (!res.ok) throw new Error("Upload failed");

  const json = await res.json();
  return json.secure_url as string;
}

export function ImageUpload({
  value,
  onChange,
  fallback = "U",
  disabled = false,
}: ImageUploadProps) {
  const inputRef        = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }

    setBusy(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
      toast.success("Image uploaded.");
    } catch {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Preview */}
      <div className="relative shrink-0">
        <Avatar className="h-16 w-16">
          <AvatarImage src={value || undefined} />
          <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
            {fallback.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {value && !disabled && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white shadow-sm hover:bg-destructive/90 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Drop zone */}
      <div
        className={`flex-1 rounded-xl border-2 border-dashed border-border/60 bg-muted/30 transition-colors ${
          !disabled
            ? "hover:border-primary/40 hover:bg-muted/50 cursor-pointer"
            : "opacity-50 cursor-not-allowed"
        }`}
        onClick={() => !disabled && !busy && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={!disabled ? handleDrop : undefined}
      >
        <div className="flex flex-col items-center justify-center gap-1.5 py-4 px-3 text-center">
          {busy ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Uploading…</p>
            </>
          ) : (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border border-border/60">
                {value
                  ? <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  : <Upload   className="h-4 w-4 text-muted-foreground" />
                }
              </div>
              <p className="text-xs font-medium">
                {value ? "Replace image" : "Upload image"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                PNG, JPG, WEBP · max 5 MB
              </p>
            </>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled || busy}
      />
    </div>
  );
}