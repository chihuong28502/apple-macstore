import { AuthSaga } from "@/modules/auth/saga";
import { CartSaga } from "@/modules/cart/saga";
import { CustomerSaga } from "@/modules/customer/saga";
import { IntroductionSaga } from "@/modules/introduction/saga";
import { NotifySaga } from "@/modules/notify/saga";
import { OrderSaga } from "@/modules/order/saga";
import { ProductSaga } from "@/modules/product/saga";
import { all, call } from "redux-saga/effects";

function* rootSaga() {
  yield all([
    call(ProductSaga),
    call(AuthSaga),
    call(CustomerSaga),
    call(NotifySaga),
    call(CartSaga),
    call(OrderSaga),
    call(IntroductionSaga),
  ]);
}
export default rootSaga;
