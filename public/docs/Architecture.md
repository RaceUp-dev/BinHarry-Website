# Architecture du projet BinHarry-Website

## Arborescence (principale)

```text
BinHarry-Website/
|- public/
|  |- asset/
|  |  |- GameJam/              # Images des jeux GameJam
|  |  `- img/                  # Images globales du site
|  `- docs/
|     |- Architecture.md
|     `- TODO.md
|- src/
|  |- app/
|  |  |- layout.tsx            # Layout global (Navbar + Footer)
|  |  |- globals.css           # Styles globaux
|  |  |- page.tsx              # Accueil
|  |  `- gamejam/
|  |     |- page.tsx           # Page serveur (metadata SEO)
|  |     |- GameJamClient.tsx  # UI client + interactions reactions
|  |     `- data.ts            # Donnees edition(s) GameJam
|  |- components/              # Composants reutilisables
|  |- context/
|  |  `- AuthContext.tsx       # Etat d'authentification frontend
|  |- lib/
|  |  `- api.ts                # Client API centralise
|  `- types/
|     `- index.ts              # Types TypeScript partages
`- package.json
```

## Role des dossiers

- `public/`: fichiers statiques servis tels quels.
- `src/app/`: routes et pages Next.js App Router.
- `src/components/`: composants UI reutilisables.
- `src/context/`: etat global frontend (auth).
- `src/lib/`: utilitaires et client API.
- `src/types/`: contrats TypeScript partages.

## Flux de donnees (global)

1. Le frontend Next.js utilise `api.ts` pour appeler `BinHarry_API`.
2. Le token JWT (si present) est envoye automatiquement en `Authorization`.
3. Les composants client consomment les reponses typees (`ApiResponse<T>`).
4. Les roles (`user`, `admin`, `founder`) pilotent les vues sensibles.

## Choix techniques importants

- Next.js App Router pour les pages et metadata SEO.
- Composants client uniquement quand un state interactif est necessaire.
- Separation claire entre donnees statiques de page (`data.ts`) et logique UI (`GameJamClient.tsx`).
- Client API unique (`src/lib/api.ts`) pour uniformiser auth, erreurs et fallback dev.

## Feature GameJam Reactions

### Objectif

Permettre aux utilisateurs connectes de reagir sur chaque jeu:
- `Like`
- `Dislike`
- `Coeur` (limite a un seul coeur par edition, tous jeux confondus)

### Frontend

- `src/app/gamejam/GameJamClient.tsx`:
  - affiche compteurs de reactions sous chaque jeu,
  - affiche boutons de vote aux utilisateurs connectes,
  - recharge et met a jour l'etat apres chaque action,
  - affiche les votants par jeu pour `admin` et `founder`.

- `src/lib/api.ts`:
  - `getGameJamReactions(editionYear)`
  - `toggleGameJamReaction(editionYear, gameId, reaction)`

- `src/types/index.ts`:
  - `GameJamReactionType`
  - `GameJamReactionSummary`
  - `GameJamUserReaction`
  - `GameJamAdminDetail`
  - `GameJamReactionsPayload`

### Backend associe (BinHarry_API)

- Route: `src/routes/gamejam.ts`
  - `GET /api/gamejam/reactions?edition=YYYY`
  - `POST /api/gamejam/reactions`

- Schema: `schema.sql`
  - table `GameJamReaction`
  - index de perfs par edition/jeu et utilisateur/edition
  - index unique partiel pour garantir un seul `Coeur` par utilisateur et edition

### Flux GameJam detaille

1. Le client charge les reactions de l'edition.
2. L'utilisateur clique `Like`, `Dislike` ou `Coeur`.
3. L'API applique les regles metier:
   - `Like` et `Dislike` sont exclusifs sur un meme jeu.
   - `Coeur` est unique par edition.
4. L'API renvoie l'etat mis a jour.
5. Le client met a jour la carte du jeu sans rechargement de page.
