import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ unique: true })
  otp: string;

  @Prop({ required: true })
  exp: string;

  @Prop({ required: true })
  email: string;


}

export const OtpSchema = SchemaFactory.createForClass(Otp);
