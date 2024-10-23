import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt/jwt-auth.guard';
import { CookiesService } from './cookies.service';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { User } from 'src/user/schema/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly cookiesService: CookiesService,
  ) { }
 
  async onModuleInit() {
    await this.authService.createAdmin();
  }
  
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<ResponseDto<User>> {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDto<User>> {
    const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
    const ipAddress = req.ip || 'Unknown IP';
    const result = await this.authService.login(loginDto, deviceInfo, ipAddress);
    this.cookiesService.setAuthCookies(res, result.data.accessToken, result.data.refreshToken);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async getUser(@Param('id') id: string): Promise<ResponseDto<User>> {
    return this.userService.findOne(id);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<ResponseDto<User>> {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Token không được gửi lên');
    }
    const result = await this.authService.refreshAccessToken(refreshToken);
    this.cookiesService.setAccessTokenCookie(res, result.data.accessToken);
    return result;
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response): Promise<ResponseDto<User>> {
    const result = await this.authService.logout();
    this.cookiesService.clearAuthCookies(res);
    return result;
  }
}