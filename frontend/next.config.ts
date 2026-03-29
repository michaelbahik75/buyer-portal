import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@mantine/core', '@mantine/hooks'],
};

export default nextConfig;
