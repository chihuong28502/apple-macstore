import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotifyService } from './notify.service';
import { NotifyController } from './notify.controller';
import { Notify, NotifySchema } from './schema/notify.schema';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notify.name, schema: NotifySchema }]),
  ],
  providers: [NotifyService,NotificationsGateway],
  controllers: [NotifyController],
  exports: [NotifyService],
})
export class NotifyModule {}
