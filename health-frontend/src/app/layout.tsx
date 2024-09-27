// app/layout.tsx
import Auth from "@/core/components/Auth";
import type { Metadata } from "next";
import { Cabin, Orbitron } from "next/font/google";
// import "./globals.css";
import "@/app/globals.css";
import ReduxProvider from "@/core/components/ReduxProvider";
const inter = Cabin({ subsets: ["vietnamese"] });
const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "TopClick VN , Buff subscriber Youtube",
  description:
    "Topclick.vn. We offer powerful growth services for YouTube channels and Google Maps ratings improvement. Our expert team employs advanced strategies to increase subscribers, views, and engagement on YouTube. Simultaneously, we apply effective methods to enhance both the quantity and quality of reviews on Google Maps, helping your business stand out in local search results. Our services are designed to boost your online presence and visibility across these key platforms.",
  keywords:
    "topclick , topclick vn, top, YouTube growth, subscriber increase, video views boost, Google Maps ratings improvement, local SEO optimization, online reputation management, social media engagement, digital presence enhancement, YouTube algorithm optimization, Google My Business promotion",
  openGraph: {
    title: "TopClick VN , Buff subscriber Youtube",
    description:
      "Powerful growth services for YouTube channels and Google Maps ratings. Increase subscribers, views, and engagement on YouTube. Enhance reviews on Google Maps.",
    url: "https://www.topclick.vn",
    siteName: "TopClick VN",
    images: [
      {
        url: "https://www.topclick.vn/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TopClick VN , Buff subscriber Youtube",
    description:
      "Boost your YouTube channel and Google Maps ratings with our expert services. Increase subscribers, views, and engagement.",
    images: ["https://www.topclick.vn/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://www.topclick.vn",
  },
  verification: {
    google: "RMjRy8IvOadDquRzLlnC8UbmaddcDcVsfJIsG4bUvyo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@100;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ReduxProvider>
          <Auth>{children}</Auth>
        </ReduxProvider>
      </body>
    </html>
  );
}
