export class UpdateOrderDto {
  readonly userId?: string;
  readonly code?: string;
  readonly qr?: string;
  readonly items?: {
    productId: string;
    variantId: string;
    quantity: number;
    price: number;
    productName: string;
    productDescription: string;
    productImages: string[]; // Mảng chứa các URL hình ảnh sản phẩm
    color: string;
    ram: string;
    ssd: string;
    stock: number;
  }[];
  readonly price?: number;
  readonly taxAmount?: number;
  readonly totalPrice?: number;
  readonly status?: string;
  readonly shippingId?: string;
  readonly shippingFee?: number;
  readonly lockUntil?: Date;
  readonly updatedAt?: Date;
  readonly createdAt?: Date;
  readonly shippingAddress?: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  readonly paymentInfo?: {
    method: string;
    transactionId?: string;
    status: string;
  };
}
