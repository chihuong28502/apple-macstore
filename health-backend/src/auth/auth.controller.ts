import { Body, Controller, Get, Param, Post, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseDto } from 'src/dtoRequest/return.dto';
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

  @Get('user/:id')
  async findOne(@Param('id') id: string): Promise<ResponseDto> {
    if (!id) {
      throw new Error('ID is required');
    }
    return this.userService.findOne(id);
  }

  @Public()
  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string, @Res() res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    const newAccessToken = await this.authService.refreshAccessToken(refreshToken);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
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
