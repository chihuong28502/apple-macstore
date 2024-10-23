import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CookieAge } from './utils/cookieAgeAuth.service';

@Injectable()
export class CookiesService {
  constructor(private cookieAge: CookieAge) {}

  setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      path:'/',
      sameSite: 'none',
      maxAge: this.cookieAge.accessTokenExpirationMs,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      path:'/',
      sameSite: 'none',
      maxAge: this.cookieAge.refreshTokenExpirationMs,
    });
  }
  setAccessTokenCookie(res: Response, accessToken: string): void {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path:'/',
      maxAge: this.cookieAge.accessTokenExpirationMs,
    });
  }
  clearAuthCookies(res: Response): void {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }
}