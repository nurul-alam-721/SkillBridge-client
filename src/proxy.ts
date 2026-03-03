import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Roles } from "./constant/Roles";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isAuthenticated = !!sessionToken;

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = request.cookies.get("user-role")?.value;

  if (role === Roles.student && pathname.startsWith("/tutor")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (role === Roles.student && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (role === Roles.tutor && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/tutor/dashboard", request.url));
  }

  if (role === Roles.tutor && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/tutor/dashboard", request.url));
  }

  if (role === Roles.admin && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (role === Roles.admin && pathname.startsWith("/tutor")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tutor/dashboard/:path*",
    "/tutor/profile/:path*",
    "/tutor/availability/:path*",
    "/admin/:path*",
  ],
};
