export class CreateProductDto {
  name?: string;  // Tên sản phẩm
  description?: string;  // Mô tả sản phẩm
  price?: number;  // Giá bán
  categoryId?: string;  // ID danh mục sản phẩm
  images?: { image?: string; publicId?: string; _id?: string }[];  // URL hình ảnh sản phẩm
  tags?: string[];  // Thẻ tìm kiếm
  specifications?: {
    models?: string[];  // Dòng sản phẩm
    storageOptions?: string[];  // Các tùy chọn dung lượng
    ramOptions?: string[];  // Các tùy chọn RAM
    colors?: string[];  // Các màu sắc
  };  // Thông số kỹ thuật
  isPublic?: boolean;
  reviewsCount?: number;  // Số lượng đánh giá
  averageRating?: number;  // Đánh giá trung bình
}
