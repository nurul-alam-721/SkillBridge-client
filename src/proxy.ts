import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Roles } from "./constant/Roles";

const PROTECTED = [
  "/dashboard",
  "/tutor/dashboard",
  "/tutor/profile",
  "/tutor/availability",
  "/admin",
];

const AUTH_ROUTES = ["/login", "/register", "/verify-email", "/forgot-password", "/reset-password"];
const CALLBACK_ROUTES = ["/auth/callback"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isAuthenticated = !!sessionToken;
  const role = request.cookies.get("user-role")?.value;

  if (CALLBACK_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  if (isAuthenticated && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (role === Roles.tutor) return NextResponse.redirect(new URL("/tutor/dashboard", request.url));
    if (role === Roles.admin) return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (isProtected && !isAuthenticated) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && role) {
    if (role === Roles.student && (pathname.startsWith("/tutor/") || pathname.startsWith("/admin"))) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (role === Roles.tutor && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/tutor/dashboard", request.url));
    }
    if (role === Roles.tutor && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/tutor/dashboard", request.url));
    }
    if (role === Roles.admin && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (role === Roles.admin && pathname.startsWith("/tutor/")) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/callback",
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/dashboard/:path*",
    "/tutor/dashboard",
    "/tutor/dashboard/:path*",
    "/tutor/profile",
    "/tutor/profile/:path*",
    "/tutor/availability",
    "/tutor/availability/:path*",
    "/admin/:path*",
  ],
};