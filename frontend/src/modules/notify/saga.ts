import { PayloadAction } from "@reduxjs/toolkit";
import { put, takeLeading } from "redux-saga/effects";
import { NotifyRequest } from "./request";
import { NotifyActions } from "./slice";
function* fetchdNotifyById({ payload }: PayloadAction<any>) {
  const { id, onSuccess = (rs: any) => { }, onFail = (rs: any) => { } } = payload;
  try {
    yield put(NotifyActions.setLoading(true));
    
    const response: { success: boolean; data: any } = yield NotifyRequest.getAllNotifys(payload);
    yield put(NotifyActions.setLoading(false));
    if (response.success) {
      yield put(NotifyActions.setNotify(response.data));
      onSuccess(response.data);
    } else {
      onFail(response);
    }
  } catch (e) {
    onFail(e);
  }
}

export function* NotifySaga() {
  yield takeLeading(NotifyActions.fetchNotifyById, fetchdNotifyById);
}
