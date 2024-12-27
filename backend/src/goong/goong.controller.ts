import { Controller, Get, Query } from '@nestjs/common';
import { GoongService } from './goong.service';

@Controller('goong')
export class GoongController {
  constructor(private readonly goongService: GoongService) {}

  @Get('location-suggestions')
  async getLocationSuggestions(@Query('address') address: string) {
    if (!address) {
      return { error: 'Vui lòng cung cấp từ khóa địa chỉ (address).' };
    }
    return this.goongService.getLocationSuggestions(address);
  }
  @Get('coordinates')
  async getCoordinates(@Query('placeId') placeId: string) {
    return this.goongService.getCoordinates(placeId);
  }
}
