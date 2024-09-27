"use client";
import React from "react";
import { store } from "../services/store";
import InitComponent from "./InitComponent";
import { Provider } from "react-redux";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <InitComponent />
      {children}
    </Provider>
  );
}
