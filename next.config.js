/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config) => {
    config.experiments = { layers: true, topLevelAwait: true }
    return config
  },
  reactStrictMode: true,
}
