import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // المسارات العامة
  const publicPaths = ["/auth/login", "/auth/signup", "/auth/callback"];
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}?`)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // فحص جميع الكوكيز المتعلقة بـ Supabase
  const allCookies = request.cookies.getAll();
  const hasSupabaseSession = allCookies.some(
    (cookie) =>
      cookie.name.includes("sb-") || cookie.name.includes("supabase")
  );

  if (!hasSupabaseSession && !pathname.includes("/_next") && !pathname.includes(".")) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};