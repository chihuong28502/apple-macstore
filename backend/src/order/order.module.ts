import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { OrdersGateway } from './order.gateway';
import { OrderService } from './order.service';
import { Order, OrderSchema } from './schema/order.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Order.name, schema: OrderSchema }
    , { name: User.name, schema: UserSchema }])],
  controllers: [OrderController],
  providers: [OrderService, OrdersGateway],
  exports: [OrderService],
})
export class OrderModule { }
