import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RulesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Lấy request từ context
    const request = context.switchToHttp().getRequest();

    // Ví dụ: Lấy vai trò (role) của người dùng từ request (giả sử request có chứa user)
    const user = request.user;

    // Nếu không có thông tin người dùng, chặn luôn
    if (!user) {
      throw new ForbiddenException('No user information found');
    }

    // Quy tắc kiểm tra role: Ví dụ chỉ cho phép 'admin'
    const allowedRoles = ['admin','support'];

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    // Nếu thỏa mãn điều kiện, cho phép truy cập API
    return true;
  }
}
