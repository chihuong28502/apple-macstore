import {
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async login(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;

    // Tìm người dùng theo username
    const user = await this.userModel.findOne({ username: username });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Tạo Access Token và Refresh Token
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      message: 'Login success',
      status: true,
      accessToken,
      refreshToken,
    };
  }
  // Tạo mới một người dùng
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Tạo một bản sao của createUserDto để không thay đổi đối tượng gốc
    const userToCreate = { ...createUserDto };

    // Mã hóa mật khẩu trước khi lưu vào DB
    const salt = await bcrypt.genSalt(10); // Tạo "muối" để bảo vệ mã hóa
    const hashedPassword = await bcrypt.hash(userToCreate.password, salt);  // Mã hóa mật khẩu

    // Ghi đè mật khẩu gốc bằng mật khẩu đã mã hóa
    userToCreate.password = hashedPassword;

    // Tạo mới người dùng và lưu vào DB
    const createdUser = new this.userModel(userToCreate);
    return createdUser.save();
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
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d', // Refresh Token có thời hạn 7 ngày
    });
  }

  // Xác thực Refresh Token để tạo lại Access Token
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      return this.generateAccessToken(payload); // Trả lại Access Token mới
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
