import { CustomerSaga } from "@/modules/customer/saga";
import { all, call } from "redux-saga/effects";

function* rootSaga() {
  yield all([
    call(CustomerSaga)
  ]);
}
export default rootSaga;
