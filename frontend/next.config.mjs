/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'resources.cryptocompare.com',
        port: '',
        pathname: '/asset-management/**',
      },
    ],
  },
};

export default nextConfig;
