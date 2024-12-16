import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/core/services/store";

type OrderState = {
  order?: any;
  isLoading: boolean;
  qr: string;
  allOrder: []
  checkPaymentStatus: any;
  creditCardPaymentMethod: any;
  checkPaymentCreditCardStatus: any;
  orderById: any;

};

const initialState: OrderState = {
  order: {},
  isLoading: false,
  qr: '',
  allOrder: [],
  checkPaymentStatus: null,
  creditCardPaymentMethod: null,
  checkPaymentCreditCardStatus: null,
  orderById: null,
};

const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderById: (state: OrderState, { payload }: PayloadAction<any>) => {
      state.orderById = payload;
    },
    getCreditCardPayment: (
      state: any,
      { payload }: PayloadAction<any>
    ) => { },
    setCreditCardPayment: (
      state: any,
      { payload }: PayloadAction<any>
    ) => {
      state.creditCardPaymentMethod = payload;
    },

    //Check statuts credit card payment
    getStatusCreditCardPayment: (
      state: any,
      { payload }: PayloadAction<any>
    ) => { },
    setStatusCreditCardPayment: (
      state: any,
      { payload }: PayloadAction<any>
    ) => {
      state.checkPaymentCreditCardStatus = payload;
    },
    setLoading: (state: OrderState, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setAllOrder: (state: OrderState, { payload }: PayloadAction<any>) => {
      state.allOrder = payload;
    },
    getAllOrderById: (state: OrderState, { payload }: PayloadAction<any>) => { },
    getOrderById: (state: OrderState, { payload }: PayloadAction<any>) => { },
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
  creditPaymentMethod: (state: RootState) => state.order.creditCardPaymentMethod,
  checkPaymentCreditCardStatus: (state: RootState) => state.order.checkPaymentCreditCardStatus,
  orderById: (state: RootState) => state.order.orderById,
};
