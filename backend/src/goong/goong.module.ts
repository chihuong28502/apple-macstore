import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoongController } from './goong.controller';
import { GoongService } from './goong.service';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';

@Global()
@Module({
  imports: [ConfigModule, RedisModule],
  controllers: [GoongController],
  providers: [GoongService, RedisService],
})
export class GoongModule { }
