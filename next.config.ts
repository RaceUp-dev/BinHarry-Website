import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Optimisations pour Cloudflare avec OpenNext
  images: {
    unoptimized: true, // Cloudflare ne supporte pas l'optimisation d'images Next.js
  },
};

export default nextConfig;
