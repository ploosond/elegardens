import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.net',
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
    reactCompiler: false,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(withPayload(nextConfig));
