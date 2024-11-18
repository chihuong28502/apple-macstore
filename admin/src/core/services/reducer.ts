import AuthReducer from "@/modules/auth/slice";
import CategoryReducer from "@/modules/category/slice";
import CustomerReducer from "@/modules/customer/slice";
import LoadingGlobalReducer from "@/modules/loading-global/slice";
import ProductReducer from "@/modules/product/slice";

import AppReducer from "../components/AppSlice";
import OrderReducer from "@/modules/order/slice";

export const reducers = {
  app: AppReducer,
  product: ProductReducer,
  auth: AuthReducer,
  loadingGlobal: LoadingGlobalReducer,
  customer: CustomerReducer,
  category: CategoryReducer,
  order: OrderReducer,
};
