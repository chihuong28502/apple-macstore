import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class EmailService {
  private transporter;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,

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

  async sendVerificationEmail(email: string, verificationUrl: string) {

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your email',
      html: `
        <p>Welcome! Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
