import { Types } from 'mongoose';

export type CartItem = {
  productId: Types.ObjectId;
  stockId: Types.ObjectId;
  quantity: number;
};
