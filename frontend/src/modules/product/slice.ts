import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/core/services/store";

type ProductState = {
  _id?: string;
  product?: any;
  productList: any[];
  totalProducts: number; // Tổng số sản phẩm cho phân trang
  isLoading: boolean;
  categories: any[];
  listCategories: any[],
  isLoadingProducts: boolean;
  isLoadingCategories: boolean;
  isLoadingProductById: boolean;
};

const initialState: ProductState = {
  product: null,
  categories: [],
  listCategories: [],
  productList: [],
  totalProducts: 0,
  isLoading: false,
  isLoadingProducts: false, // Loading cho product
  isLoadingProductById: false, // Loading cho product
  isLoadingCategories: false,
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
      state.isLoadingProductById = true;
    },
    fetchPaginatedProducts: (
      state: ProductState,
      {
        payload,
      }: PayloadAction<{ page: number; limit: number; categoryId?: string, minPrice?: number, maxPrice?: number }>
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

    setLoading: (state: ProductState, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setLoadingCategories: (state: ProductState, { payload }: PayloadAction<boolean>) => {
      state.isLoadingCategories = payload;
    },
    setLoadingProducts: (state: ProductState, { payload }: PayloadAction<boolean>) => {
      state.isLoadingProducts = payload;
    },
    setLoadingProductById: (state: ProductState, { payload }: PayloadAction<boolean>) => {
      state.isLoadingProductById = payload;
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
  isLoadingProducts: (state: RootState) => state.product.isLoadingProducts,
  isLoadingCategories: (state: RootState) => state.product.isLoadingCategories,
  isLoadingProductById: (state: RootState) => state.product.isLoadingProductById,
  categories: (state: RootState) => state.product.categories,
};
