import { RootState } from "@/core/services/store";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ProductState = {
  product?: any;
  productList: any[];
  totalProducts: number; // Tổng số sản phẩm cho phân trang
  isLoading: boolean;
  categories: any[];
  listCategories: any[],

};

const initialState: ProductState = {
  product: null,
  categories: [],
  listCategories: [],
  productList: [],
  totalProducts: 0, 
  isLoading: false,
};

const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    createProduct: (state: ProductState, { payload }: PayloadAction<any>) => { },
    fetchProductById: (
      state: ProductState,
      { payload }: PayloadAction<string>
    ) => {
      state.isLoading = true;
    },
    // Hàm lấy dữ liệu sản phẩm có phân trang và category
    fetchPaginatedProducts: (
      state: ProductState,
      {
        payload,
      }: PayloadAction<{ page: number; limit: number; categoryId?:  string , minPrice?: number, maxPrice?: number }>
    ) => {
      state.isLoading = true;
    },

    setProduct: (state: ProductState, { payload }: PayloadAction<any>) => {
      state.product = payload;
    },

    setProductList: (
      state: ProductState,
      { payload }: PayloadAction<any[]>
    ) => {
      state.productList = payload;
    },

    setTotalProducts: (
      state: ProductState,
      { payload }: PayloadAction<number>
    ) => {
      state.totalProducts = payload;
    },

    updateProduct: (state: ProductState, { payload }: PayloadAction<any>) => { },
    deleteProduct: (
      state: ProductState,
      { payload }: PayloadAction<string>
    ) => { },

    setLoading: (state: ProductState, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    fetchCategories: (state: ProductState) => { state.isLoading = true; },
    setCategories: (state: ProductState, { payload }: PayloadAction<any[]>) => {
      state.categories = payload;
    },
  },
});

const ProductReducer = ProductSlice.reducer;
export default ProductReducer;

export const ProductActions = ProductSlice.actions;

export const ProductSelectors = {
  product: (state: RootState) => state.product.product,
  productList: (state: RootState) => state.product.productList,
  totalProducts: (state: RootState) => state.product.totalProducts,
  isLoading: (state: RootState) => state.product.isLoading,
  categories: (state: RootState) => state.product.categories,
};
