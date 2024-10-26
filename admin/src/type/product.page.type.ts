// types.ts
export namespace ProductPage {
  export interface Category {
    _id: string;
    name: string;
  }

  export interface Product {
    _id: string;
    name: string;
    price: number;
  }

  export interface PriceRange {
    id: number;
    label: string;
    min: number;
    max: number;
  }

  export interface BreadcrumbNavProps {
    onCategoryChange: (categoryId: string) => void; // Hàm callback để thay đổi danh mục
    selectedCategory: string;
    categories: Category[];
    loading: boolean;
  }

  export interface Category {
    _id: string;
    name: string;
    parentCategoryId: string | null;
  }

  export interface CategoryFilterProps {
    onAddCategory?: any
    categories: Category[]; // Mảng các danh mục (Category)
    selectedCategory: string; // Danh mục đang được chọn
    onCategoryChange: (categoryId: string) => void; // Hàm callback để thay đổi danh mục
    loading: boolean; // Trạng thái loading
  }

  export interface PriceFilterProps {
    priceRanges: PriceRange[];
    selectedRangeId: number | null;
    onPriceChange: (range: PriceRange) => void;
    loading: boolean;
  }

  export interface ProductGridProps {
    onAddProduct?:any
    categories?: Category[]
    products: Product[];
    items?: number;
    loading: boolean;
  }

  export interface FetchProductsParams {
    page: number;
    limit: number;
    minPrice: number;
    maxPrice: number;
    categoryId?: string;
  }
}
