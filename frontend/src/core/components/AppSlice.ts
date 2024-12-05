import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "@/core/services/store";

type AppState = {
  isLoading: boolean;
  isOpenModalCheckout: boolean;
  isOpenModalChangePassword: boolean;
};
const initialState: AppState = {
  isLoading: false,
  isOpenModalCheckout:false,
  isOpenModalChangePassword: false,
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

    //Show checkout  
    showModalCheckout: (state: AppState) => {
      state.isOpenModalCheckout = true;
    },
    hideModalCheckout: (state: AppState) => {
      state.isOpenModalCheckout = false;
    },

    //Show change password
    showModalChangePassword: (state: AppState) => {
      state.isOpenModalChangePassword = true;
    },

    hideModalChangePassword: (state: AppState) => {
      state.isOpenModalChangePassword = false;
    },

  },
});

const AppReducer = AppSlice.reducer;
export default AppReducer;

export const AppAction = AppSlice.actions;
export const AppSelector = {
  isLoading: (state: RootState) => state.app.isLoading,
  isOpenModalCheckout: (state: RootState) => state.app.isOpenModalCheckout,
  isOpenModalChangePassword: (state: RootState) => state.app.isOpenModalChangePassword,
};
