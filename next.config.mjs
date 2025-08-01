/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true, // optional, depends on your routing preference
  images: {
    unoptimized: true, // only if you’re not using Image Optimization
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://smarttools.fun/' : '',
};

export default nextConfig;
