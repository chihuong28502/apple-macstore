import { defaultLocale, locales } from "@/constants/i18n.config";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
  role: string;
  _id: string;
}

function decodeToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

const basePaths = ["private"];
const privatePaths = locales.flatMap((locale) =>
  basePaths.map((path) => `/${locale}/${path}`)
);

const adminPaths = locales.flatMap((locale) => [`/${locale}/dashboard`]);

export function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: "always",
  });

  const response = handleI18nRouting(request);
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const locale = request.cookies.get("NEXT_LOCALE")?.value ?? defaultLocale;

  // Decode token to get user role
  let userRole = null;
  if (accessToken) {
    const decodedToken = decodeToken(accessToken);
    if (decodedToken) {
      userRole = decodedToken.role;
    }
  }

  // Check private routes
  if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
    const url = new URL(`/${locale}/auth/login`, request.url);
    return NextResponse.redirect(url);
  }

  // Handle access for admin
  if (userRole === "admin") {
    // If the admin is trying to access root (/) or any non-dashboard route, redirect to dashboard
    if (pathname === '/' || !adminPaths.some((path) => pathname.startsWith(path))) {
      const url = new URL(`/${locale}/dashboard`, request.url);
      return NextResponse.redirect(url);
    }
  } else if (adminPaths.some((path) => pathname.startsWith(path))) {
    // If user is not admin and is trying to access admin paths, redirect
    const url = new URL(`/${locale}`, request.url); // Redirect to homepage or another route
    return NextResponse.redirect(url);
  }

  // Allow access to public routes, including root (/)
  return response; // Proceed as usual for all other routes
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/([\\w-]+)?/users/(.+)",
  ],
};
