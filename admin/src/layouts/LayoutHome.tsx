"use client";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import SideBar from "@/components/sidebars/Sidebar";
import { useWindowSize } from "@/hooks/breakpoint";
import { ReactNode, useEffect, useState } from "react";

const LayoutHome = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpenMenuMobile, setIsOpenMenuMobile] = useState(false);
  const { width } = useWindowSize();
  useEffect(() => {
    setIsMobile(width <= 1024);
  }, [width]);
  return (
    <div className="h-screen flex flex-col">
      <Header
        setCollapsed={setCollapsed}
        collapsed={collapsed}
        isMobile={isMobile}
        setIsOpenMenuMobile={setIsOpenMenuMobile}
        isOpenMenuMobile={isOpenMenuMobile}
      />
      <div className="flex flex-1 overflow-hidden">
        <SideBar collapsed={collapsed} />
        <main className="flex-1 overflow-auto p-4 flex flex-col justify-between bg-mainContent">
          <div className="flex-grow">{children}</div>
          <div className="">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default LayoutHome;
