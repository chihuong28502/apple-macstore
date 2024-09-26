import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  participants: Types.ObjectId[];

  @Prop({
    type: [
      {
        senderId: { type: Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  })
  messages: Record<string, any>[];

  @Prop({ type: Date })
  lastMessageAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
