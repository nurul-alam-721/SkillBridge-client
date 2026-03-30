// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/tutor", "/admin"];
const AUTH_ROUTES = ["/login", "/register"];
const CALLBACK_ROUTES = ["/auth/callback", "/onboarding"];
const API_ROUTES = ["/api"];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (CALLBACK_ROUTES.some((r) => pathname.startsWith(r)) ||
      API_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  const role = request.cookies.get("user-role")?.value;
  const isAuthenticated = !!role;

  if (isAuthenticated && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (role === "TUTOR") {
      return NextResponse.redirect(new URL("/tutor/dashboard", request.url));
    }
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && role) {
    if (role === "STUDENT") {
      if (pathname.startsWith("/tutor") || pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else if (role === "TUTOR") {
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/tutor/dashboard", request.url));
      }
    } else if (role === "ADMIN") {
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/tutor")) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};