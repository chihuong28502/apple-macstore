import { AppAction } from "@/core/components/AppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { delay, put, takeLeading } from "redux-saga/effects";
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

function* updateCustomer({ payload }: PayloadAction<{ id: string; data: any }>): Generator<any, void, any> {
  try {
    yield delay(100);
    const { id, data } = payload;
    const rs = yield CustomerRequest.updateCustomerById(id, data);
    if (rs.success) {
      message.success("Sửa thông tin người dùng thành công");
      const response = yield CustomerRequest.getAllCustomer();
      yield put(CustomerActions.setCustomer(response.data));
    } else {
      message.error("Sửa thông tin người dùng thất bại");
    }
  } catch (error: any) {
    message.error("An error occurred while updating the category.");
  }
}

function* deleteCustomer({ payload }: any): Generator<any, void, any> {
  try {
    yield delay(100);
    const { id } = payload;
    const rs: any = yield CustomerRequest.deleteCustomer(id);
    if (rs.success === true) {
      const response: { success: boolean; data: any[] } = yield CustomerRequest.getAllCustomer();
      message.success("Xóa người dùng thành công");
      yield put(CustomerActions.setCustomer(response.data));
    } else {
      message.error("Xóa danh mục thất bại");
    }
  } catch (error: any) {
    message.error("Xóa danh mục thất bại Catch");
  }
}

export function* CustomerSaga() {
  yield takeLeading(CustomerActions.deleteCustomer, deleteCustomer);
  yield takeLeading(CustomerActions.getCustomer, getCustomer);
  yield takeLeading(CustomerActions.updateCustomer, updateCustomer);
}
