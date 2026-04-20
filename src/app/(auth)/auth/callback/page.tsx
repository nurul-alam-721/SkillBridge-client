"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types";

const getSessionWithRetry = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    const session = await authClient.getSession({
      fetchOptions: { cache: "no-store" },
    });
    if (session?.data?.user) return session;
    await new Promise((res) => setTimeout(res, 300));
  }
  return null;
};

const isNewGoogleUser = (user: User): boolean => {
  const ageMs = Date.now() - new Date(user.createdAt).getTime();
  return ageMs < 60 * 1000;
};

export default function AuthCallbackPage() {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const run = async () => {
      try {
        const session = await getSessionWithRetry();
        const user = session?.data?.user as User | undefined;

        if (!user) {
          router.replace("/login");
          return;
        }

        document.cookie = `user-role=${user.role}; path=/; max-age=604800; SameSite=Lax`;

        if (isNewGoogleUser(user)) {
          router.replace("/onboarding/role");
          return;
        }

        if (user.role === "TUTOR") {
          window.location.href = "/tutor/dashboard";
        } else if (user.role === "ADMIN") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/student/dashboard";
        }
      } catch (err) {
        console.error(err);
        router.replace("/login");
      }
    };

    run();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">Signing you in…</span>
    </div>
  );
}