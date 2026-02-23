import type { Metadata } from 'next';
import Image from 'next/image';

type Winner = {
  rank: 1 | 2 | 3;
  title: string;
  team: string;
  imageFile: string;
  githubUrl?: string;
};

type GameEntry = {
  id: string;
  title: string;
  team: string;
  imageFile: string;
  githubUrl?: string;
  topLabel?: string;
};

type GameJamYear = {
  year: string;
  winners: Winner[];
  allGames: GameEntry[];
};

const gameJamResults: GameJamYear[] = [
  {
    year: '2026',
    winners: [
      {
        rank: 1,
        title: 'La Legende Deux Gustave Et Les Couleurs Perdu',
        team: 'Les Table Tope',
        imageFile: 'La l\u00e9gende deux gustave et les couleurs Perdu.png',
      },
      {
        rank: 2,
        title: 'Nova and his missing sister',
        team: 'Index Error Line 69',
        imageFile: 'Nova and his missing sister.png',
      },
      {
        rank: 3,
        title: "Freddy Blanchard's Pizza Simulator",
        team: 'celeR',
        imageFile: 'FNAF Blanchard.png',
        githubUrl: 'https://github.com/nallaLH/GameJam4.git',
      },
    ],
    allGames: [
      {
        id: '2026-top-4',
        title: 'Baddielands',
        team: 'Ubergames',
        imageFile: 'Baddielands.png',
        topLabel: 'Top 4',
      },
      {
        id: '2026-top-5',
        title: 'Otamotone',
        team: 'Poupoule et Poulette',
        imageFile: 'Otamotone.png',
        githubUrl: 'https://github.com/nar0ji/otamatone',
        topLabel: 'Top 5',
      },
      {
        id: '2026-game-6',
        title: 'CuistoBongo',
        team: 'Equipe non renseignee',
        imageFile: 'cuistoBongo.png',
        githubUrl: 'https://iut-info.univ-reims.fr/gitlab/sauv0045/gj-4-team-bamboo',
      },
      {
        id: '2026-game-7',
        title: 'Beesounours',
        team: 'Equipe non renseignee',
        imageFile: 'Beesounours.png',
        githubUrl: 'https://reshomy.itch.io/beesounours',
      },
    ],
  },
];

const getGameJamImagePath = (imageFile: string) => encodeURI(`/asset/GameJam/${imageFile}`);

const rankLabel: Record<Winner['rank'], string> = {
  1: '1er',
  2: '2eme',
  3: '3eme',
};

export const metadata: Metadata = {
  title: 'GameJam',
  description: 'Decouvrez tous les jeux de chaque edition et le podium choisi par la communaute.',
};

export default function GameJamPage() {
  return (
    <section className="gamejam-page">
      <header className="gamejam-header">
        <span className="section-label">GAMEJAM</span>
        <h1 className="gamejam-title">Creer, partager, progresser</h1>
        <p className="gamejam-subtitle">
          La GameJam BinHarry met la creation et l&apos;entraide au premier plan.
          Le podium met en avant les coups de coeur de la communaute, mais tous les jeux de chaque edition sont accessibles ci-dessous.
        </p>
      </header>

      <div className="gamejam-years">
        {gameJamResults.map((edition) => (
          <article key={edition.year} className="gamejam-year-block">
            <div className="gamejam-year-head">
              <h2>Edition {edition.year}</h2>
            </div>
            <div className="gamejam-year-intro">
              <h3>Podium de la communaute</h3>
              <p>Trois projets mis en avant selon les votes et retours des etudiants.</p>
            </div>
            <div className="gamejam-podium-grid">
              {edition.winners.map((winner) => (
                <div
                  key={`${edition.year}-${winner.rank}`}
                  className={`gamejam-card gamejam-rank-${winner.rank}`}
                >
                  <div className="gamejam-rank-badge">{rankLabel[winner.rank]}</div>
                  <div className="gamejam-image-placeholder">
                    <Image
                      src={getGameJamImagePath(winner.imageFile)}
                      alt={winner.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className="gamejam-image"
                    />
                  </div>
                  <div className="gamejam-card-content">
                    <h3>{winner.title}</h3>
                    <p>{winner.team}</p>
                    {winner.githubUrl ? (
                      <a href={winner.githubUrl} className="gamejam-link" target="_blank" rel="noreferrer">
                        Voir le GitHub
                      </a>
                    ) : (
                      <span className="gamejam-link gamejam-link-disabled">Pas de lien GitHub</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="gamejam-all-games">
              <div className="gamejam-all-games-head">
                <h3>Tous les jeux de l&apos;edition {edition.year}</h3>
                <p>Explore l&apos;ensemble des projets realises pendant la GameJam.</p>
              </div>
              <div className="gamejam-all-games-grid">
                {edition.allGames.map((game) => (
                  <div key={game.id} className="gamejam-all-game-card">
                    {game.topLabel && <span className="gamejam-top-badge">{game.topLabel}</span>}
                    <div className="gamejam-all-game-image">
                      <Image
                        src={getGameJamImagePath(game.imageFile)}
                        alt={game.title}
                        fill
                        sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="gamejam-image"
                      />
                    </div>
                    <div className="gamejam-all-game-content">
                      <h4>{game.title}</h4>
                      <p>{game.team}</p>
                      {game.githubUrl ? (
                        <a href={game.githubUrl} className="gamejam-link" target="_blank" rel="noreferrer">
                          Voir le GitHub
                        </a>
                      ) : (
                        <span className="gamejam-link gamejam-link-disabled">Pas de lien GitHub</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
