import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
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
import { LoginAdminDto } from './dto/login.admin.dto';
import { Admin } from 'src/user/schema/admin.schema';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RulesGuard } from 'src/common/guards/auth.guard';
import { LoginGoogleDto } from './dto/login-google.dto';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly cookiesService: CookiesService,
    private configService: ConfigService,
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

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Body() changePassword: CreateUserDto): Promise<ResponseDto<User>> {
    return this.authService.changePassword(changePassword);
  }

  @Public()
  @Post('login-google')
  @HttpCode(HttpStatus.OK)
  async loginGoogle(
    @Body() loginGoogleDto: LoginGoogleDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDto<User>> {
    const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
    const ipAddress = req.ip || 'Unknown IP';
    const result = await this.authService.loginGoogle(loginGoogleDto, deviceInfo, ipAddress);
    this.cookiesService.setAuthCookies(res, result.data.accessToken, result.data.refreshToken);
    return result;
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
    if (result.success === true) {
      this.cookiesService.setAuthCookies(res, result.data.accessToken, result.data.refreshToken);
    }
    return result;
  }

  @Public()
  @Post('login-admin')
  @HttpCode(HttpStatus.OK)
  async loginAdmin(
    @Body() loginAdminDto: LoginAdminDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDto<User>> {
    const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
    const ipAddress = req.ip || 'Unknown IP';
    const result = await this.authService.loginAdmin(loginAdminDto, deviceInfo, ipAddress);
    this.cookiesService.setAuthCookies(res, result.data.accessToken, result.data.refreshToken);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async getUser(@Param('id') id: string): Promise<ResponseDto<User>> {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RulesGuard)
  @Roles('admin')
  @Get('user-admin/:id')
  async getAdmin(@Param('id') id: string): Promise<ResponseDto<Admin>> {
    return this.userService.findOneAdmin(id);
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
  @Post('refresh-admin')
  @HttpCode(HttpStatus.OK)
  async refreshTokenAdmin(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<ResponseDto<Admin>> {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Token không được gửi lên');
    }
    const result = await this.authService.refreshAccessTokenAdmin(refreshToken);
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

  // CHANGE PASSWORD


  @Public()
  @Post('forget-password/verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Body('email') email: string
  ): Promise<ResponseDto<any>> {
    return this.authService.verifyEmail(email);
  }

  @Public()
  @Post('forget-password/verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body('data') data: any
  ): Promise<ResponseDto<any>> {
    return this.authService.verifyOtp(data);
  }

  @Public()
  @Post('forget-password/verify-password-forget')
  @HttpCode(HttpStatus.OK)
  async verifyPassForget(
    @Body() body: { email: string; newPassword: string; token: string }
  ): Promise<ResponseDto<any>> {
    const { email, newPassword, token } = body;
    return this.authService.verifyPassForget(email, newPassword, token);
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  async activeAccountByEmail(@Query('token') token: string) {
    const verifiedEmail = this.authService.verifyToken(token);
    return await this.authService.activateAccount(verifiedEmail.email);
  }
}