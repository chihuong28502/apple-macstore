import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotifyService } from './notify.service';
import { NotifyController } from './notify.controller';
import { Notify, NotifySchema } from './schema/notify.schema';
import { NotificationsGateway } from './notifications.gateway';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notify.name, schema: NotifySchema }]),
    RedisModule
  ],
  providers: [NotifyService, NotificationsGateway, RedisService],
  controllers: [NotifyController],
  exports: [NotifyService],
})
export class NotifyModule { }
