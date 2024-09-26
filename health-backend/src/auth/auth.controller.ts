import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from '@nestjs/common';
import { Public } from 'src/common/public.decorator';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // Endpoint để tạo người dùng mới
  @Public()
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.create(createUserDto);
  }
  
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  // Endpoint để tìm người dùng theo ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }
}
