import { PayloadAction } from "@reduxjs/toolkit";
import { put, takeLeading } from "redux-saga/effects";
import { ReviewRequest } from "./request";
import { ReviewActions } from "./slice";
import { message } from "antd";
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
  } catch (e) {
    onFail(e);
  }
}
function* editReview({ payload }: PayloadAction<any>) {
  const { id, payload: updateData } = payload
  try {
    const response: { success: boolean; data: any } = yield ReviewRequest.updateReview(
      id,
      payload
    );
    if (response.success) {
      const setAPI: { success: boolean; data: any } = yield ReviewRequest.getAllReviews(payload.productId);
      if (setAPI.success) {
        yield put(ReviewActions.setReviewByProductId(setAPI.data));
        message.success("Sửa nhận xét thành công!")
      }
    } else {
      message.error("Sửa nhận xét thất bại!")
    }
  } catch (error) {
    console.error('Error editing review:', error);
  }
}

function* deleteReview({ payload }: PayloadAction<{ productId: string, reviewId: string }>) {
  try {
    // Gọi API xóa đánh giá
    const response: { success: boolean; data: any } = yield ReviewRequest.deleteReview(payload.reviewId);
    if (response.success) {
      // Nếu xóa thành công, lấy lại tất cả các đánh giá của sản phẩm
      const setAPI: { success: boolean; data: any } = yield ReviewRequest.getAllReviews(payload.productId);
      if (setAPI.success) {
        // Cập nhật lại danh sách đánh giá trong Redux store
        yield put(ReviewActions.setReviewByProductId(setAPI.data));
        message.success("Xóa nhận xét thành công!");
      }
    } else {
      message.error("Xóa nhận xét thất bại!");
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    message.error("Đã có lỗi xảy ra khi xóa nhận xét.");
  }
}

export function* ReviewSaga() {
  yield takeLeading(ReviewActions.fetchReviewByProductId, fetchdReviewByProductId);
  yield takeLeading(ReviewActions.editReview, editReview);
  yield takeLeading(ReviewActions.deleteReview, deleteReview);
}
