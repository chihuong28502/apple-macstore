export class CreateProductDto {
  name: string;  // Tên sản phẩm
  description: string;  // Mô tả sản phẩm
  basePrice: number;  // Giá gốc
  price: number;  // Giá bán
  categoryId: string;  // ID danh mục sản phẩm
  images?:any;  // URL hình ảnh sản phẩm
  tags: string[];  // Thẻ tìm kiếm

  specifications: {
    models: string[];  // Dòng sản phẩm
    storageOptions: string[];  // Các tùy chọn dung lượng
    ramOptions: string[];  // Các tùy chọn RAM
    colors: string[];  // Các màu sắc
  };  // Thông số kỹ thuật

  reviewsCount?: number;  // Số lượng đánh giá
  averageRating?: number;  // Đánh giá trung bình

  stock: Map<string, Map<string, number>>;  // Tồn kho

  createdAt?: Date;  // Thời gian tạo
  updatedAt?: Date;  // Thời gian cập nhật
}
