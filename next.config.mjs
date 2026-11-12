/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    cpus: 1
  }
};

export default nextConfig;

if (process.env.NODE_ENV === "development") {
  import("@opennextjs/cloudflare").then(m => m.initOpenNextCloudflareForDev());
}
