import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/core/services/store";

type AuthState = {
  user?: any;
  refreshToken?: any;
  verifyEmailStatus: 'idle' | 'loading' | 'success' | 'error';
  verifyEmailError: string | null;
};

const initialState: AuthState = {
  user: null,
  refreshToken: "",
  verifyEmailStatus: 'idle',
  verifyEmailError: null,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    googleSignIn: (state: AuthState, { payload }: PayloadAction<any>) => { },
    login: (state: AuthState, { payload }: PayloadAction<any>) => { },
    register: (state: AuthState, { payload }: PayloadAction<any>) => { },
    setUser: (state: AuthState, { payload }: PayloadAction<any>) => {
      state.user = payload;
    },
    refreshToken: () => {
    },
    acceptEmail: (state: AuthState, { payload }: PayloadAction<Partial<any>>) => {
      state.verifyEmailStatus = 'loading';
      state.verifyEmailError = null;
    },
    acceptEmailSuccess: (state) => {
      state.verifyEmailStatus = 'success';
    },
    acceptEmailError: (state, action) => {
      state.verifyEmailStatus = 'error';
      state.verifyEmailError = action.payload;
    },
    getInfoUser: (state: AuthState, { payload }: PayloadAction<Partial<any>>) => {
    },
    changePassword: (state: AuthState, { payload }: PayloadAction<Partial<any>>) => {
    },
    logout: (state: AuthState, { payload }: PayloadAction<Partial<any>>) => {
      state.user = null;
    },
    verifyEmail: (state: AuthState, { payload }: PayloadAction<Partial<any>>) => {
    },
    verifyOtp: (state: AuthState, { payload }: PayloadAction<Partial<any>>) => {
    },
    verifyPassForget: (state: AuthState, { payload }: PayloadAction<Partial<any>>) => {
    },
  },
});

const AuthReducer = AuthSlice.reducer;
export default AuthReducer;

export const AuthActions = AuthSlice.actions;

export const AuthSelectors = {
  user: (state: RootState) => state.auth.user,
};
