import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export const handleGoogleLogin = async () => {
  const toastId = toast.loading("Redirecting to Google...");

  const { error } = await authClient.signIn.social({
    provider: "google",
    callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/callback`,
  });

  if (error) {
    toast.error(error.message ?? "Google login failed", { id: toastId });
  }
};