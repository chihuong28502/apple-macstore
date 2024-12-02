import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartsGateway } from 'src/cart/cart.gateway';
import { Cart, CartSchema } from 'src/cart/schema/cart.schema';
import { Product, ProductSchema } from 'src/product/schema/product.schema';
import { Variant, VariantSchema } from 'src/product/schema/variants.schema';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { OrderController } from './order.controller';
import { OrdersGateway } from './order.gateway';
import { OrderService } from './order.service';
import { Order, OrderSchema } from './schema/order.schema';
import { Notify, NotifySchema } from 'src/notify/schema/notify.schema';
import { NotifyService } from 'src/notify/notify.service';
import { NotificationsGateway } from 'src/notify/notifications.gateway';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Order.name, schema: OrderSchema },
    { name: User.name, schema: UserSchema },
    { name: Cart.name, schema: CartSchema },
    { name: Product.name, schema: ProductSchema },
    { name: Variant.name, schema: VariantSchema },
    { name: Notify.name, schema: NotifySchema },


  ]),
    CartsGateway,
    RedisModule
  ],
  controllers: [OrderController],
  providers: [
    OrderService, OrdersGateway,
    CartsGateway, RedisService,
    NotifyService, NotificationsGateway
  ],
  exports: [OrderService],
})
export class OrderModule { }
