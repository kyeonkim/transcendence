/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
      serverActions: true,
    },
    reactStrictMode: false,

    webpack5: true,
    webpack: (config) => {
      config.resolve.fallback = { fs: false };
  
      return config;
    },
}

module.exports = nextConfig

