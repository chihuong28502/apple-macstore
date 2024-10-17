'use client'
import { useAppSelector } from "@/core/services/hook";
import styles from "./Loading.module.css"; // Import CSS Module
import { LoadingGlobalSelectors } from "@/modules/loading-global/slice";
import { cn } from "@/lib/utils";
type Props = {
  isOpenProps?: boolean
}
const LoadingFixed = ({isOpenProps}:Props) => {
  const isOpen = useAppSelector(LoadingGlobalSelectors.loadingGlobal);
  return (
    <div
      className={cn(
        "fixed z-50 inset-0  items-center justify-center bg-layout hidden",
        isOpen || isOpenProps && "flex"
      )}
    >
      <div id="page" className={styles.page}>
        <div id="container" className={styles.container}>
          <div className={styles.ring}></div>
          <div className={styles.ring}></div>
          <div className={styles.ring}></div>
          <div className={styles.ring}></div>
          <div id="h3" className={styles.h3}>
            Loading...
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingFixed;
