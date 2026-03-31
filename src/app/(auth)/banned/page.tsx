"use client";

import { ShieldBan, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/signOut";

export default function BannedPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
            <ShieldBan className="h-10 w-10 text-rose-600 dark:text-rose-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Account Suspended
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your account has been suspended due to a violation of our terms of
            service. If you believe this is a mistake, please contact our
            support team.
          </p>
        </div>

        <div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">
          If you need help, email us at{" "}
          <a
            href="mailto:support@skillbridge.com"
            className="font-semibold underline underline-offset-2"
          >
            support@skillbridge.com
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            className="gap-2 rounded-xl"
            onClick={() =>
              (window.location.href = "mailto:support@skillbridge.com")
            }
          >
            <Mail className="h-4 w-4" />
            Contact Support
          </Button>
          <Button
            variant="destructive"
            className="rounded-xl"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}