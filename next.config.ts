import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  // Mobile optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Explicitly disable static export
  experimental: {
    serverComponentsExternalPackages: []
  },
  // Force server-side rendering
  output: undefined, // Explicitly not 'export'
  // Ensure dynamic rendering
  staticPageGenerationTimeout: 0
};

export default withNextIntl(nextConfig);
