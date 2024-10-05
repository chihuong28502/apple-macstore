"use client";
import { ReactNode, useState } from "react";
import SideBar from "@/components/sidebars/Sidebar";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const LayoutHome = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="h-screen flex flex-col">
      <Header setCollapsed={setCollapsed} collapsed={collapsed} />
      <div className="flex flex-1 overflow-hidden">
        <SideBar collapsed={collapsed} />
        <main className="flex-1 overflow-auto p-4 flex flex-col justify-between">
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
