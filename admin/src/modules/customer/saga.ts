import { AppAction } from "@/core/components/AppSlice";
import { put, takeLeading } from "redux-saga/effects";
import { CustomerRequest } from "./request";
import { CustomerActions } from "./slice";

function* getCustomer() {
  try {
    yield put(AppAction.showLoading());
    const res: { success: boolean; data: any } =
      yield CustomerRequest.getAllCustomer();
    yield put(AppAction.hideLoading());

    if (res.success) {
      yield put(CustomerActions.setCustomer(res.data));
    } else {
    }
  } catch (e) { }
}

export function* CustomerSaga() {
  yield takeLeading(CustomerActions.getCustomer, getCustomer);
}
