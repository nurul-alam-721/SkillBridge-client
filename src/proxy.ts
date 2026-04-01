import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/tutor", "/admin"];
const AUTH_ROUTES = ["/login", "/register"];
const CALLBACK_ROUTES = ["/auth/callback", "/onboarding"];
const API_ROUTES = ["/api"];

const matchPath = (pathname: string, path: string) =>
  pathname === path || pathname.startsWith(path + "/");

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    CALLBACK_ROUTES.some((r) => matchPath(pathname, r)) ||
    API_ROUTES.some((r) => matchPath(pathname, r))
  ) {
    return NextResponse.next();
  }

  const role = request.cookies.get("user-role")?.value;
  const isAuthenticated = !!role;

  const isProtectedPath = PROTECTED_PATHS.some((p) =>
    matchPath(pathname, p)
  );

  if (isProtectedPath && isAuthenticated) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        headers: { cookie: request.headers.get("cookie") ?? "" },
      });

      if (res.status === 403) {
        const body = await res.json();
        if (body.code === "ACCOUNT_BANNED") {
          const response = NextResponse.redirect(
            new URL("/banned", request.url)
          );
          response.cookies.delete("user-role");
          return response;
        }
      }
    } catch {}
  }

  if (
    isAuthenticated &&
    AUTH_ROUTES.some((r) => matchPath(pathname, r))
  ) {
    if (role === "TUTOR") {
      return NextResponse.redirect(
        new URL("/tutor/dashboard", request.url)
      );
    }
    if (role === "ADMIN") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && role) {
    if (role === "STUDENT") {
      if (
        matchPath(pathname, "/tutor") ||
        matchPath(pathname, "/admin")
      ) {
        return NextResponse.redirect(
          new URL("/dashboard", request.url)
        );
      }
    } else if (role === "TUTOR") {
      if (
        matchPath(pathname, "/dashboard") ||
        matchPath(pathname, "/admin")
      ) {
        return NextResponse.redirect(
          new URL("/tutor/dashboard", request.url)
        );
      }
    } else if (role === "ADMIN") {
      if (
        matchPath(pathname, "/dashboard") ||
        matchPath(pathname, "/tutor")
      ) {
        return NextResponse.redirect(
          new URL("/admin/dashboard", request.url)
        );
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