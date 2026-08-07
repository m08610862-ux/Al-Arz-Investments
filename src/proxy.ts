import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Protected route prefixes that require authentication
const PROTECTED_PREFIXES = ["/admin", "/staff"];

// Auth pages that logged-in users shouldn't see
const AUTH_PAGES = ["/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // Check if the route is an auth page
  const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));

  // Securely decode and validate the JWT token instead of just checking if the cookie exists
  const token = await getToken({ 
    req: request, 
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production"
  });

  const isLoggedIn = !!token;

  // Redirect to login if accessing protected route without a valid session
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from auth pages to staff panel
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/staff", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static files, images, and API routes
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
