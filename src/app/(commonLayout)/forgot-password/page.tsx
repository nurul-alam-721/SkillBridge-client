"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email,     setEmail]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [error,     setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email."); return; }

    setLoading(true);
    setError("");
    try {
      const res = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (res.error) {
        setError(res.error.message ?? "Failed to send reset email.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">

        {/* Brand */}
        <div className="text-center">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Skill<span className="text-primary">Bridge</span>
          </Link>
        </div>

        {!sent ? (
          <div className="rounded-2xl border bg-card p-6 space-y-5"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
          >
            <div>
              <h1 className="text-lg font-bold">Forgot your password?</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="rounded-xl"
                  disabled={loading}
                />
              </div>

              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full rounded-xl gap-2"
                disabled={loading}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
            </form>

            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Login
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border bg-card p-6 text-center space-y-4"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
          >
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/20">
                <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold">Check your inbox</h1>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                We sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
                Check your spam folder if you don&apos;t see it.
              </p>
            </div>
            <Button asChild variant="outline" className="w-full rounded-xl">
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}