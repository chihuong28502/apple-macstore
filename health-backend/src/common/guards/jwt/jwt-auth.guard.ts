import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }
  
  async canActivate(context: ExecutionContext) {
    // Đợi kết quả từ super.canActivate vì nó trả về một Promise
    const result = await super.canActivate(context) as boolean;
    console.log('canActivate success:', result);

    // Thực hiện logic tùy chỉnh nếu cần
    return result;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
