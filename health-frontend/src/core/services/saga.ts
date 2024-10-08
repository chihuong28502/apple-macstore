import { aiKeywordSaga } from "@/modules/ai.keyword/saga";
import { AuthSaga } from "@/modules/auth/saga";
import { CustomerSaga } from "@/modules/customer/saga";
import { ProductSaga } from "@/modules/product/saga";
import { all, call } from "redux-saga/effects";

function* rootSaga() {
  yield all([
    call(aiKeywordSaga),
    call(ProductSaga),
    call(AuthSaga),
    call(CustomerSaga),
  ]);
}
export default rootSaga;
