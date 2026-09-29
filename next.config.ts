import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 產生精簡的獨立伺服器，給 Dockerfile 使用
  output: "standalone",
};

export default nextConfig;
