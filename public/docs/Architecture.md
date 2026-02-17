# Architecture du projet BinHarry-Website

## Arborescence des dossiers

```
BinHarry-Website/
├── public/
│   ├── asset/
│   │   └── img/          # Images du site
│   ├── docs/
│   │   ├── Architecture.md
│   │   └── TODO.md
│   └── robots.txt
├── src/
│   ├── app/                    # App Router Next.js
│   │   ├── layout.tsx          # Layout principal (Navbar + Footer)
│   │   ├── globals.css         # Styles globaux
│   │   ├── page.tsx            # Page d'accueil (STATIQUE)
│   │   ├── about/
│   │   │   ├── page.tsx        # Page à propos (DYNAMIQUE - use client)
│   │   │   ├── about.css       # Styles page à propos
│   │   │   └── layout.tsx      # Layout avec métadonnées SEO
│   │   ├── mentions-legales/
│   │   │   └── page.tsx        # Page mentions légales (DYNAMIQUE)
│   │   └── cgv/
│   │       └── page.tsx        # Page CGV (DYNAMIQUE)
│   ├── components/
│   │   ├── Navbar.tsx          # Composant dynamique (use client)
│   │   └── Footer.tsx          # Composant réutilisable
│   ├── lib/
│   │   └── api.ts              # Client API pour communiquer avec le backend
│   └── types/
│       └── index.ts            # Types TypeScript partagés
├── .gitignore
├── next.config.ts              # Configuration Next.js
├── open-next.config.ts         # Configuration OpenNext
├── package.json
├── tsconfig.json
└── wrangler.jsonc              # Configuration Cloudflare Workers
```

## Rôle de chaque dossier

| Dossier | Description |
|---------|-------------|
| `public/` | Fichiers statiques accessibles directement |
| `public/asset/img/` | Images du design |
| `public/docs/` | Documentation interne |
| `src/app/` | Pages et layouts (App Router) |
| `src/components/` | Composants React réutilisables |
| `src/lib/` | Utilitaires et clients (API, helpers) |
| `src/types/` | Définitions TypeScript partagées |

## Stratégie de rendu (OpenNext)

- **Page principale (`/`)** : Rendu statique au build (SSG)
- **Autres pages** : Rendu dynamique côté serveur (SSR) via `export const dynamic = 'force-dynamic'`

## Flux de données

```
Utilisateur → Cloudflare Edge → OpenNext Worker → Next.js App
                                     ↓
                    Page statique (cache) ou rendu dynamique
```

## Déploiement Cloudflare

**Type de build recommandé** : Cloudflare Workers avec OpenNext

### Commandes :
- `npm run build:cloudflare` - Build pour Cloudflare
- `npm run preview:cloudflare` - Preview local
- `npm run deploy:cloudflare` - Déploiement production

### Configuration :
- Fichier `wrangler.jsonc` pour la config Workers
- Fichier `open-next.config.ts` pour OpenNext

## Choix techniques

| Choix | Raison |
|-------|--------|
| Next.js 15 | Framework React moderne avec App Router |
| TypeScript | Typage statique pour maintenabilité |
| OpenNext | Adapter Next.js pour Cloudflare Workers |
| Cloudflare Workers | Edge computing, faible latence, pas de cold start |

## Dépendances clés

| Package | Version | Rôle |
|---------|---------|------|
| next | 15.1.0 | Framework React |
| @opennextjs/cloudflare | ^0.5.0 | Adapter Cloudflare |
| wrangler | ^3 | CLI Cloudflare |

## Composants

### Navbar (`src/components/Navbar.tsx`)
- Composant **client** (`'use client'`)
- Prévu pour intégrer l'authentification utilisateur
- Sticky en haut de page

### Footer (`src/components/Footer.tsx`)
- Composant **serveur** (par défaut)
- Liens vers : Mentions Légales, CGV
- Lien Discord : https://discord.gg/wXpRMds6BC
- Copyright dynamique avec année courante
## Pages

### Page À propos (`src/app/about/page.tsx`)
- Composant **client** (`'use client'`)
- Affiche la mission, les activités et les membres du BDE
- Section dynamique "BDE actuelle" qui récupère et affiche les membres avec le rôle admin/founder
- Utilise l'API publique `/api/public/bde-members` pour récupérer les données
- Métadonnées SEO gérées dans `src/app/about/layout.tsx`

## API Backend (BinHarry_API)

### Endpoints publics utilisés
- `GET /api/public/bde-members` - Récupère les membres du BDE (admins et founders)
  - Retourne : `{ id, prenom, nom, avatar_url, role, created_at }`
  - Tri : Founders en premier, puis admins, puis par date de création

### Client API (`src/lib/api.ts`)
- Classe `ApiClient` pour centraliser les appels API
- Méthode `getBDEMembers()` : Récupère les membres du BDE
- Gestion automatique du token d'authentification (localStorage)
- Gestion des erreurs et réponses typées

## Types TypeScript (`src/types/index.ts`)

### Types principaux
- `User` : Utilisateur complet avec authentification
- `BDEMember` : Membre du BDE avec rôle (admin/founder)
- `PublicMember` : Membre public (pour la liste des adhérents)
- `ApiResponse<T>` : Réponse API générique typée