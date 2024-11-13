import { AppAction } from "@/core/components/AppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { delay, put, takeLeading } from "redux-saga/effects";
import { OrderRequest } from "./request";
import { OrderActions } from "./slice";

function* getOrder() {
  try {
    yield put(AppAction.showLoading());
    const res: { success: boolean; data: any } =
      yield OrderRequest.getAllOrder();
    yield put(AppAction.hideLoading());

    if (res.success) {
      yield put(OrderActions.setOrder(res.data));
    } else {
    }
  } catch (e) { }
}

function* addOrder({ payload }: PayloadAction<{ id: string; data: any }>): Generator<any, void, any> {
  try {
    yield put(AppAction.showLoading());
    const res: { success: boolean; data: any } =
      yield OrderRequest.addOrder(payload);
    yield put(AppAction.hideLoading());
    if (res.success) {
      message.success("Thêm order thành công");
      console.log("🚀 ~ res:", res)
      yield put(OrderActions.setOrder(res.data));
    } else {
      message.error("Thêm order thất bại");
    }
  } catch (e) {
    message.error("Thêm order thất bại");
  }
}

function* updateOrder({ payload }: PayloadAction<{ id: string; data: any }>): Generator<any, void, any> {
  try {
    yield delay(100);
    const { id, data } = payload;
    const rs = yield OrderRequest.updateOrderById(id, data);
    if (rs.success) {
      message.success("Sửa thông tin người dùng thành công");
      const response = yield OrderRequest.getAllOrder();
      yield put(OrderActions.setOrder(response.data));
    } else {
      message.error("Sửa thông tin người dùng thất bại");
    }
  } catch (error: any) {
    message.error("An error occurred while updating the category.");
  }
}

function* deleteOrder({ payload }: any): Generator<any, void, any> {
  try {
    yield delay(100);
    const { id } = payload;
    const rs: any = yield OrderRequest.deleteOrder(id);
    if (rs.success === true) {
      const response: { success: boolean; data: any[] } = yield OrderRequest.getAllOrder();
      message.success("Xóa người dùng thành công");
      yield put(OrderActions.setOrder(response.data));
    } else {
      message.error("Xóa danh mục thất bại");
    }
  } catch (error: any) {
    message.error("Xóa danh mục thất bại Catch");
  }
}
addOrder
export function* OrderSaga() {
  yield takeLeading(OrderActions.addOrder, addOrder);
  yield takeLeading(OrderActions.deleteOrder, deleteOrder);
  yield takeLeading(OrderActions.getOrder, getOrder);
  yield takeLeading(OrderActions.updateOrder, updateOrder);
}
