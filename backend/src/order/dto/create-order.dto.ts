export class CreateOrderDto {
  readonly userId: string;  // ID người dùng
  readonly items: {
    productId: string;       // ID sản phẩm
    variantId: string;       // ID variant của sản phẩm
    quantity: number;        // Số lượng sản phẩm
    price: number;           // Giá của sản phẩm
    stock: number;           // Số lượng tồn kho ban đầu của sản phẩm
    availableStock: number;  // Số lượng tồn kho có sẵn (sau khi cập nhật)
    lockUntil?: Date;        // Thời gian khóa variant, nếu có
  }[];                       // Danh sách các sản phẩm trong đơn hàng
  readonly totalPrice: number;  // Tổng giá trị đơn hàng
  readonly taxAmount: number;  // Tổng giá trị đơn hàng
  readonly status: string;      // Trạng thái đơn hàng (pending, completed, etc.)
  readonly shippingAddress: {
    street: string;    // Địa chỉ đường
    city: string;      // Thành phố
    state?: string;    // Tỉnh/Thành (tùy chọn)
    postalCode: string;  // Mã bưu điện
    country: string;   // Quốc gia
  };
}
