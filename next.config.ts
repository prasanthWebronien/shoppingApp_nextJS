/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['tanlux.s3.eu-north-1.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.obemannadbutik.se',
      },
    ],
  },
  webpack(config:any) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            exportType: 'default',
          },
        },
      ],
    });

    return config;
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/sapp',
        permanent: false, // use true if it's a permanent redirect
      },
    ];
  },

  // Disable Turbopack
  experimental: {
    turbopack: false,
  },
};

module.exports = nextConfig;
