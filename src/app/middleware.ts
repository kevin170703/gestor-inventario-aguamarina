// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;

  // Si no hay token, redirige al login
  if (!token && req.nextUrl.pathname.startsWith("/")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Qué rutas proteger
export const config = {
  matcher: ["/:path*"],
};
