import { authClient } from "@/lib/auth-client";

export async function signOut() {
  await authClient.signOut();
  document.cookie = "user-role=; path=/; max-age=0; SameSite=Lax";
  window.location.href = "/";
}