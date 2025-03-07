import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "movie-app-posters.s3.us-east-1.amazonaws.com"],
  },
  i18n: {
    locales: ["en", "es", "fr"],
    defaultLocale: "en",
  },
};

export default nextConfig;
