import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createAdmin(): Promise<void> {
    const adminEmail = 'admin@gmail.com';

    // Kiểm tra xem admin có tồn tại chưa
    const existingAdmin = await this.userModel.findOne({ email: adminEmail });
    if (!existingAdmin) {
      // Hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('12345678', salt);

      // Tạo tài khoản admin mới
      const adminUser = {
        username: 'admin',
        password: hashedPassword,
        email: adminEmail,
        role: 'admin',
      };

      // Lưu vào database
      await this.userModel.create(adminUser);
      console.log('Admin account created');
    } else {
      console.log('Admin account already exists');
    }
  }

  async login(loginDto: LoginDto, res: Response): Promise<any> {
    const { email, password } = loginDto;
    this.logger.log(`Login attempt for email: ${email}`);

    // Tìm người dùng theo email
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      this.logger.warn(`User not found: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.error(`Invalid password attempt for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`Login successful for email: ${email}`);

    // Tạo Access Token và Refresh Token
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    // Lưu Access Token và Refresh Token vào cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true, // Nên dùng HTTPS khi deploy để đảm bảo an toàn
      sameSite: 'strict',
      maxAge: 3600 * 1000, // 1 giờ
    });
    res.cookie('loggedin', true, {
      httpOnly: true,
      secure: true, // Nên dùng HTTPS khi deploy để đảm bảo an toàn
      sameSite: 'strict',
      maxAge: 3600 * 1000, // 1 giờ
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 3600 * 1000, // 7 ngày
    });

    // Trả về phản hồi JSON
    return res.json({
      message: 'Login success',
      success: true,
      status: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      },
    });
  }
  // Tạo mới một người dùng
  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; success: boolean; user: User }> {
    this.logger.debug(createUserDto);
    if (!createUserDto.password) {
      throw new BadRequestException('Password is required');
    }
    const salt = await bcrypt.genSalt(10); // Tạo muối
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt); // Mã hóa mật khẩu

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword, // Lưu mật khẩu đã mã hóa
    });

    await createdUser.save();

    return {
      message: 'Register success',
      success: true,
      user: createdUser,
    };
  }

  async generateAccessToken(user: any): Promise<string> {
    const payload = {
      username: user.username,
      _id: user._id,
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      expiresIn: '15m', // Thời hạn 15 phút
    });
  }

  // Hàm tạo Refresh Token
  async generateRefreshToken(user: any): Promise<string> {
    const payload = {
      username: user.username,
      _id: user._id,
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN'),
      expiresIn: '7d', // Refresh Token có thời hạn 7 ngày
    });
  }

  // Xác thực Refresh Token để tạo lại Access Token
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN'),
      });
      return this.generateAccessToken(payload); // Trả lại Access Token mới
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
