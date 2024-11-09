import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/core/services/store";

type ProductState = {
  _id?: string;
  product?: any;
  productList: any[];
  totalProducts: number; // Tổng số sản phẩm cho phân trang
  isLoading: boolean;
  variant: any[],


};

const initialState: ProductState = {
  product: null,
  productList: [],
  variant: [],
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

    updateProduct: (state: ProductState, { payload }: PayloadAction<any>) => {
    },
    deleteProduct: (state: any, { payload: any }) => {
    },
    setLoading: (state: ProductState, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },

    //VARIANT
    createVariantByProduct: (state: any, { payload }: PayloadAction<any>) => { },
    fetchVariantByProductId: (
      state: any,
      { payload }: PayloadAction<string>
    ) => {
      state.isLoading = true;
    },
    setVariant: (state: any, { payload }: PayloadAction<any>) => {
      state.variant = payload.variants;
    },
    updateVariant: (state: any, { payload }: PayloadAction<any>) => {
    },
    deleteVariant: (state: any, { payload: any }) => {
    },
  },
});

const ProductReducer = ProductSlice.reducer;
export default ProductReducer;

export const ProductActions = ProductSlice.actions;

export const ProductSelectors = {
  product: (state: RootState) => state.product.product,
  variant: (state: RootState) => state.product.variant,
  productList: (state: RootState) => state.product.productList,
  totalProducts: (state: RootState) => state.product.totalProducts,
  isLoading: (state: RootState) => state.product.isLoading,
};
