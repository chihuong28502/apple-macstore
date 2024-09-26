import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { UsersModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { CategoryModule } from './category/category.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './guards/jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
      isGlobal: true, // Đảm bảo biến môi trường có thể sử dụng trong toàn bộ ứng dụng
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), // Lấy URI MongoDB từ file .env
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Lấy giá trị từ biến môi trường
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '1d'),
        },
      }),
    }),
    UsersModule,
    ChatModule,
    AuthModule,
    RecommendationModule,
    CategoryModule,
    ProductModule,
    OrderModule,
  ],
  providers: [AppService, JwtStrategy],
  controllers: [AppController],
})
export class AppModule {}
