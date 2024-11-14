import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/core/services/store";

type OrderState = {
  order?: any;
  isLoading: boolean;
  qr: string;
};

const initialState: OrderState = {
  order: {},
  isLoading: false,
  qr: '',
};

const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setLoading: (state: OrderState, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    getOrder: (state: OrderState, { payload }: PayloadAction<any>) => { },
    setQr: (state: OrderState, { payload }: PayloadAction<any>) => {
      state.qr = payload;
    },
    addOrder: (state: OrderState, { payload }: PayloadAction<any>) => { },
    setOrder: (state: OrderState, { payload }: PayloadAction<any>) => {
      state.order = payload;
    },
    updateOrder: (state: OrderState, { payload }: PayloadAction<any>) => { },
    deleteOrder: (state: any, { payload: any }) => {
    },
  },
});

const OrderReducer = OrderSlice.reducer;
export default OrderReducer;

export const OrderActions = OrderSlice.actions;

export const OrderSelectors = {
  order: (state: RootState) => state.order.order,
  qr: (state: RootState) => state.order.qr,
  isLoading: (state: RootState) => state.order.isLoading,
};
