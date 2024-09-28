import CustomerReducer from "@/modules/customer/slice";
import AppReducer from "../components/AppSlice";
import AuthReducer from "@/modules/auth/slice";

export const reducers = {
  app: AppReducer,
  customer: CustomerReducer,
  auth: AuthReducer
};
