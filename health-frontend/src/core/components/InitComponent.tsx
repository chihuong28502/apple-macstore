"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const DynamicGlobalLoading = dynamic(() => import("./GlobalLoading"), {
  ssr: false,
});
function InitComponent() {
  const pathname = usePathname();
  return (
    <>
      {pathname !== "/order" && pathname !== "/" && <DynamicGlobalLoading />}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default InitComponent;
