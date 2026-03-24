// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = [
  "/dashboard",
  "/tutor/dashboard",
  "/tutor/profile",
  "/tutor/availability",
  "/admin",
];

const AUTH_ROUTES = ["/login", "/register"];
const CALLBACK_ROUTES = ["/auth/callback"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (CALLBACK_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("__Secure-better-auth.session_token")?.value ??
    request.cookies.get("better-auth.session_token.0")?.value;

  const isAuthenticated = !!sessionToken;
  const role = request.cookies.get("user-role")?.value;

  if (isAuthenticated && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (role === "tutor") return NextResponse.redirect(new URL("/tutor/dashboard", request.url));
    if (role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("user-role");
    return res;
  }

  if (isAuthenticated && role) {
    if (role === "student" && (pathname.startsWith("/tutor/") || pathname.startsWith("/admin"))) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (role === "tutor" && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))) {
      return NextResponse.redirect(new URL("/tutor/dashboard", request.url));
    }
    if (role === "admin" && (pathname.startsWith("/dashboard") || pathname.startsWith("/tutor/"))) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};