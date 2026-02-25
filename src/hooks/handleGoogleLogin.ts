"use client";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";


export   const handleGoogleLogin = async () => {
    const toastId = toast.loading("Logging in with Google...");
    try {
    
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google login failed";
      toast.error(message, { id: toastId });
    }
  };