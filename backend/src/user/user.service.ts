import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseDto } from 'src/utils/dto/response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  // Fetch all users excluding sensitive fields
  async findAll(): Promise<ResponseDto<User[]>> {
    try {
      const users = await this.userModel
        .find()
        .select('-password -__v -createdAt') // Exclude password, version, and createdAt
        .exec();

      return {
        success: true,
        message: 'Lấy danh sách người dùng thành công',
        data: users,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Lấy danh sách người dùng thất bại',
        data: null,
      };
    }
  }

  // Fetch a single user by ID, excluding sensitive fields
  async findOne(id: string): Promise<ResponseDto<User>> {
    try {
      const user = await this.userModel.findById(id).select('-password -__v -createdAt').exec();
      if (!user) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
      return {
        success: true,
        message: 'Lấy thông tin người dùng thành công',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Lấy thông tin người dùng thất bại',
        data: null,
      };
    }
  }

  // Update user information and return the updated user, excluding sensitive fields
  async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseDto<User>> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .select('-password -__v -createdAt') // Exclude password, version, and createdAt
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
      return {
        success: true,
        message: 'Sửa thông tin người dùng thành công',
        data: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Cập nhật thông tin người dùng thất bại',
        data: null,
      };
    }
  }

  // Delete user by ID and return a success message
  async remove(id: string): Promise<ResponseDto<User>> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      if (!deletedUser) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
      return {
        success: true,
        message: 'Xóa người dùng thành công',
        data: 1, // Optionally return deleted user data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Xóa người dùng thất bại',
        data: null,
      };
    }
  }
}
