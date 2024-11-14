import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/product/schema/product.schema';
import { Variant, VariantSchema } from 'src/product/schema/variants.schema';
import { Order, OrderSchema } from 'src/order/schema/order.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Product.name, schema: ProductSchema },
    { name: Order.name, schema: OrderSchema },
    { name: Variant.name, schema: VariantSchema },

  ]), HttpModule],
  providers: [TasksService],
})
export class TasksModule { }
