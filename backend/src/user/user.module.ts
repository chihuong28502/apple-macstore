import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Admin, AdminSchema } from './schema/admin.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UsersModule { }
