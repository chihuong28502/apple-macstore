import AuthReducer from "@/modules/auth/slice";
import CustomerReducer from "@/modules/customer/slice";
import LoadingGlobalReducer from "@/modules/loading-global/slice";
import ProductReducer from "@/modules/product/slice";

import CartReducer from "@/modules/cart/slice";
import NotifyReducer from "@/modules/notify/slice";
import AppReducer from "../components/AppSlice";

export const reducers = {
  app: AppReducer,
  product: ProductReducer,
  auth: AuthReducer,
  loadingGlobal: LoadingGlobalReducer,
  customer: CustomerReducer,
  notify: NotifyReducer,
  cart: CartReducer,
};
