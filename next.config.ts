/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  images: {
    // Replace the deprecated 'domains' with 'remotePatterns'
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Add this to fix the multiple lockfiles warning
  turbopack: {
    root: path.join(__dirname),
  },
};

module.exports = nextConfig;