/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config, { isServer }) => {
    config.experiments = { layers: true, topLevelAwait: true }
    if (!isServer) {
      config.resolve.fallback.fs = false
      config.resolve.fallback.dns = false
      config.resolve.fallback.net = false
      config.resolve.fallback.tls = false
    }
    return config
  },
  reactStrictMode: true,
}
