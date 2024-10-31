import { Controller, Get, Post, Body, Param, Patch, Delete, Res } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { Notify } from './schema/notify.schema';
import { Response } from 'express';

@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @Post()
  async create(@Res() res: Response, @Body() createNotifyDto: Partial<Notify>) {
    const result = await this.notifyService.createNotify(createNotifyDto);
    const statusCode = result.success ? 201 : 500;
    return res.status(statusCode).json(result);
  }


  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const result = await this.notifyService.findNotifyByUserId(id);
    const statusCode = result.success ? 200 : result.message.includes('not found') ? 404 : 500;
    return res.status(statusCode).json(result);
  }

  @Patch(':id')
  async update(@Res() res: Response, @Param('id') id: string, @Body() updateNotifyDto: Partial<Notify>) {
    const result = await this.notifyService.updateNotify(id, updateNotifyDto);
    const statusCode = result.success ? 200 : result.message.includes('not found') ? 404 : 500;
    return res.status(statusCode).json(result);
  }

  @Delete(':id')
  async delete(@Res() res: Response, @Param('id') id: string) {
    const result = await this.notifyService.deleteNotify(id);
    const statusCode = result.success ? 200 : result.message.includes('not found') ? 404 : 500;
    return res.status(statusCode).json(result);
  }
}
