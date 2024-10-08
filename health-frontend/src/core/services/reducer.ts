import AuthReducer from "@/modules/auth/slice";
import CustomerReducer from "@/modules/customer/slice";
import AppReducer from "../components/AppSlice";
import aiKeywordReducer from "@/modules/ai.keyword/slice";
import ProductReducer from "@/modules/product/slice";

export const reducers = {
  app: AppReducer,
  product: ProductReducer,
  auth: AuthReducer,
  customer: CustomerReducer,
  aiKeyword: aiKeywordReducer,
};
