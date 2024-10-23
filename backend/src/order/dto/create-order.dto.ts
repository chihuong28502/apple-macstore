export class CreateOrderDto {
  readonly userId: string;
  readonly products: {
    productId: string;
    customizations: {
      size: number;
      color: string;
      material: string;
      addName?: string;
      addLogo?: string;
    };
    quantity: number;
    price: number;
  }[];
  readonly totalPrice: number;
  readonly status: string;
  readonly shippingAddress: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  readonly paymentInfo: {
    method: string;
    transactionId?: string;
    status: string;
  };
}
