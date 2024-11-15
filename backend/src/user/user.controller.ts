import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RulesGuard } from 'src/common/guards/auth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt/jwt-auth.guard';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import { UserService } from './user.service';

@Controller('user')

@UseGuards(JwtAuthGuard, RulesGuard)
@Roles('admin')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Get()
  async findAll(): Promise<any> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseDto<User>> {
    if (!id) {
      throw new Error('ID is required');
    }
    return this.userService.findOne(id);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto<User>> {
    if (!id) {
      throw new Error('ID is required');
    }
    return this.userService.update(id, updateUserDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string): Promise<ResponseDto<User>> {
    if (!id) {
      throw new Error('ID is required');
    }
    return this.userService.remove(id);
  }

  // SHIPPING
  @Roles('customer')
  @Post('shipping/:id')
  async addShipping(
    @Param('id') userId: string,
    @Body() shippingInfo: any,
  ): Promise<ResponseDto<any>> {
    return this.userService.addShipping(userId, shippingInfo);
  }

  @Roles('customer')
  @Put(':userId/shipping/:shippingId')
  async updateShipping(
    @Param('userId') userId: string,
    @Param('shippingId') shippingId: string,
    @Body() shippingInfo: any,
  ): Promise<ResponseDto<any>> {
    return this.userService.updateShipping(userId, shippingId, shippingInfo);
  }

  @Roles('customer')
  @Delete(':userId/shipping/:shippingId')
  async deleteShipping(
    @Param('userId') userId: string,
    @Param('shippingId') shippingId: string,
  ): Promise<ResponseDto<any>> {
    return this.userService.deleteShipping(userId, shippingId);
  }

  @Roles('customer')
  @Get(':id/shipping')
  async getAllShipping(@Param('id') userId: string): Promise<ResponseDto<any[]>> {
    return this.userService.getAllShipping(userId);
  }
}
