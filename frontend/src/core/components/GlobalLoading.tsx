"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "../services/hook";
import { AppSelector } from "./AppSlice";
import Loading from "./Loading";
function GlobalLoading() {
  const isLoading = useAppSelector(AppSelector.isLoading);

  const [width, setWidth] = useState(window?.innerWidth);
  const [height, setHeight] = useState(window?.innerHeight);

  useEffect(() => {
    window?.addEventListener("resize", () => {
      setWidth(window?.innerWidth);
      setHeight(window?.innerHeight);
    });
    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return isLoading ? (
    <div className="fixed inset-0 z-[99] flex justify-center items-center">
      <div className="absolute inset-0 bg-darkBgFooter opacity-90"></div>
      <div className="z-10">
        <Loading />
      </div>
    </div>
  ) : (
    <></>
  );
}

export default GlobalLoading;
