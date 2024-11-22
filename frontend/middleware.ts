import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Cookies from "js-cookie";

// Define an array of protected routes
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/signin', '/signup', '/']

// Helper function to check if a path is protected
function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some((route) => path.startsWith(route));
}

export function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  let accessToken = request.cookies.get('accessToken')
  
  if (isProtectedRoute(currentPath) && !accessToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // if (!accessToken && request.nextUrl.pathname !== "/") {
  //   return NextResponse.redirect(new URL("/signin", request.url));
  // }

  return NextResponse.next();
}

// Optionally, you can add a matcher to optimize performance
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};