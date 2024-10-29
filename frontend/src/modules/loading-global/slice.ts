import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "@/core/services/store";

type LoadingGlobalState = {
  isOpenLoadingGlobal: boolean;
};

const initialState: LoadingGlobalState = {
  isOpenLoadingGlobal: false,
};

const LoadingGlobalSlice = createSlice({
  name: "loadingGlobal",
  initialState,
  reducers: {
    hiddenLoadingGlobal: (state: LoadingGlobalState) => {
      state.isOpenLoadingGlobal = false;
    },
    showLoadingGlobal: (state: LoadingGlobalState) => {
      state.isOpenLoadingGlobal = true;
    },
  },
});

const LoadingGlobalReducer = LoadingGlobalSlice.reducer;
export default LoadingGlobalReducer;

export const LoadingGlobalActions = LoadingGlobalSlice.actions;

export const LoadingGlobalSelectors = {
  loadingGlobal: (state: RootState) => state.loadingGlobal.isOpenLoadingGlobal,
};
