import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseDto } from 'src/dtoRequest/return.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt/jwt-auth.guard';

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }


  async onModuleInit() {
    await this.authService.createAdmin();
  }
  // Endpoint để tạo người dùng mới
  @Public()
  @Post('register')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseDto> {
    return this.authService.create(createUserDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    return this.authService.login(loginDto, res);
  }


  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async findOne(@Param('id') id: string): Promise<ResponseDto> {
    if (!id) {
      throw new Error('ID is required');
    }
    return this.userService.findOne(id);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: RequestWithCookies, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    const newAccessToken = await this.authService.refreshAccessToken(refreshToken);
    if (!newAccessToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    res.cookie('accessToken', newAccessToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      maxAge: 3600 * 1000, 
    });

    return res.json({
      message: 'Token refreshed successfully',
      accessToken: newAccessToken,
    });
  }

  @Public()
  @Get('logout')
  async logout(@Res() response: Response) {
    return this.authService.logout(response);
  }
}
