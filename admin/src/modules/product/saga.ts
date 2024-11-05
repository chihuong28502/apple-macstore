import { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { delay, put, takeLatest, takeLeading } from "redux-saga/effects";

import { message } from "antd";
import { ProductRequest } from "./request";
import { ProductActions } from "./slice";
interface DeleteProductResponse {
  success: boolean;
  message?: string;
}
function* createProduct({ payload }: PayloadAction<any>) {
  const { data, onSuccess = (rs: any) => { }, onFail = (rs: any) => { } } = payload;
  try {
    yield put(ProductActions.setLoading(true));

    const response: { success: boolean; data: any } = yield ProductRequest.createProduct(data);
    yield put(ProductActions.setLoading(false));
    if (response.success) {
      yield put(ProductActions.setProduct(response.data));
      message.success("Thêm sản phẩm thành công")
      onSuccess(response.data);
    } else {
      onFail(response);
    }
  } catch (e) {
    onFail(e);
  }
}

function* fetchProductById({ payload }: PayloadAction<any>) {
  const { id, onSuccess = (rs: any) => { }, onFail = (rs: any) => { } } = payload;
  try {
    yield put(ProductActions.setLoading(true));
    const response: { success: boolean; data: any } = yield ProductRequest.getProductById(payload);
    yield put(ProductActions.setLoading(false));
    if (response.success) {
      yield put(ProductActions.setProduct(response.data));
      onSuccess(response.data);
    } else {
      onFail(response);
    }
  } catch (e) {
    onFail(e);
  }
}

// Gộp phân trang và category vào một hàm duy nhất
function* fetchPaginatedProducts({ payload }: PayloadAction<{
  page: number; limit: number; categoryId

  ?: string; minPrice?: number, maxPrice?: number
}>) {
  const { page, limit, categoryId, minPrice, maxPrice } = payload;
  try {
    yield put(ProductActions.setLoading(true));

    const response: { success: boolean; data: any; total: number } = yield ProductRequest.getAllProducts({ page, limit, categoryId, minPrice, maxPrice });
    yield put(ProductActions.setLoading(false));

    if (response.success) {
      yield put(ProductActions.setProductList(response.data.products));
      yield put(ProductActions.setTotalProducts(response.data.total));
    }
  } catch (e) {
    console.error("Error fetching products:", e);
  }
}

function* updateProduct({ payload }: PayloadAction<any>): Generator<any, void, unknown> {
  const { id, data, onSuccess = (rs: any) => { }, onFail = (rs: any) => { } } = payload;
  try {
    yield put(ProductActions.setLoading(true));

    const response: any = yield ProductRequest.updateProduct(id, data);
    yield put(ProductActions.setLoading(false));

    if (response.success) {
      yield put(ProductActions.fetchPaginatedProducts({ page: 1, limit: 8 })); // Giả sử bạn muốn tải lại danh sách sản phẩm
      message.success("Chỉnh sửa sản phẩm thành công")
      onSuccess(response.data);
    } else {
      onFail(response);
    }
  } catch (error: any) {
    onFail(error);
    message.error(error.message || "Cập nhật sản phẩm thất bại");
  }
}

function* deleteProduct({ payload }: any) {
  try {
    yield delay(100);
    const { id, onSuccess } = payload;
    const rs: DeleteProductResponse = yield ProductRequest.deleteProduct(id);
    if (rs.success) {
      yield put(ProductActions.fetchPaginatedProducts({ page: 1, limit: 8 }));
      message.success("Delete Product successfully");
      onSuccess();
    } else {
      throw rs.message;
    }
  } catch (error: any) {
    message.error(error);
  }
}
export function* ProductSaga() {
  yield takeLeading(ProductActions.createProduct, createProduct);
  yield takeLeading(ProductActions.fetchProductById, fetchProductById);
  yield takeLeading(ProductActions.fetchPaginatedProducts, fetchPaginatedProducts);
  yield takeLatest(ProductActions.deleteProduct, deleteProduct)
  yield takeLatest(ProductActions.updateProduct, updateProduct);
}
