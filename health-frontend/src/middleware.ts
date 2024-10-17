import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/constants/i18n.config";
import { NextRequest, NextResponse } from "next/server";

const basePaths = ["private", "product"];

const privatePaths = locales.flatMap((locale) =>
  basePaths.map((path) => `/${locale}/${path}`)
);

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

  //Chưa đăng nhập thì không cho vào trang private paths
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    !refreshToken &&
    !accessToken
  ) {
    const url = new URL(`/${locale}/auth/login`, request.url);
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
