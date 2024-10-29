import { createSlice,PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/core/services/store";


type CategoryState = {
  _id?: string;
  categories?: any;
  isLoading: boolean;
  categoryById?: any
};

const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  categoryById: null
};

const CategorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    createCategory: (state: CategoryState, { payload }: PayloadAction<any>) => {
    },
    fetchCategoryById: (
      state: CategoryState,
      { payload }: PayloadAction<string>
    ) => {
      state.isLoading = true;
    },
    updateCategory: (state: CategoryState, { payload }: PayloadAction<any>) => { },
    deleteCategory: (state: any, { payload: any }) => {
    },

    setLoading: (state: CategoryState, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    fetchCategories: (state: CategoryState) => { state.isLoading = true; },
    setCategories: (state: CategoryState, { payload }: PayloadAction<any[]>) => {
      state.categories = payload;
    },
    setCategoryById: (state: CategoryState, { payload }: PayloadAction<any[]>) => {
      state.categoryById = payload;
    },
  },
});

const CategoryReducer = CategorySlice.reducer;
export default CategoryReducer;

export const CategoryActions = CategorySlice.actions;

export const CategorySelectors = {
  categories: (state: RootState) => state.category.categories,
  categoryById: (state: RootState) => state.category.categoryById,
  isLoading: (state: RootState) => state.category.isLoading,
};
