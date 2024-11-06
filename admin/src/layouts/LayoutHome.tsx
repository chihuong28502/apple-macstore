"use client";
import { ReactNode, useEffect } from "react";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { useWindowSize } from "@/hooks/breakpoint";
import SideBar from "@/components/sidebars/Sidebar";

const LayoutHome = ({ children }: { children: ReactNode }) => {
  const { width } = useWindowSize();
  useEffect(() => {
  }, [width]);
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* <SideBar collapsed={false} /> */}
        <main className="flex-1 overflow-auto p-2 flex flex-col justify-between bg-mainContent">
          <div className="flex-grow">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default LayoutHome;
