import { AppAction } from "@/core/components/AppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { delay, put, takeLeading } from "redux-saga/effects";
import { OrderRequest } from "./request";
import { OrderActions } from "./slice";

function* getAllOrderById({ payload }: PayloadAction<{ id: string; data: any }>): Generator<any, void, any> {
  try {
    yield put(AppAction.showLoading());
    const res: { success: boolean; data: any } =
      yield OrderRequest.getOrderById(payload);
    yield put(AppAction.hideLoading());
    if (res.success) {
      yield put(OrderActions.setAllOrder(res.data));
    } else {
    }
  } catch (e) {
    message.error("Thao tác thất bại!");
  }
}
function* getAllOrder(): Generator<any, void, any> {
  try {
    yield put(AppAction.showLoading());
    const res: { success: boolean; data: any } =
      yield OrderRequest.getAllOrder();
    yield put(AppAction.hideLoading());
    if (res.success) {
      yield put(OrderActions.setAllOrder(res.data));
    } else {
    }
  } catch (e) {
    message.error("Thao tác thất bại!");
  }
}

function* updateStatus({ payload }: PayloadAction<{ id: string; data: any, userId: string }>): Generator<any, void, any> {
  try {
    yield delay(100);
    const { id, data, userId } = payload;
    const rs = yield OrderRequest.updateStatusOrderById(id, data);
    if (rs.success) {
      if (data.status === 'cancelled') {
        message.success("Hủy đơn hàng thành công");
      } else {
        message.success("Xác nhận nhận đơn hàng thành công");
      }
      const res = yield OrderRequest.getOrderById(userId);
      yield put(OrderActions.setAllOrder(res.data));
    } else {
      message.error("Thao tác thất bại!");
    }
  } catch (error: any) {
    message.error("Thao tác thất bại!");
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
      yield put(OrderActions.setAllOrder(response.data));
    } else {
      message.error("Sửa thông tin người dùng thất bại");
    }
  } catch (error: any) {
    message.error("Thao tác thất bại!");
  }
}

function* deleteOrder({ payload }: any): Generator<any, void, any> {
  try {
    yield delay(100);
    const { id } = payload;
    const rs: any = yield OrderRequest.deleteOrder(id);
    if (rs.success === true) {
      const response: { success: boolean; data: any[] } = yield OrderRequest.getAllOrder();
      message.success("Xóa đơn hàng thành công");
      yield put(OrderActions.setAllOrder(response.data));
    } else {
      message.error("Xóa đơn hàng thất bại");
    }
  } catch (error: any) {
    message.error("Xóa đơn hàng thất bại Catch");
  }
}

export function* OrderSaga() {
  yield takeLeading(OrderActions.deleteOrder, deleteOrder);
  yield takeLeading(OrderActions.getAllOrderById, getAllOrderById);
  yield takeLeading(OrderActions.updateOrder, updateOrder);
  yield takeLeading(OrderActions.updateStatus, updateStatus);
  yield takeLeading(OrderActions.getAllOrder, getAllOrder);
}
