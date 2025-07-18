import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  output: 'export' as const,
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
  swcMinify: true
};

export default withNextIntl(nextConfig);
