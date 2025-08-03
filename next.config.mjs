/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  trailingSlash: true, // optional, depends on your routing preference
  images: {
    unoptimized: true, // only if you’re not using Image Optimization
  },
  // assetPrefix: 'https://smarttools.fun/',
};

export default nextConfig;
