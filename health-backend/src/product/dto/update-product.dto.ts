export class UpdateProductDto {
  readonly name?: string;
  readonly description?: string;
  readonly basePrice?: number;  // Giá nhập
  readonly price?: number;  // Giá bán
  readonly categoryId?: string;
  readonly images?: string[];
  readonly tags?: string[];
  readonly customizations?: {
    colors?: string[];
    sizes?: number[];
    materials?: string[];
    personalizationOptions?: {
      addName?: boolean;
      addLogo?: boolean;
    };
  };
  readonly stock?: Record<string, number>;
}
