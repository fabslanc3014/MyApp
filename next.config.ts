import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://m.gohumano.com/apislim4lance/:path*',
      },
    ];
  },
};

export default nextConfig;