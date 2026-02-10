import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CGV',
  description: 'Conditions Générales de Vente du site BinHarry, BDE du BUT Informatique de Reims.',
};

// Page dynamique (rendu côté serveur pour OpenNext)
export const dynamic = 'force-dynamic';

export default function CGV() {
  return (
    <article className="dev-page">
      <h1>Conditions Générales de Vente</h1>
      <p>CGV applicables aux services et produits BinHarry</p>
      <span className="dev-badge">🚧 Page en développement 🚧</span>
    </article>
  );
}
