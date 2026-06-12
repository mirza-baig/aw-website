import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Enable Turbopack file system caching for faster dev startup (beta)
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  // use this configuration to ensure that only images from the whitelisted domains
  // can be served from the Next.js Image Optimization API
  // see https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
  images: {
    remotePatterns: [
      {
        protocol: 'https', // matches your URL
        hostname: 'xmcloudcm.localhost', // allow this host
        port: '', // leave empty for default
        pathname: '/-/media/**', // Sitecore media path pattern
      },
            {
        protocol: 'https', // matches your URL
        hostname: 'www.dev.xmc.andersenwindows.com', // allow this host
        port: '', // leave empty for default
        pathname: '/-/media/**', // Sitecore media path pattern
      },
      {
        protocol: 'https',
        hostname: 'edge*.**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'xmc-*.**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'andersen.renoworks.com',
        port: '',
        pathname: '/_rwapi/**', // only Renoworks API images
      },
    ],
  },
  // use this configuration to serve the sitemap.xml and robots.txt files from the API route handlers
  rewrites: async () => {
    return [
      // sitemap route
      {
        source: '/sitemap:id([\\w-]{0,}).xml',
        destination: '/api/sitemap',
        locale: false,
      },
      // robots route
      {
        source: '/robots.txt',
        destination: '/api/aw/robots',
        locale: false,
      },
      // image sitemap
      {
        source: '/image-sitemap.xml',
        destination: '/api/aw/image-sitemap',
        locale: false,
      },
      // coveo sitemap route
      {
        source: '/coveo-sitemap.xml',
        destination: '/api/aw/coveo/sitemap',
        locale: false,
      },
      // techdocs sitemap route
      {
        source: '/techdocs-sitemap.xml',
        destination: '/api/aw/techdocs-sitemap',
        locale: false,
      },
    ];
  },

  async headers() {
    return [
      // Allow robots for media requests
      {
        source: '/-/media/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'all',
          },
        ],
      },
    ];
  },

  allowedDevOrigins: ['*.local.xmc.*.*','*.local.xmc.*.*.*'],

  serverExternalPackages: ['sequelize', 'pg-hstore'],
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
