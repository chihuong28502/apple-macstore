import { PayloadAction } from "@reduxjs/toolkit";
import { delay, put, takeLatest, takeLeading } from "redux-saga/effects";
import { IntroductionRequest } from "./request";
import { IntroductionActions } from "./slice";
import { message } from "antd";
interface DeleteIntroductionResponse {
  success: boolean;
  message?: string;
}
function* createIntroduction({ payload }: PayloadAction<{ data: any }>) {
  const { data } = payload;
  try {
    yield put(IntroductionActions.setLoading(true));
    const response: { success: boolean; data: any } = yield IntroductionRequest.createIntroduction(payload);
    if (response.success) {
      message.success("Thêm danh mục thành công");
      const response: { success: boolean; data: any[] } = yield IntroductionRequest.getAllIntroductions();
      yield put(IntroductionActions.setIntroductions(response.data));
      yield put(IntroductionActions.setLoading(false));
    } else {
    }
  } catch (e) {
  }
}

function* fetchIntroductions() {
  try {
    yield put(IntroductionActions.setLoading(true));

    const response: { success: boolean; data: any[] } = yield IntroductionRequest.getAllIntroductions();
    console.log("🚀 ~ response:", response.data)

    yield put(IntroductionActions.setLoading(false));

    if (response.success) {
      yield put(IntroductionActions.setIntroductions(response.data));
    }
  } catch (e) {
    console.error("Error fetching categories:", e);
  }
}

function* deleteIntroduction({ payload }: any) {
  try {
    yield delay(100);
    const rs: DeleteIntroductionResponse = yield IntroductionRequest.deleteIntroduction(payload);
    if (rs.success === true) {
      const response: { success: boolean; data: any[] } = yield IntroductionRequest.getAllIntroductions();
      message.success("Xóa danh mục thành công");
      yield put(IntroductionActions.setIntroductions(response.data));
    } else {
      message.error("Xóa danh mục thất bại");
    }
  } catch (error: any) {
    message.error("Xóa danh mục thất bại Catch");
  }
}

function* updateIntroduction({ payload }: PayloadAction<{ id: string; data: any; onSuccess: () => void }>): Generator<any, void, any> {
  try {
    yield delay(100);
    const { id, data } = payload;

    // Pass both `id` and `data` as separate arguments
    const rs = yield IntroductionRequest.updateIntroduction(id, data);

    if (rs.success) {
      message.success("Sửa danh mục thành công");
      const response = yield IntroductionRequest.getAllIntroductions();
      yield put(IntroductionActions.setIntroductions(response.data));
    } else {
      message.error("Sửa danh mục thất bại");
    }
  } catch (error: any) {
    message.error("An error occurred while updating the category.");
  }
}

export function* IntroductionSaga() {
  yield takeLeading(IntroductionActions.fetchIntroductions, fetchIntroductions);
  yield takeLatest(IntroductionActions.deleteIntroduction, deleteIntroduction)
  yield takeLatest(IntroductionActions.updateIntroduction, updateIntroduction)
  yield takeLeading(IntroductionActions.createIntroduction, createIntroduction)
}
