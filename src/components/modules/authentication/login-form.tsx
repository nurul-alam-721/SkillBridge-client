"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types/user";
import { Roles } from "@/constant/roles";
import { handleGoogleLogin } from "@/hooks/handleGoogleLogin";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Minimum length is 8 characters"),
});

export function LoginForm() {
  const router = useRouter();

  const redirectByRole = (user: User) => {
    if (user.role === Roles.admin) router.push("/admin/dashboard");
    else if (user.role === Roles.tutor) router.push("/tutor/dashboard");
    else router.push("/dashboard");
  };

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

        toast.success("Login successful!", { id: toastId });
        redirectByRole(user);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Something went wrong!";
        toast.error(message, { id: toastId });
      }
    },
  });



  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your account details</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          <FieldGroup>
            <form.Field name="password">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <Button type="submit" form="login-form" className="w-full">
          Login
        </Button>
        <Button variant="outline" onClick={handleGoogleLogin} className="w-full">
          Continue with Google
        </Button>
      </CardFooter>
    </Card>
  );
}