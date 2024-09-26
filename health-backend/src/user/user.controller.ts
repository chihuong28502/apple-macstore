import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard, RolesGuard) // Áp dụng guard ở cấp controller
@Roles('admin')
@Controller('admin')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // Endpoint để lấy danh sách tất cả người dùng
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Endpoint để tìm người dùng theo ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  // Endpoint để cập nhật thông tin người dùng theo ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  // Endpoint để xóa người dùng theo ID
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
