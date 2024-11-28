"use client";
import { ReactNode, useEffect } from "react";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import SideBar from "@/components/sidebars/Sidebar";
import { useWindowSize } from "@/hooks/breakpoint";

const LayoutHome = ({ children }: { children: ReactNode }) => {
  const { width } = useWindowSize();
  useEffect(() => {
  }, [width]);
  return (
    <div className="overflow-hidden flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden mt-12 pt-1">
        {/* <SideBar collapsed={false} /> */}
        <main className="flex-1 overflow-auto px-4 flex flex-col justify-between bg-mainContent">
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
