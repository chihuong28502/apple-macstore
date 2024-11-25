import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';
import { IntroductionController } from './introduction.controller';
import { IntroductionService } from './introduction.service';
import { Introduction, IntroductionSchema } from './schema/introduction.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Introduction.name, schema: IntroductionSchema }]), RedisModule],
  controllers: [IntroductionController],
  providers: [IntroductionService, RedisService, CloudinaryService],
  exports: [IntroductionService, MongooseModule],
})
export class IntroductionModule { }
