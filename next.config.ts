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
      {
        protocol: 'https',
        hostname: 'utfs.io', // UploadThing CDN
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com', // UploadThing CDN alternative
      },
    ],
    // Cache optimized images for 60 seconds minimum
    minimumCacheTTL: 60,
    // Configure device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Configure image sizes for different layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Allow SVG images if needed
    dangerouslyAllowSVG: false,
    // Content security policy for images
    contentDispositionType: 'attachment',
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
