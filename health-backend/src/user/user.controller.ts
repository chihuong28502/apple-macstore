import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import { UserService } from './user.service';
import { ResponseDto } from 'src/dtoRequest/return.dto';

@UseGuards(JwtAuthGuard, RolesGuard) // Áp dụng guard ở cấp controller
@Roles('admin')
@Controller('admin')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Get()
  async findAll(): Promise<any> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseDto> {
    if (!id) {
      throw new Error('ID is required');
    }
    return this.userService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto> {
    if (!id) {
      throw new Error('ID is required');
    }
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResponseDto> {
    if (!id) {
      throw new Error('ID is required');
    }
    return this.userService.remove(id);
  }
}
