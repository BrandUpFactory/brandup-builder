import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignoriert ESLint-Warnungen beim Vercel-Build
  },
}

export default nextConfig
