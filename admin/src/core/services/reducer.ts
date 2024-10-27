import AuthReducer from "@/modules/auth/slice";
import CustomerReducer from "@/modules/customer/slice";
import AppReducer from "../components/AppSlice";
import ProductReducer from "@/modules/product/slice";
import LoadingGlobalReducer from "@/modules/loading-global/slice";
import CategoryReducer from "@/modules/category/slice";

export const reducers = {
  app: AppReducer,
  product: ProductReducer,
  auth: AuthReducer,
  loadingGlobal: LoadingGlobalReducer,
  customer: CustomerReducer,
  category: CategoryReducer,
};
