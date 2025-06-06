import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateOrderDto } from './dto/create-order.dto';
import { SepayDto } from './dto/sepay.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Res() res: Response): Promise<Response> {
    const result = await this.orderService.create(createOrderDto);
    return res.status(result.success ? 201 : 400).json(result);
  }

  @Get()
  async findAll(@Res() res: Response): Promise<Response> {
    const result = await this.orderService.findAll();
    return res.status(result.success ? 200 : 500).json(result);
  }

  @Get('user/:id')
  async findAllOrderByCustomer(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    const result = await this.orderService.findAllOrderByCustomer(id);
    let statusCode = result.success ? 200 : result.message.includes('not found') ? 200 : 500;
    return res.status(statusCode).json(result);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @Res() res: Response): Promise<Response> {
    const result = await this.orderService.update(id, updateOrderDto);
    let statusCode = result.success ? 200 : 400;
    return res.status(statusCode).json(result);
  }

  @Put('update/status/:id')
  async updateStatus(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @Res() res: Response): Promise<Response> {
    const result = await this.orderService.updateStatus(id, updateOrderDto);
    let statusCode = result.success ? 200 : 400;
    return res.status(statusCode).json(result);
  }

  @Delete("delete/:id")
  async remove(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    const result = await this.orderService.remove(id);
    let statusCode = result.success ? 200 : result.message.includes('not found') ? 404 : 500;
    return res.status(statusCode).json(result);
  }

  //payment /seepay
  @Post("payment/sepay")
  async checkPayment(@Body() sePayDto: SepayDto, @Res() res: Response): Promise<Response> {
    const result = await this.orderService.checkPayment(sePayDto);
    return res.status(result.success ? 201 : 400).json(result);
  }
  @Get('/:orderId')
  async findOrderById(@Param('orderId') orderId: string, @Res() res: Response): Promise<Response> {
    const result = await this.orderService.findOrderById(orderId);
    return res.status(result.success ? 200 : 400).json(result);
  }

  @Post('payment/stripe/:orderId')
  async createStripePayment(
    @Param('orderId') orderId: string,
    @Res() res: Response
  ): Promise<Response> {
    const result = await this.orderService.createStripePayment(orderId);
    return res.status(result.success ? 200 : 400).json(result);
  }

  @Get('payment/check/:sessionId')
  async checkPaymentStatus(
    @Param('sessionId') sessionId: string,
    @Res() res: Response
  ): Promise<Response> {
    const result = await this.orderService.checkPaymentStatusStriper(sessionId);
    return res.status(result.success ? 200 : 400).json(result);
  }
}
