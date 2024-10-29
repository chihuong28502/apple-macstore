import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  // Giải mã token để lấy quyền của người dùng
  let userRole = null;
  if (accessToken) {
    const decodedToken = decodeToken(accessToken);
    if (decodedToken) {
      userRole = decodedToken.role; // Lấy quyền người dùng
    }
  }

  // Kiểm tra nếu đang truy cập vào đường dẫn riêng tư
  if (basePaths.some((path) => pathname.startsWith(`/${path}`))) {
    // Kiểm tra nếu không có token hoặc không phải là customer
    if (!accessToken || userRole !== "customer") {
      const url = new URL(`/auth/login`, request.url); // Chuyển hướng đến trang đăng nhập
      return NextResponse.redirect(url);
    }
  }

  // Cho phép truy cập vào các đường dẫn công cộng (nếu cần)
  return NextResponse.next(); // Tiếp tục như bình thường cho tất cả các đường dẫn khác
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)", // Để ngoại trừ các route không cần xác thực
    "/users/(.+)", // Có thể thêm các route khác vào đây nếu cần
  ],
};
