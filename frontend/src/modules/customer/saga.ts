import { AppAction } from "@/core/components/AppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { put, takeLeading } from "redux-saga/effects";
import { CustomerRequest } from "./request";
import { CustomerActions } from "./slice";

function* getCustomer({ payload }: PayloadAction<any>) {
  const { onSuccess = (rs: any) => {}, onFail = (rs: any) => {} } = payload;
  try {
    yield put(AppAction.showLoading());
    const res: { success: boolean; data: any } =
      yield CustomerRequest.getByCustomer();
    yield put(AppAction.hideLoading());

    if (res.success) {
      yield put(CustomerActions.setCustomer(res.data));
      onSuccess && onSuccess(res);
    } else {
      onFail && onFail(res);
    }
  } catch (e) {}
}

export function* CustomerSaga() {
  yield takeLeading(CustomerActions.getCustomer, getCustomer);
}
