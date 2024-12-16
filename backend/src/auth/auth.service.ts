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
import { OAuth2Client } from 'google-auth-library';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { CartService } from 'src/cart/cart.service';
import { NotifyService } from 'src/notify/notify.service';
import { Admin, AdminDocument } from 'src/user/schema/admin.schema';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginGoogleDto } from './dto/login-google.dto';
import { LoginAdminDto } from './dto/login.admin.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshToken, RefreshTokenDocument } from './schema/refreshToken.schema';
import { CookieAge } from './utils/cookieAgeAuth.service';
import { generatePassword } from './utils/genPassword';
import { Otp, OtpDocument } from './schema/otp.schema';
import { EmailService } from './email.service';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly transporter: nodemailer.Transporter;
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
    private cookieAge: CookieAge,
    private configService: ConfigService,
    private notifyService: NotifyService,
    private cartService: CartService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow('EMAIL_HOST'),
      port: parseInt(this.configService.getOrThrow('EMAIL_PORT')),
      secure: false,
      auth: {
        user: this.configService.getOrThrow('EMAIL_USER'),
        pass: this.configService.getOrThrow('EMAIL_PASS'),
      },
    });
  }
  async loginGoogle({ token }: LoginGoogleDto, deviceInfo: string, ipAddress: string) {
    const client = new OAuth2Client(
      this.configService.getOrThrow('CLIENT_ID_GOOGLE_CONSOLE'),
    );

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: this.configService.getOrThrow('CLIENT_ID_GOOGLE_CONSOLE'),
    });
    const payload = ticket.getPayload();
    const { email } = payload;
    let user = await this.userModel.findOne({ email });
    if (!user) {
      const password = generatePassword();
      await this.sendEmail(
        email,
        `
      Chào bạn,

      Cảm ơn bạn đã đăng ký tài khoản với chúng tôi. Đây là  mật khẩu đăng nhập của bạn:
      
      Mật khẩu: ${password}
      
      Vui lòng sử dụng , này để đăng nhập và thay đổi. 
      
      Trân trọng !
      `,
        'Mật khẩu đăng nhập kwt',
      );
      user = await this.userModel.create({
        email,
        username: email,
        isVerify: true,
        role: 'customer',
        password: await this.hashPassword(password),
        code: await this.generateUniqueCode()
      });
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    await this.refreshTokenModel.deleteMany({ userId: user._id, deviceInfo, ipAddress });
    await this.saveRefreshToken(user._id, refreshToken, deviceInfo, ipAddress);
    return {
      message: 'Đăng nhập thành công',
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          username: user.username,
          role: user.role,
        },
        accessToken,
        refreshToken
      },
    };
  }

  async createAdmin(): Promise<void> {
    const adminUsername = 'admin';
    const existingAdmin = await this.adminModel.findOne({ username: adminUsername });
    if (!existingAdmin) {
      const adminUser = {
        username: adminUsername,
        password: await this.hashPassword('12345678'),
        role: 'admin',
      };
      await this.adminModel.create(adminUser);
      this.logger.log('Tài khoản admin đã được tạo');
    } else {
      this.logger.log('Tài khoản admin đã tồn tại');
    }
  }

  async register(createUserDto: CreateUserDto): Promise<ResponseDto<User>> {
    const checkEmail = await this.userModel.findOne({ email: createUserDto.email })
    if (checkEmail) {
      throw new BadRequestException('Email tồn tại');
    }
    if (!createUserDto.password) {
      throw new BadRequestException('Password is required');
    }

    const code = await this.generateUniqueCode()
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const createdUser = new this.userModel({
      ...createUserDto,
      isVerify: false,
      role: 'customer',
      password: hashedPassword,
      code: code
    });
    await createdUser.save();
    await this.cartService.createCartForUser(createdUser.id);
    const token = this.generateVerificationToken(createUserDto.email);
    const hostClient = this.configService.get('HOST_CLIENT') || "http://localhost:4000";
    const verificationUrl = `${hostClient}/verify-email?token=${token}`;

    this.emailService.sendVerificationEmail(createUserDto.email, verificationUrl);
    return {
      message: 'Kiểm tra email để xác minh tài khoản',
      success: true,
      data: createdUser,
    };
  }


  async changePassword(changePassword: any): Promise<ResponseDto<User>> {

    const user = await this.userModel.findOne({ email: changePassword.email });
    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }

    // So sánh mật khẩu cũ với mật khẩu hiện tại trong cơ sở dữ liệu
    const isOldPasswordValid = await bcrypt.compare(changePassword.oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Mật khẩu cũ không chính xác');
    }

    // Hash mật khẩu mới
    const hashedPassword = await this.hashPassword(changePassword.newPassword);

    // Cập nhật mật khẩu người dùng
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: changePassword.email },
      { password: hashedPassword },
      { new: true } // Trả về tài liệu đã được cập nhật
    );

    if (!updatedUser) {
      throw new BadRequestException('Không thể cập nhật mật khẩu');
    }

    return {
      message: 'Mật khẩu đã được cập nhật thành công',
      success: true,
      data: updatedUser,
    };
  }

  async login(loginDto: LoginDto, deviceInfo: string, ipAddress: string): Promise<ResponseDto<User>> {
    const { email, password } = loginDto;
    const checkEmail = await this.userModel.findOne({ email });

    if (!checkEmail) {
      throw new Error('Email not found');
    }

    // Nếu email chưa được xác minh, gửi email xác minh và return luôn
    if (!checkEmail.isVerify) {
      const token = this.generateVerificationToken(email);
      const hostClient = this.configService.get('HOST_CLIENT') || "http://localhost:4000";
      const verificationUrl = `${hostClient}/verify-email?token=${token}`;
      await this.emailService.sendVerificationEmail(email, verificationUrl);
      return {
        message: 'Email chưa được xác minh. Vui lòng kiểm tra hộp thư để xác minh email.',
        success: false,
        data: null,
      };
    }

    // Xác thực người dùng và xử lý đăng nhập
    const user = await this.validateUser(email, password);
    await this.refreshTokenModel.deleteMany({ userId: user._id, deviceInfo, ipAddress });
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    await this.saveRefreshToken(user._id, refreshToken, deviceInfo, ipAddress);

    return {
      message: 'Đăng nhập thành công',
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          username: user.username,
          role: user.role,
        },
        accessToken, refreshToken
      },
    };
  }


  async loginAdmin(loginAdminDto: LoginAdminDto, deviceInfo: string, ipAddress: string): Promise<ResponseDto<Admin>> {
    const { username, password } = loginAdminDto;
    const user = await this.validateAdmin(username, password);
    await this.refreshTokenModel.deleteMany({ userId: user._id, deviceInfo, ipAddress });
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    await this.saveRefreshToken(user._id, refreshToken, deviceInfo, ipAddress);
    return {
      message: 'Đăng nhập thành công',
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

  async refreshAccessTokenAdmin(refreshToken: string): Promise<ResponseDto<Admin>> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN'),
      });
      await this.validateRefreshToken(payload._id, refreshToken);
      const user = await this.adminModel.findById(payload._id).exec();
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
      message: 'Đăng xuất thành công',
      data: null,
    };
  }

  private async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user || user.role !== 'customer') {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }
    return user;
  }


  private async validateAdmin(username: string, password: string): Promise<AdminDocument> {
    const user = await this.adminModel.findOne({ username });
    if (!user || user.role !== 'admin') {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }
    return user;
  }

  private async validateRefreshToken(userId: string, refreshToken: string) {
    const storedToken = await this.refreshTokenModel.findOne({ userId }).exec();
    if (!storedToken) {
      throw new UnauthorizedException('Không tìm thấy refresh token');
    }
    const isTokenValid = await bcrypt.compare(refreshToken, storedToken.token);
    if (!isTokenValid) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token đã hết hạn');
    }
    return storedToken;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async generateAccessToken(user: UserDocument | AdminDocument): Promise<string> {
    const payload = {
      username: user.username,
      _id: user._id.toString(),
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.cookieAge.accessTokenExpiration
    });
  }

  private async generateRefreshToken(user: UserDocument | AdminDocument): Promise<string> {

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

  private async generateUniqueCode(): Promise<string> {
    let code: string;
    const existingCodes = new Set(await this.getAllCodes());
    do {
      code = Math.floor(10000 + Math.random() * 90000).toString();
    } while (existingCodes.has(code));

    return code;
  }

  private async getAllCodes(): Promise<string[]> {
    const users = await this.userModel.find().select('code');
    return users.map(user => user.code);
  }
  async sendEmail(to: string, text: string, subject: string) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to,
        subject,
        text,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  // service forget password

  async verifyEmail(email: string): Promise<ResponseDto<any>> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Email không tồn tại trong hệ thống');
    }

    // Tạo OTP 6 số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Tính thời gian hết hạn (5 phút)
    const exp = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Xóa OTP cũ nếu có
    await this.otpModel.deleteMany({ email });

    // Lưu OTP mới
    await this.otpModel.create({
      email,
      otp,
      exp
    });

    // Gửi email chứa OTP
    await this.sendEmail(
      email,
      `
      Chào bạn,
  
      Mã OTP để đặt lại mật khẩu của bạn là: ${otp}
      
      Mã này sẽ hết hạn sau 5 phút.
      
      Trân trọng!
      `,
      'Mã OTP đặt lại mật khẩu'
    );

    return {
      message: 'Mã OTP đã được gửi đến email của bạn',
      success: true,
      data: null
    };
  }

  async verifyOtp(data: any): Promise<ResponseDto<any>> {
    const { email, otp } = data
    const emailRecord = await this.otpModel.findOne({ email: email });

    if (!emailRecord) {
      throw new BadRequestException('Mã OTP không hợp lệ');
    }
    const otpRecord: any = otp

    // Kiểm tra hết hạn
    if (new Date(otpRecord.exp) < new Date()) {
      await this.otpModel.deleteOne({ _id: emailRecord._id });
      throw new BadRequestException('Mã OTP đã hết hạn');
    }
    const otpSecret = 'mstOtpSecret';
    const token = this.jwtService.sign(
      { email, otp },
      { secret: otpSecret, expiresIn: '5m' },
    );
    return {
      message: 'Xác thực OTP thành công',
      success: true,
      data: { token }
    };
  }

  async verifyPassForget(email: string, newPassword: string, token: string): Promise<ResponseDto<any>> {
    const user = await this.userModel.findOne({ email });
    const otpSecret = 'mstOtpSecret';

    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }

    // Verify token và lấy thông tin
    let decodedToken;
    try {
      decodedToken = this.jwtService.verify(token, { secret: otpSecret });
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }

    // Kiểm tra email trong token có khớp với email được gửi lên
    if (decodedToken.email !== email) {
      throw new UnauthorizedException('Token không hợp lệ cho email này');
    }
    // Tìm và xóa OTP record
    const otpRecord = await this.otpModel.findOneAndDelete({
      email: decodedToken.email,
      otp: decodedToken.otp
    });
    if (!otpRecord) {
      throw new UnauthorizedException('OTP không tồn tại hoặc đã được sử dụng');
    }

    // Kiểm tra thời gian hết hạn của OTP
    if (new Date(otpRecord.exp) < new Date()) {
      throw new UnauthorizedException('OTP đã hết hạn');
    }

    // Hash và cập nhật mật khẩu mới
    const hashedPassword = await this.hashPassword(newPassword);
    await this.userModel.findByIdAndUpdate(user._id, { password: hashedPassword });

    return {
      message: 'Đặt lại mật khẩu thành công',
      success: true,
      data: null
    };
  }
  generateVerificationToken(email: string): string {
    return this.jwtService.sign({ email });
  }
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Hãy thử yêu cầu lại');
    }
  }
  async activateAccount(email: string) {
    await this.userModel.findOneAndUpdate({ email }, { isVerify: true });
    return {
      message: 'Khởi động tài khoản thành công',
      success: true,
      data: null
    };
  }
}