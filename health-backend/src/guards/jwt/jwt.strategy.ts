import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const se = configService.get<string>('JWT_SECRET');
    console.log("🚀 ~ JwtStrategy ~ se:", se)
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy JWT từ header Authorization
      ignoreExpiration: false, // Kiểm tra thời hạn của token
      secretOrKey: se, // Secret để giải mã JWT
    });
  }

  async validate(payload: any) {
    // Trả lại thông tin người dùng từ JWT (payload)
    return { _id: payload._id, username: payload.username, role: payload.role };
  }
}
