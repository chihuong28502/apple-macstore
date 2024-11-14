import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { OrdersGateway } from './order.gateway';
import { OrderService } from './order.service';
import { Order, OrderSchema } from './schema/order.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Product, ProductSchema } from 'src/product/schema/product.schema';
import { Variant, VariantSchema } from 'src/product/schema/variants.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Order.name, schema: OrderSchema }
    , { name: User.name, schema: UserSchema },
    { name: Product.name, schema: ProductSchema },
    { name: Variant.name, schema: VariantSchema }])],
  controllers: [OrderController],
  providers: [OrderService, OrdersGateway],
  exports: [OrderService],
})
export class OrderModule { }
