import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { isHybrid, isPublic } from "./constants";

export async function middleware(request: NextRequest) {
  // Fetch the session cookie
  const isSession = (await cookies()).get("appwrite-session");
  console.log("🚀 ~ middleware ~ isSession:", isSession);

  // Allow access if the URL contains `?secret=`
  if (request.nextUrl.searchParams.has("secret")) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  const isHybridRoute = isHybrid.some((route) =>
    new RegExp(`^${route.replace(/\[.*\]/, ".*")}$`).test(pathname),
  );

  // Handle cases where there is no session
  if (!isSession) {
    if (!isPublic.includes(pathname) && !isHybridRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    // Allow access to public and hybrid routes even without a session
    return NextResponse.next();
  }

  // Handle cases where there is a session
  if (isSession) {
    if (isPublic.includes(pathname)) {
      // Redirect to home page if the requested route is public
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    // Allow access to hybrid routes even with a session
    if (isHybrid.includes(pathname)) {
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
