import { AuthSaga } from "@/modules/auth/saga";
import { CustomerSaga } from "@/modules/customer/saga";
import { all, call } from "redux-saga/effects";

function* rootSaga() {
  yield all([call(CustomerSaga), call(AuthSaga)]);
}
export default rootSaga;
