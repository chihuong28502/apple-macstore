import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotifyDocument = Notify & Document;

@Schema({ timestamps: true })
export class Notify {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: Types.ObjectId, ref: 'users', required: false })
  customer?: Types.ObjectId;

  @Prop({ default: false })
  isGlobal?: boolean;
}

export const NotifySchema = SchemaFactory.createForClass(Notify);
