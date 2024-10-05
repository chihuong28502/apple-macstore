import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/constants/i18n.config";
import { NextRequest, NextResponse } from "next/server";

const privatePaths = [
  "/vi/manage",
  "/en/manage",
  "/de/manage",
  "/fr/manage",
  "/es/manage",
  "/it/manage",
  "/tr/manage",
  "/pt/manage",
  "/hi/manage",
  "/ja/manage",
  "/ru/manage",
];

export function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale,
  });

  // Gọi middleware i18n
  const response = handleI18nRouting(request);

  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const locale = request.cookies.get("NEXT_LOCALE")?.value ?? defaultLocale;

  console.log("pathname:", pathname);
  console.log("locale:", locale);
  console.log("accessToken:", accessToken);
  console.log("refreshToken:", refreshToken);

  // Kiểm tra quyền truy cập vào các private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken && !accessToken) {
    const url = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(url);
  }

  return response; // Trả về response từ middleware i18n
}

export const config = {
  matcher: ["/", "/(en|vi|de|fr|es|it|tr|pt|hi|ja|ru)/:path*"],
};
