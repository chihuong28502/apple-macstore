import {
  BadRequestException,
  Injectable,
  Logger,
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
import { RefreshToken, RefreshTokenDocument } from './schema/refreshToken.schema';
import { CookieAge } from './utils/cookieAgeAuth.service';
import { ResponseDto } from 'src/utils/dto/response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>,
    private jwtService: JwtService,
    private cookieAge: CookieAge,
    private configService: ConfigService,
  ) { }


  async createAdmin(): Promise<void> {
    const adminEmail = 'admin@gmail.com';
    const existingAdmin = await this.userModel.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const adminUser = {
        username: 'admin',
        password: await this.hashPassword('12345678'),
        email: adminEmail,
        role: 'admin',
      };
      await this.userModel.create(adminUser);
      this.logger.log('Admin account created');
    } else {
      this.logger.log('Admin account already exists');
    }
  }

  async register(createUserDto: CreateUserDto): Promise<ResponseDto<User>> {
    if (!createUserDto.password) {
      throw new BadRequestException('Password is required');
    }
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    await createdUser.save();
    return {
      message: 'Register success',
      success: true,
      data: createdUser,
    };
  }

  async login(loginDto: LoginDto, deviceInfo: string, ipAddress: string): Promise<ResponseDto<User>> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    await this.refreshTokenModel.deleteMany({ userId: user._id, deviceInfo, ipAddress });
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    await this.saveRefreshToken(user._id, refreshToken, deviceInfo, ipAddress);
    return {
      message: 'Login success',
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          username: user.username,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<ResponseDto<User>> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN'),
      });
      await this.validateRefreshToken(payload._id, refreshToken);
      const user = await this.userModel.findById(payload._id).exec();
      if (!user) {
        throw new UnauthorizedException('Không tìm thấy người dùng');
      }
      const newAccessToken = await this.generateAccessToken(user);
      return {
        message: 'Làm mới token thành công',
        success: true,
        data: { accessToken: newAccessToken },
      };
    } catch (error) {
      this.logger.error(`Lỗi khi làm mới token: ${error.message}`);
      throw new UnauthorizedException('Token làm mới không hợp lệ');
    }
  }

  async logout(): Promise<ResponseDto<User>> {
    return {
      success: true,
      message: 'Logout success',
      data: null,
    };
  }

  private async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  private async validateRefreshToken(userId: string, refreshToken: string): Promise<RefreshTokenDocument> {
    const storedToken = await this.refreshTokenModel.findOne({ userId }).exec();
    if (!storedToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const isTokenValid = await bcrypt.compare(refreshToken, storedToken.token);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }
    return storedToken;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async generateAccessToken(user: UserDocument): Promise<string> {
    const payload = {
      username: user.username,
      _id: user._id.toString(),
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.cookieAge.accessTokenExpiration
    });
  }

  private async generateRefreshToken(user: UserDocument): Promise<string> {

    const payload = {
      username: user.username,
      _id: user._id.toString(),
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN'),
      expiresIn: this.cookieAge.refreshTokenExpiration
    });
  }

  private async saveRefreshToken(userId: any, refreshToken: string, deviceInfo: string, ipAddress: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const hashedRefreshToken = await this.hashPassword(refreshToken);
    const newRefreshToken = new this.refreshTokenModel({
      userId,
      token: hashedRefreshToken,
      deviceInfo,
      ipAddress,
      expiresAt,
    });
    await newRefreshToken.save();
  }
}