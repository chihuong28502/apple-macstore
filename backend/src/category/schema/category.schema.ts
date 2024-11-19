import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string; 

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', default: null })
  parentCategoryId: string | null;  

  @Prop([String])
  breadcrumbs: string[]; 

}

export const CategorySchema = SchemaFactory.createForClass(Category);
