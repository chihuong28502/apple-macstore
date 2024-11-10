import { PayloadAction } from "@reduxjs/toolkit";
import { put, takeLeading } from "redux-saga/effects";
import { message } from "antd";
import { CartRequest } from "./request";
import { CartActions } from "./slice";

function* fetchdCartById({ payload }: PayloadAction<any>) {
  const { onSuccess = (rs: any) => { }, onFail = (rs: any) => { } } = payload;
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
  const { id, item, onSuccess = (rs: any) => { }, onFail = (rs: any) => { } } = payload;
  try {
    yield put(CartActions.setLoading(true));
    const response: { success: boolean; data: any } = yield CartRequest.addItemToCart({ id, item }); // Gọi API thêm sản phẩm vào giỏ hàng
    yield put(CartActions.setLoading(false));
    if (response.success) {
      const response: { success: boolean; data: any } = yield CartRequest.getCartById(id);
      yield put(CartActions.setCart(response.data));
      message.success("Cart successfully added")
      onSuccess(response.data);
    } else {
      onFail(response);
    }
  } catch (e) {
    onFail(e);
  }
}

function* updateCartItemQuantity({ payload }: PayloadAction<any>) {
  try {
    const { userId, productId, variantId, quantity } = payload;
    const response: { success: boolean; data: any } = yield CartRequest.updateCart({
      userId: userId, items: {
        productId, variantId, quantity
      }
    });
    if (response.success) {
      const response: { success: boolean; data: any } = yield CartRequest.getCartById(userId);
      yield put(CartActions.setCart(response.data));
      message.success("Giỏ hàng tăng giảm thành công")
    } else {
    }
  } catch (error) {
    message.error("Giỏ hàng tăng giảm thất bại")

  }
}

function* deleteItemCard({ payload }: PayloadAction<any>) {
  try {
    const { userId, productId, variantId } = payload;
    const response: { success: boolean; data: any } = yield CartRequest.deleteItemByCard({
      userId: userId, items: {
        productId, variantId
      }
    });
    if (response.success) {
      const response: { success: boolean; data: any } = yield CartRequest.getCartById(userId);
      yield put(CartActions.setCart(response.data));
      message.success("Giỏ hàng xóa thành công")
    } else {
    }
  } catch (error) {
    message.error("Giỏ hàng xóa thất bại")

  }
}
export function* CartSaga() {
  yield takeLeading(CartActions.fetchCartById, fetchdCartById);
  yield takeLeading(CartActions.addProductToCart, addItemtByCart);
  yield takeLeading(CartActions.updateCartItemQuantity, updateCartItemQuantity);
  yield takeLeading(CartActions.deleteItemCard, deleteItemCard);
}
