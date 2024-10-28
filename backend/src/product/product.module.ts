import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product, ProductSchema } from './schema/product.schema';
import { CategoryModule } from 'src/category/category.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CategoryModule 
  ],
  providers: [ProductService,CloudinaryService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule { }
