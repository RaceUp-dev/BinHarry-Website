import type { Metadata } from 'next';

type Winner = {
  rank: 1 | 2 | 3;
  title: string;
  team: string;
  imagePlaceholder: string;
  githubUrl: string;
};

type GameJamYear = {
  year: string;
  winners: Winner[];
};

const gameJamResults: GameJamYear[] = [
  {
    year: '2025',
    winners: [
      {
        rank: 1,
        title: 'Nom du jeu gagnant #1',
        team: 'Equipe Alpha',
        imagePlaceholder: 'Placeholder image - jeu #1',
        githubUrl: '#',
      },
      {
        rank: 2,
        title: 'Nom du jeu gagnant #2',
        team: 'Equipe Beta',
        imagePlaceholder: 'Placeholder image - jeu #2',
        githubUrl: '#',
      },
      {
        rank: 3,
        title: 'Nom du jeu gagnant #3',
        team: 'Equipe Gamma',
        imagePlaceholder: 'Placeholder image - jeu #3',
        githubUrl: '#',
      },
    ],
  },
  {
    year: '2024',
    winners: [
      {
        rank: 1,
        title: 'Nom du jeu gagnant #1',
        team: 'Equipe Delta',
        imagePlaceholder: 'Placeholder image - jeu #1',
        githubUrl: '#',
      },
      {
        rank: 2,
        title: 'Nom du jeu gagnant #2',
        team: 'Equipe Epsilon',
        imagePlaceholder: 'Placeholder image - jeu #2',
        githubUrl: '#',
      },
      {
        rank: 3,
        title: 'Nom du jeu gagnant #3',
        team: 'Equipe Zeta',
        imagePlaceholder: 'Placeholder image - jeu #3',
        githubUrl: '#',
      },
    ],
  },
];

const rankLabel: Record<Winner['rank'], string> = {
  1: '1er',
  2: '2eme',
  3: '3eme',
};

export const metadata: Metadata = {
  title: 'GameJam',
  description: 'Podium des jeux gagnants de la GameJam BinHarry.',
};

export default function GameJamPage() {
  return (
    <section className="gamejam-page">
      <header className="gamejam-header">
        <span className="section-label">GAMEJAM</span>
        <h1 className="gamejam-title">Podium des jeux gagnants</h1>
        <p className="gamejam-subtitle">
          Retrouvez les 3 meilleurs jeux de chaque edition de notre GameJam etudiante.
        </p>
      </header>

      <div className="gamejam-years">
        {gameJamResults.map((edition) => (
          <article key={edition.year} className="gamejam-year-block">
            <div className="gamejam-year-head">
              <h2>Edition {edition.year}</h2>
            </div>
            <div className="gamejam-podium-grid">
              {edition.winners.map((winner) => (
                <div
                  key={`${edition.year}-${winner.rank}`}
                  className={`gamejam-card gamejam-rank-${winner.rank}`}
                >
                  <div className="gamejam-rank-badge">{rankLabel[winner.rank]}</div>
                  <div className="gamejam-image-placeholder">{winner.imagePlaceholder}</div>
                  <div className="gamejam-card-content">
                    <h3>{winner.title}</h3>
                    <p>{winner.team}</p>
                    <a href={winner.githubUrl} className="gamejam-link">
                      Lien GitHub (a remplacer)
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
