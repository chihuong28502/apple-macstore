import { defaultLocale, locales } from "@/constants/i18n.config";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const basePaths = ["private", "product"];
console.log("🚀 ~ basePaths:", basePaths)
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
  console.log("🚀 ~ accessToken:", accessToken)
  const refreshToken = request.cookies.get("refreshToken")?.value;
  console.log("🚀 ~ refreshToken:", refreshToken)
  const role = request.cookies.get("role")?.value; // Kiểm tra role từ cookie
  const locale = request.cookies.get("NEXT_LOCALE")?.value ?? defaultLocale;

  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    !refreshToken &&
    !accessToken
  ) {
    const url = new URL(`/${locale}/auth/login`, request.url);
    return NextResponse.redirect(url);
  }
  if (
    adminPaths.some((path) => pathname.startsWith(path)) &&
    role !== "admin"
  ) {
    const url = new URL(`/${locale}`, request.url);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/([\\w-]+)?/users/(.+)",
  ],
};
