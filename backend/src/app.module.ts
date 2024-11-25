import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ChatModule } from './chat/chat.module';
import { JwtStrategy } from './common/guards/jwt/jwt.strategy';
import { CustomLogger } from './common/logger/custom.logger';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { UsersModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './taskSchedule/tasks.module';
import { NotifyModule } from './notify/notify.module';
import { CartModule } from './cart/cart.module';
import { RedisModule } from './redis/redis.module';
import { IntroductionModule } from './introduction/introduction.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
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
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '1d'),
        },
      }),
    }),
    TasksModule,
    UsersModule,
    ChatModule,
    AuthModule,
    RecommendationModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    NotifyModule,
    CartModule,
    IntroductionModule,
    RedisModule
  ],
  providers: [
    AppService,
    JwtStrategy,
    { provide: 'LoggerService', useClass: CustomLogger },
  ],
  controllers: [AppController],
})
export class AppModule { }
