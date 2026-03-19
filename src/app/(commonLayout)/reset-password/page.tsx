"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, Eye, EyeOff, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
              <XCircle className="h-7 w-7 text-destructive" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold">Invalid link</h1>
            <p className="text-sm text-muted-foreground mt-1">
              This reset link is invalid or has expired.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-xl w-full">
            <Link href="/forgot-password">Request a new link</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await authClient.resetPassword({
        newPassword: password,
        token,
      });
      if (res.error) {
        setError(res.error.message ?? "Failed to reset password.");
      } else {
        setDone(true);
        setTimeout(() => router.replace("/login"), 3000);
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

        {!done ? (
          <div
            className="rounded-2xl border bg-card p-6 space-y-5"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
          >
            <div>
              <h1 className="text-lg font-bold">Set new password</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a strong password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New password */}
              <div className="space-y-1.5">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="rounded-xl pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div className="space-y-1.5">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  className="rounded-xl"
                  disabled={loading}
                />
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button
                type="submit"
                className="w-full rounded-xl gap-2"
                disabled={loading}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Reset Password
              </Button>
            </form>
          </div>
        ) : (
          <div
            className="rounded-2xl border bg-card p-6 text-center space-y-4"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
          >
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/20">
                <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold">Password reset!</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your password has been updated. Redirecting to login…
              </p>
            </div>
            <Button asChild className="w-full rounded-xl">
              <Link href="/login">Go to Login</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
