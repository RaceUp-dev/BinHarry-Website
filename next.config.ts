import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Optimisations pour Cloudflare avec OpenNext
  images: {
    unoptimized: true, // Cloudflare ne supporte pas l'optimisation d'images Next.js
  },
  // Réduction du cache pour Cloudflare Pages (limite de 25 MiB par fichier)
  onDemandEntries: {
    maxInactiveAge: 15 * 1000, // 15 secondes
    pagesBufferLength: 2,
  },
};

export default nextConfig;
