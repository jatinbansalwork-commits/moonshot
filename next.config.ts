import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["framer-motion", "lottie-react", "lucide-react"],
  },
  async redirects() {
    return [
      {
        source: "/fun",
        destination: "/",
        permanent: true,
      },
      {
        source: "/fun/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/ideas",
        destination: "/",
        permanent: true,
      },
      {
        source: "/ideas/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/archive",
        destination: "/",
        permanent: true,
      },
      {
        source: "/recent-work",
        destination: "/",
        permanent: false,
      },
      {
        source: "/Recentwork",
        destination: "/",
        permanent: false,
      },
      {
        source: "/projects",
        destination: "/",
        permanent: true,
      },
      {
        source: "/projects/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
