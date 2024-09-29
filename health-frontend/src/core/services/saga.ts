import { AuthSaga } from "@/modules/auth/saga";
import { CustomerSaga } from "@/modules/customer/saga";
import { ProductSaga } from "@/modules/product/saga";
import { all, call } from "redux-saga/effects";

function* rootSaga() {
  yield all([call(CustomerSaga), call(AuthSaga),call(ProductSaga)]);
}
export default rootSaga;
