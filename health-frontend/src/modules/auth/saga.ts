import { AppAction } from "@/core/components/AppSlice";
import { getCookie } from "@/hooks/Cookies";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import jwt from 'jsonwebtoken';
import { toast } from "react-toastify";
import { call, delay, put, takeLeading } from "redux-saga/effects";
import { AuthRequest } from "./request";
import { AuthActions } from "./slice";

// Utility function to decode token and get userId
const getUserIdFromToken = () => {
  const accessToken = getCookie('accessToken');
  if (accessToken) {
    const decoded: any = jwt.decode(accessToken);
    return decoded?._id || null;
  }
  return null;
};

// Utility function to handle API errors
function* handleApiError(error: any, onFail: (error: any) => void) {
  if (error instanceof AxiosError) {
    toast.error(error?.response?.data?.error);
  } else {
    toast.error("An unexpected error occurred.");
  }
  onFail && onFail(error);
}

function* login({ payload }: PayloadAction<any>): Generator<any, void, any> {
  const { email, password, onSuccess = () => { }, onFail = () => { } } = payload;
  try {
    yield delay(500);
    const { success, message, data } = yield call(AuthRequest.login, { email, password });

    const userId = getUserIdFromToken();
    if (userId) {
      const response = yield call(AuthRequest.getUserInfo, userId);
      yield put(AuthActions.setUser(response.data));
      onSuccess && onSuccess(data?.user);
    } else {
      yield put(AuthActions.getInfoUser({}));
    }

    if (!success) {
      onFail && onFail(message, data);
    }
  } catch (error) {
    yield* handleApiError(error, onFail);
  }
}

function* register({ payload }: PayloadAction<any>): Generator<any, void, any> {
  const { onSuccess = () => { }, onFail = () => { }, data } = payload;
  try {
    yield put(AppAction.showLoading());
    const res: { success: boolean; data: any } = yield call(AuthRequest.register, data);
    yield put(AppAction.hideLoading());

    if (res.success) {
      onSuccess && onSuccess(res);
    } else {
      onFail && onFail(res);
    }
  } catch (error: any) {
    yield* handleApiError(error, onFail);
    yield put(AppAction.hideLoading());
  }
}

function* getInfoUser({ payload }: PayloadAction<any>): Generator<any, void, any> {
  const { onSuccess = () => { }, onError = () => { } } = payload;
  try {
    const userId = getUserIdFromToken();
    if (userId) {
      const response = yield call(AuthRequest.getUserInfo, userId);
      yield put(AuthActions.setUser(response.data));
      onSuccess && onSuccess();
    } else {
      yield put(AuthActions.getInfoUser({}));
    }
  } catch (error) {
    yield put(AuthActions.getInfoUser({}));
    onError && onError(error);
  }
}

function* logout(): Generator<any, void, any> {
  try {
    const { success } = yield call(AuthRequest.logout);
    if (success) {
      yield put(AuthActions.logout({}));
    }
  } catch (error) {
    yield* handleApiError(error, () => { });
  }
}

export function* AuthSaga() {
  yield takeLeading(AuthActions.login, login);
  yield takeLeading(AuthActions.register, register);
  yield takeLeading(AuthActions.getInfoUser, getInfoUser);
  yield takeLeading(AuthActions.logout, logout);
}
