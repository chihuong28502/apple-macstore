import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type IntroductionDocument = Introduction & Document;

@Schema({ timestamps: true })
export class Introduction {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  isPublic: boolean;

  @Prop({ required: true })
  type: string;

  @Prop({ type: { image: String, publicId: String }, required: true })
  images: { image: string; publicId: string };


  @Prop({ required: true })
  description: string;
}

export const IntroductionSchema = SchemaFactory.createForClass(Introduction);
