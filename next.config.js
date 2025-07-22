/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for easier deployment
  output: "standalone",

  // Disable telemetry for offline use
  telemetry: {
    disabled: true,
  },

  // Configure for local network access
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ]
  },

  // Experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: ["mongodb"],
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },

  // Images configuration
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
