import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        pathname: "/**", // chấp nhận mọi đường dẫn con
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**", // chấp nhận mọi đường dẫn con
      },
    ],
  },
};

export default withNextIntl(nextConfig);
