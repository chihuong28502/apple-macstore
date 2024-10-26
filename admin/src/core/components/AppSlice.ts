import { RootState } from "@/core/services/store";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type AppState = {
  isLoading: boolean;
};
const initialState: AppState = {
  isLoading: false,
};

const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    showLoading: (state: AppState) => {
      state.isLoading = true;
    },
    hideLoading: (state: AppState) => {
      state.isLoading = false;
    },
  },
});

const AppReducer = AppSlice.reducer;
export default AppReducer;

export const AppAction = AppSlice.actions;
export const AppSelector = {
  isLoading: (state: RootState) => state.app.isLoading,
};
