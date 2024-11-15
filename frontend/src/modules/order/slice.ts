import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/core/services/store";

type OrderState = {
  order?: any;
  isLoading: boolean;
  qr: string;
  allOrder: []
};

const initialState: OrderState = {
  order: {},
  isLoading: false,
  qr: '',
  allOrder: []
};

const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setLoading: (state: OrderState, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setAllOrder: (state: OrderState, { payload }: PayloadAction<any>) => {
      state.allOrder = payload;
    },
    getAllOrderById: (state: OrderState, { payload }: PayloadAction<any>) => { },
    setQr: (state: OrderState, { payload }: PayloadAction<any>) => {
      state.qr = payload;
    },
    addOrder: (state: OrderState, { payload }: PayloadAction<any>) => { },
    setOrder: (state: OrderState, { payload }: PayloadAction<any>) => {
      state.order = payload;
    },
    updateOrder: (state: OrderState, { payload }: PayloadAction<any>) => { },
    updateStatus: (state: any, { payload }: PayloadAction<any>) => { },
    deleteOrder: (state: any, { payload: any }) => {
    },
  },
});

const OrderReducer = OrderSlice.reducer;
export default OrderReducer;

export const OrderActions = OrderSlice.actions;

export const OrderSelectors = {
  order: (state: RootState) => state.order.order,
  allOrder: (state: RootState) => state.order.allOrder,
  qr: (state: RootState) => state.order.qr,
  isLoading: (state: RootState) => state.order.isLoading,
};
