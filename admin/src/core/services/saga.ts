import { all, call } from "redux-saga/effects";

import { AuthSaga } from "@/modules/auth/saga";
import { CategorySaga } from "@/modules/category/saga";
import { CustomerSaga } from "@/modules/customer/saga";
import { ProductSaga } from "@/modules/product/saga";
import { OrderSaga } from "@/modules/order/saga";
import { IntroductionSaga } from "@/modules/introduction/saga";

function* rootSaga() {
  yield all([
    call(ProductSaga),
    call(AuthSaga),
    call(CategorySaga),
    call(CustomerSaga),
    call(OrderSaga),
    call(IntroductionSaga),
  ]);
}
export default rootSaga;
