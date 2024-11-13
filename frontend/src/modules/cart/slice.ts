import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/core/services/store";


type CartState = {
  _id?: string;
  cart?: any;
  isLoading: boolean;
  cartById?: any;
  cartSelected: any
  priceCheckout: any
  shippingSelectedId: any;
};

const initialState: CartState = {
  cart: null,
  isLoading: false,
  cartById: null,
  cartSelected: [],
  priceCheckout: {
    selectedTotal: 0,
    taxAmount: 0,
  },
  shippingSelectedId: ""
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    fetchCartById: (
      state: CartState,
      { payload }: PayloadAction<string>
    ) => {
      state.isLoading = true;
    },
    setLoading: (state: CartState, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    addProductToCart(state, action: PayloadAction<{ id: string; item: any }>) {
      const { id, item } = action.payload;
    },
    updateCartItemQuantity(
      state,
      action: PayloadAction<{ userId: string; productId: string; variantId: string; quantity: number }>
    ) {
      const { productId, variantId, quantity } = action.payload;
      const item = state.cart.items.find(
        (item: any) => item.productId === productId && item.variantId === variantId
      );

      if (item) {
        item.quantity = quantity;
      }
    },
    fetchCart: (state: CartState) => { state.isLoading = true; },
    setCart: (state: CartState, { payload }: PayloadAction<any[]>) => {
      state.cart = payload;
    },
    setCartById: (state: CartState, { payload }: PayloadAction<any[]>) => {
      state.cartById = payload;
    },
    deleteItemCard: (state: CartState, { payload }: PayloadAction<{ userId: string; productId: string; variantId: string; }>) => {
      // Ensure state.cartById exists before trying to filter items
      if (state.cartById && state.cartById.items) {
        state.cartById.items = state.cartById.items.filter(
          (item: any) =>
            item.productId !== payload.productId || item.variantId !== payload.variantId
        );
      }
    },
    setCartSelected: (state: CartState, { payload }: PayloadAction<any[]>) => {
      state.cartSelected = payload;
    },
    setShippingSelectedId: (state: CartState, { payload }: any) => {
      state.shippingSelectedId = payload;
    },
    setPriceCheckout: (state: any, { payload }: any) => {
      console.log("🚀 ~ payload:", payload);
      if (typeof state.priceCheckout !== 'object') {
        // Nếu priceCheckout không phải là đối tượng, khởi tạo lại
        state.priceCheckout = { selectedTotal: 0, taxAmount: 0 };
      }
      // Cập nhật giá trị của priceCheckout
      state.priceCheckout.selectedTotal = payload.selectedTotal;
      state.priceCheckout.taxAmount = payload.taxAmount;
    }
  },
});

const CartReducer = CartSlice.reducer;
export default CartReducer;
export const CartActions = CartSlice.actions;
export const CartSelectors = {
  cart: (state: RootState) => state.cart.cart,
  cartById: (state: RootState) => state.cart.cartById,
  priceCheckout: (state: RootState) => state.cart.priceCheckout,
  cartSelected: (state: RootState) => state.cart.cartSelected,
  isLoading: (state: RootState) => state.cart.isLoading,
  shippingSelectedId: (state: RootState) => state.cart.shippingSelectedId,
};
