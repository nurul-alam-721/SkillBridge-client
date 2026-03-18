"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { handleGoogleLogin } from "@/lib/handleGoogleLogin";
import { User } from "@/types/types";
import { Roles } from "@/constant/Roles";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Minimum length is 8 characters"),
});

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function getDefaultRedirect(user: User): string {
  if (user.role === Roles.admin) return "/admin/dashboard";
  if (user.role === Roles.tutor) return "/tutor/dashboard";
  return "/dashboard";
}

function isSafeRedirect(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

export function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get("redirect");

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Logging in...");
      try {
        const { error } = await authClient.signIn.email(value);
        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        const session = await authClient.getSession();
        const user = session?.data?.user as User | undefined;

        if (!user) {
          toast.error("User data not found", { id: toastId });
          return;
        }

        document.cookie = `user-role=${user.role}; path=/; max-age=604800; SameSite=Lax`;

        toast.success("Login successful!", { id: toastId });

        let destination: string;
        if (redirectTo && isSafeRedirect(redirectTo) && user.role === Roles.student) {
          destination = redirectTo;
        } else {
          destination = getDefaultRedirect(user);
        }

        router.replace(destination);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Something went wrong!";
        toast.error(message, { id: toastId });
      }
    },
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tight">
            Skill<span className="text-primary">Bridge</span>
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back — sign in to continue</p>
        </div>

        <div
          className="rounded-2xl border bg-card"
          style={{
            boxShadow: [
              "0 1px 2px rgba(0,0,0,0.04)",
              "0 4px 8px rgba(0,0,0,0.04)",
              "0 10px 20px rgba(0,0,0,0.04)",
              "0 20px 40px rgba(0,0,0,0.04)",
              "0 40px 80px rgba(0,0,0,0.03)",
            ].join(", "),
          }}
        >
          {/* Google */}
          <div className="p-6 pb-0">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl border bg-background px-4 py-2.5 text-sm font-medium transition-all hover:bg-muted active:scale-[0.99]"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>

          <div className="flex items-center gap-3 px-6 py-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or sign in with email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form
            id="login-form"
            className="px-6"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup className="space-y-4">
              <form.Field name="email">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="space-y-1.5">
                      <FieldLabel className="text-sm font-medium">Email</FieldLabel>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="h-10 rounded-xl bg-background px-3.5 text-sm"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="password">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <FieldLabel className="text-sm font-medium">Password</FieldLabel>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="h-10 rounded-xl bg-background px-3.5 text-sm"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>

            <Button
              type="submit"
              form="login-form"
              className="mt-5 h-10 w-full rounded-xl font-semibold tracking-wide"
            >
              Sign in
            </Button>
          </form>

          {/* Footer */}
          <p className="py-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}