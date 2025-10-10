/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        ignored: [
          '**/pagefile.sys',
          '**/swapfile.sys',
          '**/DumpStack.log.tmp',
          '**/System Volume Information',
          '**/hiberfil.sys'
        ],
      };
    }
    return config;
  },
};

module.exports = nextConfig;