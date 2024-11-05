import { all, call } from "redux-saga/effects";

import { AuthSaga } from "@/modules/auth/saga";
import { CartSaga } from "@/modules/cart/saga";
import { CustomerSaga } from "@/modules/customer/saga";
import { NotifySaga } from "@/modules/notify/saga";
import { ProductSaga } from "@/modules/product/saga";

function* rootSaga() {
  yield all([
    call(ProductSaga),
    call(AuthSaga),
    call(CustomerSaga),
    call(NotifySaga),
    call(CartSaga),
  ]);
}
export default rootSaga;
