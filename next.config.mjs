/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  trailingSlash: true, // optional, depends on your routing preference
  images: {
    unoptimized: true, // only if you’re not using Image Optimization
  },
  // assetPrefix: 'https://smarttools.fun/',
  serverExternalPackages: ['onnxruntime-web', '@imgly/background-removal'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false };
      config.optimization = config.optimization || {};
      config.optimization.minimizer = config.optimization.minimizer?.map((plugin) => {
        if (plugin?.constructor?.name === 'TerserPlugin' && plugin.options?.terserOptions) {
          return {
            ...plugin,
            options: {
              ...plugin.options,
              terserOptions: {
                ...plugin.options.terserOptions,
                keep_fnames: true,
                keep_classnames: true,
              },
            },
          };
        }
        return plugin;
      }) || config.optimization.minimizer;
    }
    return config;
  },
};

export default nextConfig;
