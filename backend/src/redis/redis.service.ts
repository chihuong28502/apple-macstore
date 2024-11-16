import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) { }

  async getCache<T>(key: string): Promise<T | null> {
    const cachedData = await this.redisClient.get(key);
    return cachedData ? JSON.parse(cachedData) : undefined;
  }

  async setCache<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.redisClient.setex(key, ttl, JSON.stringify(value));
  }

  async clearCache(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
