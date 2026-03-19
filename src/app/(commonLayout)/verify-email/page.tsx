"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type Status = "verifying" | "success" | "error" | "missing";

export default function VerifyEmailPage() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const token       = searchParams.get("token");

  const [status,  setStatus]  = useState<Status>(token ? "verifying" : "missing");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const res = await authClient.verifyEmail({ query: { token } });
        if (res.error) {
          setStatus("error");
          setMessage(res.error.message ?? "Verification failed.");
        } else {
          setStatus("success");
          setTimeout(() => router.replace("/login"), 3000);
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center space-y-5">

        {status === "verifying" && (
          <>
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">Verifying your email…</h1>
              <p className="text-sm text-muted-foreground mt-1">Please wait a moment.</p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/20">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">Email verified!</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your account is now active. Redirecting to login…
              </p>
            </div>
            <Button asChild className="rounded-xl w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">Verification failed</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {message || "This link may have expired or already been used."}
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-xl w-full">
              <Link href="/login">Back to Login</Link>
            </Button>
          </>
        )}

        {status === "missing" && (
          <>
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Mail className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">Check your inbox</h1>
              <p className="text-sm text-muted-foreground mt-1">
                We sent a verification link to your email. Click it to activate your account.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-xl w-full">
              <Link href="/login">Back to Login</Link>
            </Button>
          </>
        )}

      </div>
    </div>
  );
}