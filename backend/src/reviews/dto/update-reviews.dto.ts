import { IsOptional, IsNumber, IsMongoId, Min, Max } from 'class-validator';

export class UpdateReviewDto {
  @IsMongoId()
  @IsOptional()
  product_id?: string;  // ID của sản phẩm (có thể cập nhật)

  @IsMongoId()
  @IsOptional()
  user_id?: string;     // ID của người dùng (có thể cập nhật)

  @IsMongoId()
  @IsOptional()
  variant_id: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;      // Xếp hạng từ 1 đến 5 (có thể cập nhật)

  @IsOptional()
  review_text?: string; // Nội dung đánh giá (có thể cập nhật)

  @IsOptional()
  is_verified_purchase?: boolean; // Có phải là đơn hàng đã mua không (có thể cập nhật)
}