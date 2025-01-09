import { NextRequest, NextResponse } from "next/server";
import { isHybrid, isPublic } from "./constants";
import { createSessionClient } from "./lib/appwrite";

export async function middleware(request: NextRequest) {
  const { account } = await createSessionClient();

  const isUser = await account
    .get()
    .then(() => true)
    .catch(() => false);

  // Allow access if the URL contains `?secret=`
  if (request.nextUrl.searchParams.has("secret")) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  const isHybridRoute = isHybrid.some((route) =>
    new RegExp(`^${route.replace(/\[.*\]/, ".*")}$`).test(pathname),
  );

  const isPublicRoute = isPublic.includes(pathname);

  // Handle cases where there is no session
  if (!isUser) {
    if (!isPublicRoute && !isHybridRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    // Allow access to public and hybrid routes even without a session
    return NextResponse.next();
  }

  // Handle cases where there is a session
  if (isUser) {
    if (isPublicRoute) {
      // Redirect to home page if the requested route is public
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    // Allow access to hybrid routes even with a session
    if (isHybridRoute) {
      return NextResponse.next();
    }
  }

  // Default to allowing access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|api|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
