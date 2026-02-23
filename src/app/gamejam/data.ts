export type Winner = {
  id: string;
  rank: 1 | 2 | 3;
  title: string;
  team: string;
  imageFile: string;
  githubUrl?: string;
};

export type GameEntry = {
  id: string;
  title: string;
  team: string;
  imageFile: string;
  githubUrl?: string;
  topLabel?: string;
};

export type GameJamYear = {
  year: string;
  winners: Winner[];
  allGames: GameEntry[];
};

export const gameJamResults: GameJamYear[] = [
  {
    year: '2026',
    winners: [
      {
        id: '2026-top-1',
        rank: 1,
        title: 'La Legende Deux Gustave Et Les Couleurs Perdu',
        team: 'Les Table Tope',
        imageFile: 'La l\u00e9gende deux gustave et les couleurs Perdu.png',
      },
      {
        id: '2026-top-2',
        rank: 2,
        title: 'Nova and his missing sister',
        team: 'Index Error Line 69',
        imageFile: 'Nova and his missing sister.png',
      },
      {
        id: '2026-top-3',
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

export const rankLabel: Record<Winner['rank'], string> = {
  1: '1er',
  2: '2eme',
  3: '3eme',
};

export const getGameJamImagePath = (imageFile: string) => encodeURI(`/asset/GameJam/${imageFile}`);
