import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLeading } from "redux-saga/effects";

import { IntroductionRequest } from "./request";
import { IntroductionActions } from "./slice";

function* fetchIntroductionByAds() {
  try {
    // Gửi action để set loading
    yield put(IntroductionActions.setLoading(true));

    // Gọi API (nên dùng `call` để dễ test và gỡ lỗi)
    const response: { success: boolean; data: any } = yield IntroductionRequest.getAllIntroductionByAds()
    // Kiểm tra kết quả và dispatch action phù hợp
    if (response.success) {
      yield put(IntroductionActions.setIntroductionByAds(response.data));
    } else {
    }
  } catch (e) {
    // Xử lý lỗi
    yield put(IntroductionActions.setLoading(false));
  }
}

function* fetchIntroductionByBanner() {
  try {
    // Gửi action để set loading
    yield put(IntroductionActions.setLoading(true));

    // Gọi API (nên dùng `call` để dễ test và gỡ lỗi)
    const response: { success: boolean; data: any } = yield IntroductionRequest.getAllIntroductionByBanner()
    // Kiểm tra kết quả và dispatch action phù hợp
    if (response.success) {
      yield put(IntroductionActions.setIntroductionByBanner(response.data));
    } else {
    }
  } catch (e) {
    // Xử lý lỗi
    yield put(IntroductionActions.setLoading(false));
  }
}

export function* IntroductionSaga() {
  yield takeLeading(IntroductionActions.fetchIntroductionByAds, fetchIntroductionByAds);
  yield takeLeading(IntroductionActions.fetchIntroductionByBanner, fetchIntroductionByBanner);
}
