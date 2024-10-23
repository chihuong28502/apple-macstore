import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Khai báo metadata key cho Public decorator
const IS_PUBLIC_KEY = 'isPublic';

@Injectable()
export class BlockApiGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    // Nếu API được đánh dấu là public, cho phép truy cập
    if (isPublic) {
      return true;
    }

    // Nếu không phải public API, thì chặn truy cập
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Kiểm tra thông tin người dùng từ request (giả sử có xác thực)

    if (!user) {
      return false; // Chặn truy cập nếu không có thông tin người dùng
    }

    // Cho phép truy cập nếu có thông tin người dùng hợp lệ
    return true;
  }
}
