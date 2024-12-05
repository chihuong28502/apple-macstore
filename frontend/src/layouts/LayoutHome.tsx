"use client";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { useWindowSize } from "@/hooks/breakpoint";
import { useTheme } from "next-themes";
import ChangePassword from "@/components/changePassword/ChangePassword";

const LayoutHome = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { width } = useWindowSize();
  const { setTheme, } = useTheme();
  useEffect(() => {

  }, [width]);
  useEffect(() => {
    setTheme("light")
  }, [])

  const hiddenFooterPaths :any = [];

  // Kiểm tra xem pathname có thuộc mảng các path cần ẩn Footer hay không
  const shouldHideFooter = hiddenFooterPaths.some((path :any) => pathname.includes(path));
  return (
    <div className="overflow-hidden flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden mt-12 pt-1">
        <main className="flex-1 overflow-auto px-4 flex flex-col justify-between bg-mainContent">
          <div className="flex-grow">{children}</div>
          <ChangePassword />
          {!shouldHideFooter && (
            <div>
              <Footer />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LayoutHome;
