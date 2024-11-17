import { AppAction } from "@/core/components/AppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { delay, put, takeLeading } from "redux-saga/effects";
import { CartRequest } from "../cart/request";
import { CartActions } from "../cart/slice";
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

function* addOrder({ payload }: PayloadAction<{
  userId: string
  data: any;
  onSuccess?: (data: any) => void;
  onFail?: (error: string, data?: any) => void;
}>): Generator<any, void, any> {
  const { onSuccess = () => { }, onFail = () => { } } = payload
  try {
    yield put(AppAction.showLoading());
    const res: { success: boolean; data: any } =
      yield OrderRequest.addOrder(payload);
    yield put(AppAction.hideLoading());
    if (res.success) {
      const responseCart: { success: boolean; data: any } = yield CartRequest.getCartById(payload.userId);
      const responseOrder: { success: boolean; data: any } = yield OrderRequest.getOrderById(payload.userId);
      yield put(CartActions.setCart(responseCart.data));
      yield put(OrderActions.setAllOrder(responseOrder.data));
      yield put(OrderActions.setOrder(res.data));
      message.success("Thêm order thành công");
      onSuccess(res?.data)
    } else {
      message.error("Thêm order thất bại");
      onFail(res.data)
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
      yield put(OrderActions.setOrder(response.data));
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
      message.success("Xóa người dùng thành công");
      yield put(OrderActions.setOrder(response.data));
    } else {
      message.error("Xóa danh mục thất bại");
    }
  } catch (error: any) {
    message.error("Xóa danh mục thất bại Catch");
  }
}

export function* OrderSaga() {
  yield takeLeading(OrderActions.addOrder, addOrder);
  yield takeLeading(OrderActions.deleteOrder, deleteOrder);
  yield takeLeading(OrderActions.getAllOrderById, getAllOrderById);
  yield takeLeading(OrderActions.updateOrder, updateOrder);
  yield takeLeading(OrderActions.updateStatus, updateStatus);
}
