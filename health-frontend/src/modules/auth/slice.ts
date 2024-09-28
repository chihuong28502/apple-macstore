import { RootState } from "@/core/services/store";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type AuthState = {
  user?: any;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  
  isAuthenticated: false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state: AuthState, { payload }: PayloadAction<any>) => {},
    register: (state: AuthState, { payload }: PayloadAction<any>) => {},
    setUser: (state: AuthState, { payload }: PayloadAction<any>) => {
      state.user = payload;
      state.isAuthenticated = true;
    },
    setLoginInfo: (state: AuthState, { payload }: PayloadAction<any>) => {
      state.user = payload;
    },
    logout: (state: AuthState) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

const AuthReducer = AuthSlice.reducer;
export default AuthReducer;

export const AuthActions = AuthSlice.actions;

export const AuthSelectors = {
  user: (state: RootState) => state.auth.user,
  isAuthenticated: (state: RootState) => state.auth.isAuthenticated,
};
