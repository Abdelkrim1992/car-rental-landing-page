import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "itsyagaubxhhefduylvw.supabase.co" },
    ],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
