import AuthReducer from "@/modules/auth/slice";
import CustomerReducer from "@/modules/customer/slice";
import ProductReducer from "@/modules/product/slice";
import AppReducer from "../components/AppSlice";

export const reducers = {
  app: AppReducer,
  customer: CustomerReducer,
  auth: AuthReducer,
  product: ProductReducer
};
