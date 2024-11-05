import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TasksService {
  constructor(private readonly httpService: HttpService) { }

  // Cron job chạy mỗi 10 phút
  @Cron('*/11 * * * *')
  async handleCron() {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://apple-macstore.onrender.com/categories'),
      );
    } catch (error) {
    }
  }
}
