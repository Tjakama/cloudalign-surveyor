import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET });
  const { pathname } = request.nextUrl;

  // Protect admin and department routes
  if (!token && pathname !== "/auth/signin") {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/engineer/:path*",
    "/finance/:path*",
    "/md/:path*",
    "/rnd-lead/:path*",
    "/sales/:path*",
    "/tech-lead/:path*",
  ],
};