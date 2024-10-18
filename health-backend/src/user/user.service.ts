import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseDto } from 'src/dtoRequest/return.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password -__v -createdAt').exec();
  }
  

  async findOne(id: string): Promise<ResponseDto> {
    const user = await this.userModel.findById(id)
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return {
      success: true,
      message: 'Lấy thông tin thành công',
      data: {
        user
      },
    };
  }

  // Cập nhật thông tin người dùng
  async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseDto> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return {
      success: true,
      message: 'Sửa thông tin thành công',
      data: {
        updatedUser,
      },
    };
  }

  // Xóa người dùng theo ID
  async remove(id: string): Promise<ResponseDto> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return {
      success: true,
      message: 'Xóa thành công',
    };
  }
}
