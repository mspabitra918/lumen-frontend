import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // /status was the old URL for the application status page; query strings
    // (?id=…, ?applicationId=…&email=…) are carried over automatically.
    return [{ source: "/status", destination: "/track-loan", permanent: true }];
  },
};

export default nextConfig;
