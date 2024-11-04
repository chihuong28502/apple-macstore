import { PayloadAction } from "@reduxjs/toolkit";
import { put, takeLeading } from "redux-saga/effects";

import { CartRequest } from "./request";
import { CartActions } from "./slice";
function* fetchdCartById({ payload }: PayloadAction<any>) {
  const { id, onSuccess = (rs: any) => { }, onFail = (rs: any) => { } } = payload;
  try {
    yield put(CartActions.setLoading(true));
    
    const response: { success: boolean; data: any } = yield CartRequest.getCartById(payload);
    yield put(CartActions.setLoading(false));
    if (response.success) {
      yield put(CartActions.setCart(response.data));
      onSuccess(response.data);
    } else {
      onFail(response);
    }
  } catch (e) {
    onFail(e);
  }
} 

function* addItemtByCart({ payload }: PayloadAction<any>) {
  const { id, item, onSuccess = (rs: any) => {}, onFail = (rs: any) => {} } = payload;
  try {
    yield put(CartActions.setLoading(true));

    const response: { success: boolean; data: any } = yield CartRequest.addItemToCart({ id, item }); // Gọi API thêm sản phẩm vào giỏ hàng
    yield put(CartActions.setLoading(false));

    if (response.success) {
      yield put(CartActions.setCart(item));
      onSuccess(response.data);
    } else {
      onFail(response);
    }
  } catch (e) {
    onFail(e);
  }
}

export function* CartSaga() {
  yield takeLeading(CartActions.fetchCartById, fetchdCartById);
  yield takeLeading(CartActions.addProductToCart, addItemtByCart);
}
