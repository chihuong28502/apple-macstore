import { PayloadAction } from "@reduxjs/toolkit";
import { put, takeLeading } from "redux-saga/effects";
import { ProductRequest } from "./request";
import { ProductActions } from "./slice";

function* createProduct({ payload }: PayloadAction<any>) {
  const { data, onSuccess = (rs: any) => { }, onFail = (rs: any) => { } } = payload;
  try {
    yield put(ProductActions.setLoading(true));
    const response: { success: boolean; data: any } = yield ProductRequest.createProduct(data);
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
function* fetchPaginatedProducts({ payload }: PayloadAction<{ page: number; limit: number; categoryId?: string; minPrice?: number, maxPrice?: number }>) {
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

function* fetchCategories() {
  try {
    yield put(ProductActions.setLoading(true));

    const response: { success: boolean; data: any[] } = yield ProductRequest.getAllCategories();

    yield put(ProductActions.setLoading(false));

    if (response.success) {
      yield put(ProductActions.setCategories(response.data)); // Store categories in Redux state
    }
  } catch (e) {
    console.error("Error fetching categories:", e);
  }
}
export function* ProductSaga() {
  yield takeLeading(ProductActions.fetchCategories, fetchCategories);
  yield takeLeading(ProductActions.createProduct, createProduct);
  yield takeLeading(ProductActions.fetchProductById, fetchProductById);
  yield takeLeading(ProductActions.fetchPaginatedProducts, fetchPaginatedProducts); // Gộp phân trang và category
}
