import { PayloadAction } from "@reduxjs/toolkit";
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
      message.error("Thêm sản phẩm thất bại")
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
    message.error("Cập nhật sản phẩm thất bại");
  }
}

function* deleteProduct({ payload }: any) {
  try {
    yield delay(100);
    const { id, onSuccess } = payload;
    const rs: DeleteProductResponse = yield ProductRequest.deleteProduct(id);
    if (rs.success) {
      yield put(ProductActions.fetchPaginatedProducts({ page: 1, limit: 8 }));
      message.success("Xóa sản phẩm thành công");
      onSuccess();
    } else {
      message.error("Xóa sản phẩm thất bại")
      throw rs.message;
    }
  } catch (error: any) {
    message.error("Xóa sản phẩm thất bại");
  }
}

//VARIANT

function* createVariantByProduct({ payload }: PayloadAction<any>) {
  const { data } = payload;
  try {
    yield put(ProductActions.setLoading(true));

    const response: { success: boolean; data: any } = yield ProductRequest.addVariantByProduct(payload);
    yield put(ProductActions.setLoading(false));
    if (response.success) {
      const response: { success: boolean; data: any } = yield ProductRequest.getVariantByProduct(payload.productId);
      yield put(ProductActions.setVariant(response.data));
      message.success("Thêm variant thành công")
    } else {
      message.error("Thêm variant thất bại")
    }
  } catch (e) {
  }
}

function* updateVariant({ payload }: PayloadAction<any>): Generator<any, void, unknown> {
  const { id, data, productId } = payload;
  try {
    yield put(ProductActions.setLoading(true));
    const response: any = yield ProductRequest.updateVariant(id, data);
    yield put(ProductActions.setLoading(false));
    if (response.success) {
      const response: any = yield ProductRequest.getVariantByProduct(productId);
      yield put(ProductActions.setVariant(response.data));
      message.success("Chỉnh sửa variant thành công")
    } else {
    }
  } catch (error: any) {
    message.error("Cập nhật variant thất bại");
  }
}

function* fetchVariantByProductId({ payload }: PayloadAction<any>) {
  const { id, onSuccess = (rs: any) => { }, onFail = (rs: any) => { } } = payload;
  try {
    yield put(ProductActions.setLoading(true));
    const response: { success: boolean; data: any } = yield ProductRequest.getVariantByProduct(payload);
    yield put(ProductActions.setLoading(false));
    if (response.success) {
      yield put(ProductActions.setVariant(response.data));
      onSuccess(response.data);
    } else {
      onFail(response);
    }
  } catch (e) {
    onFail(e);
  }
}

function* deleteVariant({ payload }: any) {
  console.log("🚀 ~ payload:", payload)
  try {
    yield delay(100);
    const rs: DeleteProductResponse = yield ProductRequest.deleteVariant(payload.id);
    if (rs.success) {
      const response: { success: boolean; data: any } = yield ProductRequest.getVariantByProduct(payload.productId);
      yield put(ProductActions.setVariant(response.data));
      message.success("Xóa variant thành công");
    } else {
      message.error("Xóa variant thất bại")
      throw rs.message;
    }
  } catch (error: any) {
    message.error("Xóa Xóa variant thất bại");
  }
}

export function* ProductSaga() {
  yield takeLeading(ProductActions.createProduct, createProduct);
  yield takeLeading(ProductActions.fetchProductById, fetchProductById);
  yield takeLeading(ProductActions.fetchPaginatedProducts, fetchPaginatedProducts);
  yield takeLatest(ProductActions.deleteProduct, deleteProduct)
  yield takeLatest(ProductActions.updateProduct, updateProduct);
  yield takeLatest(ProductActions.fetchVariantByProductId, fetchVariantByProductId);
  yield takeLatest(ProductActions.createVariantByProduct, createVariantByProduct);
  yield takeLatest(ProductActions.deleteVariant, deleteVariant);
  yield takeLatest(ProductActions.updateVariant, updateVariant);
}
