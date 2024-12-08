import { PayloadAction } from "@reduxjs/toolkit";
import { put, takeLeading } from "redux-saga/effects";
import { ReviewRequest } from "./request";
import { ReviewActions } from "./slice";
import { message } from "antd";


function* addReview({ payload }: PayloadAction<any>) {
  const { onSuccess = (rs: any) => { }, onFail = (rs: any) => { } } = payload;
  try {
    yield put(ReviewActions.setLoadingReviewByProductId(true));
    const response: { success: boolean; data: any } = yield ReviewRequest.addReview(payload);
    yield put(ReviewActions.setLoadingReviewByProductId(false));
    if (response.success) {
      const setAPI: { success: boolean; data: any } = yield ReviewRequest.getAllReviews(payload.product_id);
      yield put(ReviewActions.setReviewByProductId(setAPI.data));
      yield put(ReviewActions.setLoadingReviewByProductId(false));
      onSuccess(response.data);
    } else {
      onFail(response);
    }
  } catch (error: any) {
    message.error(error.response.data.message)
    console.log("🚀 ~ error:", error)
  }
}

function* fetchdReviewByProductId({ payload }: PayloadAction<any>) {
  const { onSuccess = (rs: any) => { }, onFail = (rs: any) => { } } = payload;
  try {
    yield put(ReviewActions.setLoadingReviewByProductId(true));
    const response: { success: boolean; data: any } = yield ReviewRequest.getAllReviews(payload);
    yield put(ReviewActions.setLoadingReviewByProductId(false));
    if (response.success) {
      yield put(ReviewActions.setReviewByProductId(response.data));
      onSuccess(response.data);
    } else {
      onFail(response);
    }
  } catch (error: any) {
    message.error(error.response.data.message)
    console.log("🚀 ~ error:", error)
  }
}

function* editReview({ payload }: PayloadAction<any>) {
  const { id, payload: updateData } = payload
  try {
    yield put(ReviewActions.setLoadingReviewByProductId(true));
    const response: { success: boolean; data: any } = yield ReviewRequest.updateReview(
      id,
      payload
    );
    if (response.success) {
      const setAPI: { success: boolean; data: any } = yield ReviewRequest.getAllReviews(payload.productId);
      if (setAPI.success) {
        yield put(ReviewActions.setReviewByProductId(setAPI.data));
        yield put(ReviewActions.setLoadingReviewByProductId(false));
        message.success("Sửa nhận xét thành công!")

      }
    } else {
      message.error("Sửa nhận xét thất bại!")
    }
  } catch (error: any) {
    message.error(error.response.data.message)
    console.log("🚀 ~ error:", error)
  }
}

function* deleteReview({ payload }: PayloadAction<{ productId: string, reviewId: string }>) {
  try {
    // Gọi API xóa đánh giá
    yield put(ReviewActions.setLoadingReviewByProductId(true));
    const response: { success: boolean; data: any } = yield ReviewRequest.deleteReview(payload.reviewId);
    if (response.success) {
      // Nếu xóa thành công, lấy lại tất cả các đánh giá của sản phẩm
      const setAPI: { success: boolean; data: any } = yield ReviewRequest.getAllReviews(payload.productId);
      if (setAPI.success) {
        // Cập nhật lại danh sách đánh giá trong Redux store
        yield put(ReviewActions.setReviewByProductId(setAPI.data));
        yield put(ReviewActions.setLoadingReviewByProductId(false));
        message.success("Xóa nhận xét thành công!");
      }
    } else {
      message.error("Xóa nhận xét thất bại!");
    }
  } catch (error: any) {
    console.log(error)
    message.error(error.response.data.message)
    console.log("🚀 ~ error:", error)
  }
}

export function* ReviewSaga() {
  yield takeLeading(ReviewActions.addReview, addReview);
  yield takeLeading(ReviewActions.fetchReviewByProductId, fetchdReviewByProductId);
  yield takeLeading(ReviewActions.editReview, editReview);
  yield takeLeading(ReviewActions.deleteReview, deleteReview);
}
