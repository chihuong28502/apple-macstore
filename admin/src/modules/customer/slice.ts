import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/core/services/store";

type CustomerState = {
  customer?: any; isLoading: boolean;
};

const initialState: CustomerState = {
  customer: {}, isLoading: false
};

const CustomerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setLoading: (state: CustomerState, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    getCustomer: (state: CustomerState, { payload }: PayloadAction<any>) => { },
    setCustomer: (state: CustomerState, { payload }: PayloadAction<any>) => {
      state.customer = payload;
    },
  },
});

const CustomerReducer = CustomerSlice.reducer;
export default CustomerReducer;

export const CustomerActions = CustomerSlice.actions;

export const CustomerSelectors = {
  customer: (state: RootState) => state.customer.customer,
  isLoading: (state: RootState) => state.customer.isLoading,
};
