import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
  code: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['customer', 'admin', 'support'] })
  role: string;

  @Prop({
    type: {
      firstName: { type: String },
      lastName: { type: String },
      phoneNumber: { type: String },
      shoeSize: { type: Number },
      activityGoal: { type: String }
    }
  })
  profile: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);
