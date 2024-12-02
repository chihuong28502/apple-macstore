import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from 'src/redis/redis.module';
import { ReviewsController } from './review.controller';
import { ReviewsService } from './review.service';
import { ReviewsGateway } from './reviews.gateway';
import { Review, ReviewSchema } from './schema/review.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Product, ProductSchema } from 'src/product/schema/product.schema';
import { Order, OrderSchema } from 'src/order/schema/order.schema';
import { Variant, VariantSchema } from 'src/product/schema/variants.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Variant.name, schema: VariantSchema },
    ]),
    RedisModule,
  ],
  providers: [ReviewsService, ReviewsGateway],
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule { }