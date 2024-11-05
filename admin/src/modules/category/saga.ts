import { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { delay, put, takeLatest, takeLeading } from "redux-saga/effects";

import { CategoryRequest } from "./request";
import { CategoryActions } from "./slice";
import { CategoryType } from "./type";
import { message } from "antd";
interface DeleteCategoryResponse {
  success: boolean;
  message?: string;
}
function* createCategory({ payload }: PayloadAction<{ data: CategoryType }>) {
  const { data } = payload;
  try {
    yield put(CategoryActions.setLoading(true));
    const response: { success: boolean; data: any } = yield CategoryRequest.createCategory(data);
    yield put(CategoryActions.setLoading(false));
    if (response.success) {

      message.success("Tạo Category thành công");
    } else {
    }
  } catch (e) {
  }
}

function* fetchCategoryById({ payload }: PayloadAction<any>) {
  const { id, onSuccess = (rs: any) => { }, onFail = (rs: any) => { } } = payload;
  try {
    yield put(CategoryActions.setLoading(true));
    const response: { success: boolean; data: any } = yield CategoryRequest.getCategoryById(payload);
    yield put(CategoryActions.setLoading(false));
    if (response.success) {
      yield put(CategoryActions.setCategoryById(response.data));
      onSuccess(response.data);
    } else {
      onFail(response);
    }
  } catch (e) {
    onFail(e);
  }
}

function* fetchCategories() {
  try {
    yield put(CategoryActions.setLoading(true));

    const response: { success: boolean; data: any[] } = yield CategoryRequest.getAllCategories();

    yield put(CategoryActions.setLoading(false));

    if (response.success) {
      yield put(CategoryActions.setCategories(response.data));
    }
  } catch (e) {
    console.error("Error fetching categories:", e);
  }
}

function* deleteCategory({ payload }: any) {
  try {
    yield delay(100);
    const { id, onSuccess } = payload;
    const rs: DeleteCategoryResponse = yield CategoryRequest.deleteCategory(id);
    if (rs.success) {
      const response: { success: boolean; data: any[] } = yield CategoryRequest.getAllCategories();
      message.success("Xóa danh mục thành công");
      yield put(CategoryActions.setCategories(response.data));
      onSuccess();
    } else {
      throw rs.message;
    }
  } catch (error: any) {
    message.error(error);
  }
}

function* updateCategory({ payload }: PayloadAction<{ id: string; data: any; onSuccess: () => void }>): Generator<any, void, any> {
  try {
    yield delay(100);
    const { id, data, onSuccess } = payload;

    // Pass both `id` and `data` as separate arguments
    const rs = yield CategoryRequest.updateCategory(id, data);

    if (rs.success) {
      const response = yield CategoryRequest.getAllCategories();
      message.success("Xóa danh mục thành công");
      yield put(CategoryActions.setCategories(response.data));
      if (onSuccess) onSuccess();
    } else {
      throw new Error(rs.message);
    }
  } catch (error: any) {
    message.error(error.message || "An error occurred while updating the category.");
  }
}

export function* CategorySaga() {
  yield takeLeading(CategoryActions.fetchCategories, fetchCategories);
  yield takeLeading(CategoryActions.fetchCategoryById, fetchCategoryById);
  yield takeLatest(CategoryActions.deleteCategory, deleteCategory)
  yield takeLatest(CategoryActions.updateCategory, updateCategory)
  yield takeLeading(CategoryActions.createCategory, createCategory)
}
