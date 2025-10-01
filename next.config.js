/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // SUPPRIMER swcMinify : plus supporté
  // swcMinify: true,
  
  images: {
    domains: ['drive.google.com', 'lh3.googleusercontent.com'],
    formats: ['image/webp', 'image/avif'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/candidats',
        destination: '/candidates',
      },
      {
        source: '/tableau-de-bord',
        destination: '/dashboard',
      },
    ];
  },
  env: {
    SITE_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000',
  },
};

module.exports = nextConfig;
