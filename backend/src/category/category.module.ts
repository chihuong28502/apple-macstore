import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from './schema/category.schema';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]), RedisModule],
  controllers: [CategoryController],
  providers: [CategoryService, RedisService],
  exports: [CategoryService, MongooseModule],
})
export class CategoryModule { }
