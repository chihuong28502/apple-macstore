import { all, call } from "redux-saga/effects";

import { AuthSaga } from "@/modules/auth/saga";
import { CustomerSaga } from "@/modules/customer/saga";
import { ProductSaga } from "@/modules/product/saga";
import { NotifySaga } from "@/modules/notify/saga";

function* rootSaga() {
  yield all([
    call(ProductSaga),
    call(AuthSaga),
    call(CustomerSaga),
    call(NotifySaga),
  ]);
}
export default rootSaga;
