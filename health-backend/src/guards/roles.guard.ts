import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log('🚀 ~ RolesGuard ~ user:', user);
    if (!user) {
      throw new ForbiddenException('1Access denied, insufficient permissions');
    }
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('2Access denied, insufficient permissions');
    }
    return true;
  }
}
