export class CreateOrderDto {
  readonly userId: string;
  readonly products: {
    productId: string;
    quantity: number;
    variantId: string;
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
}
