/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/uyirtechsolutions-service/pawport/main/images/**',
      },
    ],
  },
  // Keep react-leaflet working (it needs client-side rendering)
  transpilePackages: ['react-leaflet', '@react-leaflet/core', 'leaflet'],
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
}

module.exports = nextConfig