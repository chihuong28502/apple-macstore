import AuthReducer from "@/modules/auth/slice";
import CustomerReducer from "@/modules/customer/slice";
import LoadingGlobalReducer from "@/modules/loading-global/slice";
import ProductReducer from "@/modules/product/slice";
import { combineReducers } from "@reduxjs/toolkit";
import CartReducer from "@/modules/cart/slice";
import NotifyReducer from "@/modules/notify/slice";
import AppReducer from "../components/AppSlice";
import OrderReducer from "@/modules/order/slice";

export const reducers = combineReducers({
  app: AppReducer,
  product: ProductReducer,
  auth: AuthReducer,
  loadingGlobal: LoadingGlobalReducer,
  customer: CustomerReducer,
  notify: NotifyReducer,
  cart: CartReducer,
  order: OrderReducer,
});
