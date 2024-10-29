"use client";
import { useEffect, useState } from "react";

import LoadingFixed from "@/components/Loading/LoadingFixed";
import { useAppDispatch } from "@/core/services/hook";
import { AuthActions } from "@/modules/auth/slice";
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    setIsLoading(false);
    dispatch(AuthActions.getInfoUser({}));
    console.log("AuthProvider");
  }, []);
  return <div>{isLoading ? <LoadingFixed isOpenProps /> : children}</div>;
};

export default AuthProvider;
