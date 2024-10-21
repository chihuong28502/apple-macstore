import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { UsersModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/common/guards/jwt/jwt.strategy';
import { RefreshToken, RefreshTokenSchema, } from './schema/refreshToken.schema';
import { CookiesService } from './cookies.service';
import { CookieAge } from './utils/cookieAgeAuth.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema }
    ]), 
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy,CookiesService,CookieAge],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }

