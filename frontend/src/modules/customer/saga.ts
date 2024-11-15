import { AppAction } from "@/core/components/AppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { put, takeLeading } from "redux-saga/effects";
import { CustomerRequest } from "./request";
import { CustomerActions } from "./slice";

function* getCustomer({ payload }: PayloadAction<any>) {
  const { onSuccess = (rs: any) => { }, onFail = (rs: any) => { } } = payload;
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
  } catch (e) { }
}

function* addShippingById({ payload }: PayloadAction<any>) {
  const { id, item, onSuccess = (rs: any) => { }, onFail = (rs: any) => { } } = payload;
  try {
    yield put(CustomerActions.setLoading(true));
    const response: { success: boolean; data: any } = yield CustomerRequest.postShippingByUser({ id, item }); // Gọi API thêm sản phẩm vào giỏ hàng
    yield put(CustomerActions.setLoading(false));
    if (response.success) {
      yield put(CustomerActions.setShipping(response.data.shipping));
      message.success("Thêm địa chỉ ship hàng thành công")
      onSuccess(response.data);
    } else {
      message.error("Thêm địa chỉ ship thất bại")
      onFail(response);
    }
  } catch (e) {
    onFail(e);
  }
}

// function* getShippingByUser({ payload }: PayloadAction<any>) {
//   try {
//     yield put(CustomerActions.setLoading(true));
//     const res: { success: boolean; data: any } =
//       yield CustomerRequest.getShippingByUser(payload);
//     yield put(CustomerActions.setLoading(false));
//     if (res.success) {
//       yield put(CustomerActions.setShipping(res.data))
//     } else {
//     }
//   } catch (e) { }
// }

function* updateShippingById({ payload }: PayloadAction<any>) {
  try {
    yield put(CustomerActions.setLoading(true));
    const res: { success: boolean; data: any } =
      yield CustomerRequest.updateShippingByUser(payload);
    yield put(CustomerActions.setLoading(false));
    if (res.success) {
      yield put(CustomerActions.setShipping(res.data.shipping))
      message.success("Sửa địa chỉ ship hàng thành công")
    } else {
      message.error("Sửa địa chỉ ship hàng thất bại")
    }
  } catch (e) { }
}

function* deleteShipping({ payload }: PayloadAction<any>) {
  try {
    yield put(CustomerActions.setLoading(true));
    const res: { success: boolean; data: any } =
      yield CustomerRequest.deleteShippingByUser(payload);
    yield put(CustomerActions.setLoading(false));
    if (res.success) {
      yield put(CustomerActions.setShipping(res.data.shipping))
      message.success("Xóa địa chỉ ship hàng thành công")
    } else {
      message.error("Xóa địa chỉ ship hàng thất bại")
    }
  } catch (e) { }
}
export function* CustomerSaga() {
  yield takeLeading(CustomerActions.getCustomer, getCustomer);
  yield takeLeading(CustomerActions.addShippingById, addShippingById);
  yield takeLeading(CustomerActions.updateShippingById, updateShippingById);
  yield takeLeading(CustomerActions.deleteShipping, deleteShipping);
  // yield takeLeading(CustomerActions.getShippingByUser, getShippingByUser);
}
