import "react-toastify/dist/ReactToastify.css";
// import localFont from "next/font/local";
import "@/app/globals.css";

import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";

import LoadingFixed from "@/components/Loading/LoadingFixed";
import { Providers } from "@/providers/providers";

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
  metadataBase: new URL('https://apple.nch.pics'),
  title: {
    default: 'Apple Store Vietnam | Cửa hàng Apple chính hãng',
    template: '%s | Apple Store Vietnam'
  },
  description: 'Mua sắm iPhone, iPad, MacBook và phụ kiện Apple chính hãng. Giá tốt nhất, bảo hành chính hãng, giao hàng toàn quốc.',
  keywords: ['apple', 'iphone', 'macbook', 'ipad', 'apple watch', 'vietnam'],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://apple.nch.pics',
    siteName: 'Apple Store Vietnam',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Apple Store Vietnam'
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  }
}

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
