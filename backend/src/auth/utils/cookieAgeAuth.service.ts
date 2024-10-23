import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CookieAge {
  constructor(private configService: ConfigService) {}

  get accessTokenExpiration(): string {
    return this.configService.get<string>('ACCESSTOKEN_EXPIRATION', '15m');
  }

  get refreshTokenExpiration(): string {
    return this.configService.get<string>('REFRESHTOKEN_EXPIRATION', '7d');
  }

  get accessTokenExpirationMs(): number {
    return this.parseDuration(this.accessTokenExpiration);
  }

  get refreshTokenExpirationMs(): number {
    return this.parseDuration(this.refreshTokenExpiration);
  }

  private parseDuration(duration: string): number {
    const unit = duration.slice(-1);
    const value = parseInt(duration.slice(0, -1), 10);

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        throw new Error('Invalid duration format');
    }
  }
}