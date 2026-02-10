import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions Légales',
  description: 'Mentions légales du site BinHarry, BDE du BUT Informatique de Reims.',
};

// Page dynamique (rendu côté serveur pour OpenNext)
export const dynamic = 'force-dynamic';

export default function MentionsLegales() {
  return (
    <article className="dev-page">
      <h1>Mentions Légales</h1>
      <p>Informations légales concernant le site BinHarry</p>
      <span className="dev-badge">🚧 Page en développement 🚧</span>
    </article>
  );
}
