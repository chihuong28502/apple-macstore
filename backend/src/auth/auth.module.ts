import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CartsGateway } from 'src/cart/cart.gateway';
import { CartService } from 'src/cart/cart.service';
import { Cart, CartSchema } from 'src/cart/schema/cart.schema';
import { JwtStrategy } from 'src/common/guards/jwt/jwt.strategy';
import { NotificationsGateway } from 'src/notify/notifications.gateway';
import { NotifyModule } from 'src/notify/notify.module';
import { NotifyService } from 'src/notify/notify.service';
import { Notify, NotifySchema } from 'src/notify/schema/notify.schema';
import { Admin, AdminSchema } from 'src/user/schema/admin.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { UsersModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookiesService } from './cookies.service';
import { RefreshToken, RefreshTokenSchema, } from './schema/refreshToken.schema';
import { CookieAge } from './utils/cookieAgeAuth.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: Notify.name, schema: NotifySchema },
      { name: Cart.name, schema: CartSchema },
      { name: Admin.name, schema: AdminSchema }
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
    UsersModule, NotifyModule,
  ],
  providers: [AuthService, JwtStrategy,
    CookiesService, CookieAge,
    NotifyService, NotificationsGateway, CartsGateway,
    CartService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }

