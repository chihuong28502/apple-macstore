import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/constants/i18n.config";
import { NextRequest, NextResponse } from "next/server";

// export default createMiddleware({
//   locales,
//   defaultLocale,
// });


const privatePaths = [
  "/vi/private",
  "/en/private",
];

export function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale,
  });

  const response = handleI18nRouting(request);

  const { pathname } = request.nextUrl;


  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const locale = request.cookies.get("NEXT_LOCALE")?.value ?? defaultLocale;

  //Chưa đăng nhập thì không cho vào trang private paths
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    !refreshToken &&
    !accessToken
  ) {
    const url = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Match only /en and /vi
  matcher: ["/", "/(en|vi)/:path*"],
};
