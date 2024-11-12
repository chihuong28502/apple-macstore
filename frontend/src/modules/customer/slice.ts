import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/core/services/store";

type CustomerState = {
  customer?: any;
  isLoading: boolean;
  shipping: []
};

const initialState: CustomerState = {
  customer: {},
  isLoading: false,
  shipping: []
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
    setShipping: (state: CustomerState, { payload }: PayloadAction<any>) => {
      state.shipping = payload;
    },
    addShippingById: (state: CustomerState, { payload }: PayloadAction<any>) => {
    },
    getShippingByUser: (state: CustomerState, { payload }: PayloadAction<any>) => {
      state.shipping = payload;
    },
    deleteShipping: (state: CustomerState, { payload }: PayloadAction<any>) => {
    },
    updateShippingById: (state: CustomerState, { payload }: PayloadAction<any>) => {
    }
  },
});

const CustomerReducer = CustomerSlice.reducer;
export default CustomerReducer;

export const CustomerActions = CustomerSlice.actions;

export const CustomerSelectors = {
  customer: (state: RootState) => state.customer.customer,
  shipping: (state: RootState) => state.customer.shipping,
  isLoading: (state: RootState) => state.cart.isLoading,
};
