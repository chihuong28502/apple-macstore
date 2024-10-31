import { createSlice,PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/core/services/store";


type NotifyState = {
  _id?: string;
  notify?: any;
  isLoading: boolean;
  notifyById?: any
};

const initialState: NotifyState = {
  notify: null,
  isLoading: false,
  notifyById: null
};

const NotifySlice = createSlice({
  name: "notify",
  initialState,
  reducers: {
    fetchNotifyById: (
      state: NotifyState,
      { payload }: PayloadAction<string>
    ) => {
      state.isLoading = true;
    },
    setLoading: (state: NotifyState, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    fetchNotify: (state: NotifyState) => { state.isLoading = true; },
    setNotify: (state: NotifyState, { payload }: PayloadAction<any[]>) => {
      state.notify = payload;
    },
    setNotifyById: (state: NotifyState, { payload }: PayloadAction<any[]>) => {
      state.notifyById = payload;
    },
  },
});

const NotifyReducer = NotifySlice.reducer;
export default NotifyReducer;

export const NotifyActions = NotifySlice.actions;

export const NotifySelectors = {
  notify: (state: RootState) => state.notify.notify,
  notifyById: (state: RootState) => state.notify.notifyById,
  isLoading: (state: RootState) => state.notify.isLoading,
};
