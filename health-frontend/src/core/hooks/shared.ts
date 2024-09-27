import { useEffect, useState } from "react";
export const useIsLogin = () => {
  const [isLogin, setIsLogin] = useState(false);

  const checkLoginStatus = () => {
    const USER_INFO = localStorage.getItem("USER_INFO");
    const REFRESH_TOKEN = localStorage.getItem("REFRESH_TOKEN");
    const ACCESS_TOKEN = localStorage.getItem("ACCESS_TOKEN");

    setIsLogin(Boolean(USER_INFO && REFRESH_TOKEN && ACCESS_TOKEN));
  };

  useEffect(() => {
    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return isLogin;
};

export const clearLocalUser = () => {
  localStorage.removeItem("USER_INFO");
  localStorage.removeItem("REFRESH_TOKEN");
  localStorage.removeItem("ACCESS_TOKEN");
};
