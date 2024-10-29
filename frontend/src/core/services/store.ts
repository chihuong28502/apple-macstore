import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import { reducers } from "./reducer";
import rootSaga from "./saga";
const sagaMidleware = createSagaMiddleware();

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMidleware),
});

sagaMidleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
