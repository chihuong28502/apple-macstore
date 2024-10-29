import "react-toastify/dist/ReactToastify.css";
import "@/app/globals.css";

import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";

import LoadingFixed from "@/components/Loading/LoadingFixed";
import { Providers } from "@/providers/providers";



export const metadata: Metadata = {
  title: "MAC STORE",
  description: "MAC STORE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning >
      <body
      >
        <Providers>
          {children}
          <ToastContainer />
          <LoadingFixed />
        </Providers>
      </body>
    </html>
  );
}
