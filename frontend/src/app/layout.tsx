import "react-toastify/dist/ReactToastify.css";
// import localFont from "next/font/local";
import "@/app/globals.css";

import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";

import LoadingFixed from "@/components/Loading/LoadingFixed";
import { Providers } from "@/providers/providers";
import ChangePassword from "@/components/changePassword/ChangePassword";

// const geistSans = localFont({
//   src: "@/app/fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "@/app/fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

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
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
