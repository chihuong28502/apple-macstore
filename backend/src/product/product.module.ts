import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from 'nestjs-redis';
import { CategoryModule } from 'src/category/category.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RedisService } from 'src/redis/redis.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product, ProductSchema } from './schema/product.schema';
import { Variant, VariantSchema } from './schema/variants.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Variant.name, schema: VariantSchema }

    ]),
    CategoryModule,
    RedisModule
  ],
  providers: [ProductService, CloudinaryService, RedisService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule { }
