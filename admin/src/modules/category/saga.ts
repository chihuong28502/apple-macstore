import { PayloadAction } from "@reduxjs/toolkit";
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
    if (response.success) {
      message.success("Thêm danh mục thành công");
      const response: { success: boolean; data: any[] } = yield CategoryRequest.getAllCategories();
      yield put(CategoryActions.setCategories(response.data));
      yield put(CategoryActions.setLoading(false));
    } else {
    }
  } catch (e) {
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
    const { id } = payload;
    const rs: DeleteCategoryResponse = yield CategoryRequest.deleteCategory(id);
    if (rs.success === true) {
      const response: { success: boolean; data: any[] } = yield CategoryRequest.getAllCategories();
      message.success("Xóa danh mục thành công");
      yield put(CategoryActions.setCategories(response.data));
    } else {
      message.error("Xóa danh mục thất bại");
    }
  } catch (error: any) {
    message.error("Xóa danh mục thất bại Catch");
  }
}

function* updateCategory({ payload }: PayloadAction<{ id: string; data: any; onSuccess: () => void }>): Generator<any, void, any> {
  try {
    yield delay(100);
    const { id, data, onSuccess } = payload;

    // Pass both `id` and `data` as separate arguments
    const rs = yield CategoryRequest.updateCategory(id, data);

    if (rs.success) {
      message.success("Sửa danh mục thành công");
      const response = yield CategoryRequest.getAllCategories();
      yield put(CategoryActions.setCategories(response.data));
    } else {
      message.error("Sửa danh mục thất bại");
    }
  } catch (error: any) {
    message.error("An error occurred while updating the category.");
  }
}

export function* CategorySaga() {
  yield takeLeading(CategoryActions.fetchCategories, fetchCategories);
  yield takeLatest(CategoryActions.deleteCategory, deleteCategory)
  yield takeLatest(CategoryActions.updateCategory, updateCategory)
  yield takeLeading(CategoryActions.createCategory, createCategory)
}
