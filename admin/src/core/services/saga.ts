import { AuthSaga } from "@/modules/auth/saga";
import { CategorySaga } from "@/modules/category/saga";
import { CustomerSaga } from "@/modules/customer/saga";
import { ProductSaga } from "@/modules/product/saga";
import { all, call } from "redux-saga/effects";

function* rootSaga() {
  yield all([
    call(ProductSaga),
    call(AuthSaga),
    call(CategorySaga),
    call(CustomerSaga),
  ]);
}
export default rootSaga;
