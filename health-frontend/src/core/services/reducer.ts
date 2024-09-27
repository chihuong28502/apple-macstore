import CustomerReducer from "@/modules/customer/slice";
import AppReducer from "../components/AppSlice";

export const reducers = {
  app: AppReducer,
  customer: CustomerReducer,
};
