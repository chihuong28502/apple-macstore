import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/core/services/store";


type CartState = {
  _id?: string;
  cart?: any;
  isLoading: boolean;
  cartById?: any
};

const initialState: CartState = {
  cart: null,
  isLoading: false,
  cartById: null
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
      console.log("🚀 ~ id, item:", id, item)
      // Logic để thêm sản phẩm vào giỏ hàng
    },
    fetchCart: (state: CartState) => { state.isLoading = true; },
    setCart: (state: CartState, { payload }: PayloadAction<any[]>) => {
      state.cart = payload;
    },
    setCartById: (state: CartState, { payload }: PayloadAction<any[]>) => {
      state.cartById = payload;
    },
  },
});

const CartReducer = CartSlice.reducer;
export default CartReducer;

export const CartActions = CartSlice.actions;

export const CartSelectors = {
  cart: (state: RootState) => state.cart.cart,
  cartById: (state: RootState) => state.cart.cartById,
  isLoading: (state: RootState) => state.cart.isLoading,
};
