import { createSlice,PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/core/services/store";

type CustomerState = {
  customer?: any;
};

const initialState: CustomerState = {
  customer: {}
};

const CustomerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    getCustomer: (state: CustomerState, { payload }: PayloadAction<any>) => {},
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
};
