import { authClient } from "@/lib/auth-client";

export async function signOut() {
  await authClient.signOut();
  document.cookie = "user-role=; path=/; max-age=0; SameSite=None; Secure";
  document.cookie = "better-auth.session_token=; path=/; max-age=0; SameSite=None; Secure";
  window.location.href = "/";
}