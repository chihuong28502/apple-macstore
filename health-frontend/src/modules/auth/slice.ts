import { RootState } from "@/core/services/store";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type AuthState = {
  user?: any;
};

const initialState: AuthState = {
  user: null,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state: AuthState, { payload }: PayloadAction<any>) => { },
    register: (state: AuthState, { payload }: PayloadAction<any>) => { },
    setUser: (state: AuthState, { payload }: PayloadAction<any>) => {
      console.log("🚀 ~ payload:", payload)
      state.user = payload;
    },
    setLoginInfo: (state: AuthState, { payload }: PayloadAction<any>) => {
      state.user = payload;
    },
    getInfoUser: (state: AuthState, { payload }: PayloadAction<Partial<any>>) => {
     },

    logout: (state: AuthState) => {
      state.user = null;
    },
  },
});

const AuthReducer = AuthSlice.reducer;
export default AuthReducer;

export const AuthActions = AuthSlice.actions;

export const AuthSelectors = {
  user: (state: RootState) => state.auth.user,
};
