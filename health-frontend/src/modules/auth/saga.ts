import { AppAction } from "@/core/components/AppSlice";
import CONST from "@/core/services/const";
import { setConfigAxios } from "@/core/services/fetch";
import SysStorage from "@/core/services/storage";
import { getCookie } from "@/hooks/Cookies";
import { PayloadAction } from "@reduxjs/toolkit";
import jwt from 'jsonwebtoken';
import { get } from "lodash";
import { call, delay, put, takeLeading } from "redux-saga/effects";
import { AuthRequest } from "./request";
import { AuthActions } from "./slice";

function* login({ payload }: PayloadAction<any>) {
  const {
    email,
    password,
    onSuccess = (rs: any) => { },
    onFail = (error: any) => { },
  } = payload;
  try {
    yield delay(500);
    const { success, message, data } = yield AuthRequest.login({
      email,
      password,
    });
    console.log("🚀 ~ data:", data)

    if (success) {
      yield put(AuthActions.setLoginInfo(data?.user));
      onSuccess && onSuccess(data?.user);
    } else {
      onFail && onFail(message, data);
    }
  } catch (e) { }
}

function* register({ payload }: PayloadAction<any>) {
  const { onSuccess = (rs: any) => { }, onFail = (rs: any) => { }, data } = payload;
  try {
    yield put(AppAction.showLoading());
    const res: { success: boolean; data: any } = yield AuthRequest.register(data);
    yield put(AppAction.hideLoading());

    if (res.success) {
      yield put(AuthActions.setUser(res.data));
      onSuccess && onSuccess(res);
    } else {
      onFail && onFail(res);
    }
  } catch (e) {
    onFail && onFail(e);
  }
}

function* getInfoUser({ payload }: PayloadAction<any>): Generator<any, void, any> {
  const { onSuccess, onError } = payload;
  try {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      const decoded: any = jwt.decode(accessToken);
      const userId = decoded?._id;
      if (!userId) {
        throw new Error('Invalid token');
      }
      const response = yield call(AuthRequest.getUserInfo, userId);

      if (accessToken) {
        yield put(AuthActions.setUser(response.data));
        onSuccess && onSuccess();
      } else {
        yield put(AuthActions.getInfoUser({}));
      }
    } else {
      yield put(AuthActions.getInfoUser({}));
    }
  } catch (error: any) {
    yield put(AuthActions.getInfoUser({}));
  }
}
export function* AuthSaga() {
  yield takeLeading(AuthActions.login, login);
  yield takeLeading(AuthActions.register, register);
  yield takeLeading(
    AuthActions.getInfoUser,
    getInfoUser
  );
}
