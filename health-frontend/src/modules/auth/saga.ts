import { AppAction } from "@/core/components/AppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { put, takeLeading,delay } from "redux-saga/effects";
import { AuthRequest } from "./request";
import { AuthActions } from "./slice";
import CONST from "@/core/services/const";
import { get } from "lodash";
import { setConfigAxios } from "@/core/services/fetch";
import { SysStorage } from "@/core/services/storage";

function* login({ payload }: PayloadAction<any>) {
  const {
    email,
    password,
    onSuccess = (rs: any) => { },
    onFail = (error: any) => { },
  } = payload;
  try {
    // yield put(AppAction.showLoading());
    yield delay(500);
    const { success, message, data } = yield AuthRequest.login({
      email,
      password,
    });
    // yield put(AppAction.hideLoading());
    if (success) {
      //login success
      const atStorage = SysStorage(CONST.STORAGE.ACCESS_TOKEN);
      const accessToken = get(data, "accessToken");
      yield atStorage.set(accessToken);

      //saved refresh token
      const refreshTokenStorage = SysStorage(CONST.STORAGE.REFRESH_TOKEN);
      const refreshToken = get(data, "refreshToken");
      yield refreshTokenStorage.set(refreshToken);

      const User = SysStorage(CONST.STORAGE.USER);
      const setUser = get(data, "user.username");
      yield User.set(setUser);

      const UserInfo = SysStorage("USER_INFO");
      yield UserInfo.set(JSON.stringify(get(data, "user") || {}));

      yield put(AuthActions.setLoginInfo(data?.user));
      setConfigAxios(accessToken);
      onSuccess && onSuccess(data?.user);
    } else {
      onFail && onFail(message, data);
    }
  } catch (e) { }
}

function* register({ payload }: PayloadAction<any>) {
  const { onSuccess = (rs: any) => {}, onFail = (rs: any) => {}, data } = payload;
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

export function* AuthSaga() {
  yield takeLeading(AuthActions.login, login);
  yield takeLeading(AuthActions.register, register);
}
