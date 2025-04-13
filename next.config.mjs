/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.luongtuan.xyz',
      },
      {
        protocol: 'https',
        hostname: 'mediafile.qdnd.vn',
      },
      {
        protocol: 'https',
        hostname: 'vnanet.vn',
      },
    ],
  },
};

export default nextConfig;
