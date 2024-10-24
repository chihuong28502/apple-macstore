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
const privatePaths = basePaths.map((path) => `/${path}`); // Paths without locale

const adminPaths = [`/dashboard`]; // Paths without locale

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

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
    const url = new URL(`/auth/login`, request.url);
    return NextResponse.redirect(url);
  }

  // Handle access for admin
  if (userRole === "admin") {
    // If the admin is trying to access root (/) or any non-dashboard route, redirect to dashboard
    if (pathname === '/' || !adminPaths.some((path) => pathname.startsWith(path))) {
      const url = new URL(`/dashboard`, request.url);
      return NextResponse.redirect(url);
    }
  } else if (adminPaths.some((path) => pathname.startsWith(path))) {
    // If user is not admin and is trying to access admin paths, redirect
    const url = new URL(`/`, request.url); // Redirect to homepage or another route
    return NextResponse.redirect(url);
  }

  // Allow access to public routes, including root (/)
  return NextResponse.next(); // Proceed as usual for all other routes
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/users/(.+)",
  ],
};
