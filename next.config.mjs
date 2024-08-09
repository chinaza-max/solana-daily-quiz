/** @type {import('next').NextConfig} */


const nextConfig = {

  transpilePackages: ['pino-pretty'],
  experimental: {
    serverComponentsExternalPackages: ['sequelize'],
  },


};

export default nextConfig;
