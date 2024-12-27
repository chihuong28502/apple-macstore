import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class GoongService {
  private readonly CACHE_TTL = 864000;
  constructor(
    private readonly redisService: RedisService,
    private configService: ConfigService,
  ) { }
  async getLocationSuggestions(address: string) {
    const cacheKey = `map_${address}`
    const url = `${this.configService.getOrThrow('API_URL_GOONG_MAP')}/Place/AutoComplete`;
    const api_key = this.configService.getOrThrow('API_KEY_GOONG_MAP');
    try {
      const cachedData = await this.redisService.getCache(cacheKey);
      if (cachedData) {
        console.log('🚀 ~ Cache hit:', cachedData);
        return {
          success: true,
          message: 'Lấy dữ liệu thành công',
          data: cachedData,
        };
      }
      const response = await axios.get(url, {
        params: {
          api_key: api_key,
          input: address,
        },
      });
      console.log("🚀 ~ GoongService ~ response.data:", response.data)
      await this.redisService.setCache(cacheKey, response.data, this.CACHE_TTL);
      return {
        success: true,
        message: 'Lấy dữ liệu thành công',
        data: response.data,
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  }
}
