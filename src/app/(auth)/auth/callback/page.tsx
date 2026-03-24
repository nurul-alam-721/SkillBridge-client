"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Roles } from "@/constant/Roles";

export default function AuthCallbackPage() {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const run = async () => {
      try {
        const { data: session } = await authClient.getSession();
        const user = session?.user as { role?: string } | undefined;

        if (!user?.role) {
          router.replace("/login");
          return;
        }

        document.cookie = `user-role=${user.role}; path=/; max-age=604800; SameSite=Lax; Secure`;

        const target =
          user.role === Roles.admin
            ? "/admin/dashboard"
            : user.role === Roles.tutor
            ? "/tutor/dashboard"
            : "/dashboard";

        router.replace(target);
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