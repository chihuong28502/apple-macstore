"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "../services/hook";
import { AppSelector } from "./AppSlice";
import styles from "./ProgressCustom.module.css";
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
        <div className="py-9 text-center w-[200px] ">
          {/* <Image
        src={Logo}
        className="w-[200px] rounded-[10px]"
        alt={""}
        width={200}
        height={200}
        priority
      /> */}
          <p className=" text-4xl font-black bg-gradient-to-r from-darkTextDiscoverService via-darkTextTitleBlue to-darkTextTitlePink bg-clip-text text-transparent uppercase">
            Health
          </p>
          <div className="w-full max-w-[200px]">
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default GlobalLoading;
