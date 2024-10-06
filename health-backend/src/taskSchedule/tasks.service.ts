import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TasksService {
  constructor(private readonly httpService: HttpService) {}

  // Cron job chạy mỗi 10 phút
  @Cron('*/11 * * * *')
  async handleCron() {
    console.log('Cron job is running every 10 minutes.');

    // Gọi API
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://health-yov6.onrender.com/categories'),
      );
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error calling API:', error);
    }
  }
}
