import { fileURLToPath } from 'url'
import { dirname } from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Self-contained server output for the Docker runner stage.
  output: 'standalone',
  // Several lockfiles exist above this directory; pin the trace root here.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // Keeps the icon barrel from landing whole in the client bundle.
    optimizePackageImports: ['@phosphor-icons/react'],
  },
}

export default nextConfig
