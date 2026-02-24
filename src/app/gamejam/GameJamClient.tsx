'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import type {
  GameJamAdminDetail,
  GameJamReactionSummary,
  GameJamReactionType,
  GameJamReactionsPayload,
  GameJamUserReaction,
} from '@/types';
import type { GameJamYear } from './data';
import { getGameJamImagePath, rankLabel } from './data';

type GameJamClientProps = {
  editions: GameJamYear[];
};

type SummaryByGame = Map<string, GameJamReactionSummary>;
type UserReactionByGame = Map<string, GameJamUserReaction>;
type AdminDetailsByGame = Map<string, GameJamAdminDetail[]>;

function formatAdminReactions(detail: GameJamAdminDetail): string {
  const votes: string[] = [];
  if (detail.like) votes.push('Like');
  if (detail.dislike) votes.push('Dislike');
  if (detail.heart) votes.push('Coeur');
  return votes.join(' + ');
}

export default function GameJamClient({ editions }: GameJamClientProps) {
  const { user, isAuthenticated } = useAuth();
  const [payload, setPayload] = useState<GameJamReactionsPayload | null>(null);
  const [isLoadingReactions, setIsLoadingReactions] = useState(true);
  const [reactionError, setReactionError] = useState('');
  const [pendingActionKey, setPendingActionKey] = useState<string | null>(null);

  const firstEdition = editions[0];
  const editionYear = firstEdition?.year || '';
  const canSeeVoters = user?.role === 'admin' || user?.role === 'founder';

  const loadReactions = useCallback(async () => {
    if (!editionYear) {
      return;
    }

    setIsLoadingReactions(true);
    setReactionError('');

    const response = await api.getGameJamReactions(editionYear);
    if (response.success && response.data) {
      setPayload(response.data);
    } else {
      setReactionError(response.error || 'Impossible de charger les avis.');
    }

    setIsLoadingReactions(false);
  }, [editionYear]);

  useEffect(() => {
    void loadReactions();
  }, [loadReactions, isAuthenticated, user?.role]);

  const summaryByGame = useMemo<SummaryByGame>(() => {
    const nextMap = new Map<string, GameJamReactionSummary>();
    for (const summary of payload?.summaries || []) {
      nextMap.set(summary.game_id, summary);
    }
    return nextMap;
  }, [payload]);

  const userReactionByGame = useMemo<UserReactionByGame>(() => {
    const nextMap = new Map<string, GameJamUserReaction>();
    for (const reaction of payload?.userReactions || []) {
      nextMap.set(reaction.game_id, reaction);
    }
    return nextMap;
  }, [payload]);

  const adminDetailsByGame = useMemo<AdminDetailsByGame>(() => {
    const nextMap = new Map<string, GameJamAdminDetail[]>();
    for (const detail of payload?.adminDetails || []) {
      const current = nextMap.get(detail.game_id) || [];
      current.push(detail);
      nextMap.set(detail.game_id, current);
    }
    return nextMap;
  }, [payload]);

  const handleReaction = useCallback(
    async (gameId: string, reaction: GameJamReactionType) => {
      if (!isAuthenticated || !editionYear) {
        return;
      }

      const actionKey = `${gameId}-${reaction}`;
      setPendingActionKey(actionKey);
      setReactionError('');

      const response = await api.toggleGameJamReaction(editionYear, gameId, reaction);
      if (response.success && response.data) {
        setPayload(response.data);
      } else {
        setReactionError(response.error || 'Impossible de mettre a jour ta reaction.');
      }

      setPendingActionKey(null);
    },
    [editionYear, isAuthenticated]
  );

  const renderReactionBlock = (gameId: string) => {
    const summary = summaryByGame.get(gameId) || { game_id: gameId, likes: 0, dislikes: 0, hearts: 0 };
    const myReaction = userReactionByGame.get(gameId);
    const adminDetails = canSeeVoters ? adminDetailsByGame.get(gameId) || [] : [];

    return (
      <div className="gamejam-reactions-block">
        <div className="gamejam-reactions-summary">
          <span>{summary.likes} like(s)</span>
          <span>{summary.dislikes} dislike(s)</span>
          <span>{summary.hearts} coeur(s)</span>
        </div>

        {isAuthenticated ? (
          <div className="gamejam-reactions-actions">
            <button
              type="button"
              className={`gamejam-reaction-btn reaction-like ${myReaction?.like ? 'is-active' : ''}`}
              onClick={() => void handleReaction(gameId, 'like')}
              disabled={pendingActionKey === `${gameId}-like`}
              aria-label="Like"
              title="Like"
            >
              <svg className="gamejam-reaction-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M7 22H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3m0 9V13m0 9h8.4a2 2 0 0 0 1.96-1.6l1.2-6A2 2 0 0 0 16.6 12H14V7a3 3 0 0 0-3-3l-4 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className={`gamejam-reaction-btn reaction-dislike ${myReaction?.dislike ? 'is-active' : ''}`}
              onClick={() => void handleReaction(gameId, 'dislike')}
              disabled={pendingActionKey === `${gameId}-dislike`}
              aria-label="Dislike"
              title="Dislike"
            >
              <svg className="gamejam-reaction-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M7 2H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3m0-9v9m0-9h8.4a2 2 0 0 1 1.96 1.6l1.2 6A2 2 0 0 1 16.6 12H14v5a3 3 0 0 1-3 3l-4-9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className={`gamejam-reaction-btn reaction-heart ${myReaction?.heart ? 'is-active' : ''}`}
              onClick={() => void handleReaction(gameId, 'heart')}
              disabled={pendingActionKey === `${gameId}-heart`}
              aria-label="Coeur"
              title="Coeur"
            >
              <svg className="gamejam-reaction-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 21s-6.7-4.3-9.2-8.3C.4 9 .9 5.1 4 3.4A5.1 5.1 0 0 1 12 6a5.1 5.1 0 0 1 8-2.6c3.1 1.7 3.6 5.6 1.2 9.3C18.7 16.7 12 21 12 21Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        ) : (
          <p className="gamejam-reactions-login">Connecte-toi pour reagir a ce jeu.</p>
        )}

        {canSeeVoters && adminDetails.length > 0 && (
          <div className="gamejam-admin-reactions">
            <p className="gamejam-admin-reactions-title">Votes utilisateurs:</p>
            <ul className="gamejam-admin-reactions-list">
              {adminDetails.map((detail) => (
                <li key={`${gameId}-${detail.user_id}`}>
                  <span>{detail.user_prenom} {detail.user_nom}</span>
                  <span>{formatAdminReactions(detail)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="gamejam-page">
      <header className="gamejam-header">
        <span className="section-label">GAMEJAM</span>
        <h1 className="gamejam-title">Creer, partager, progresser</h1>
        <p className="gamejam-subtitle">
          La GameJam BinHarry met la creation et l&apos;entraide au premier plan.
          Le podium met en avant les coups de coeur de la communaute, mais tous les jeux de chaque edition sont accessibles ci-dessous.
        </p>
        {isLoadingReactions && <p className="gamejam-reaction-status">Chargement des avis...</p>}
        {reactionError && <p className="gamejam-reaction-error">{reactionError}</p>}
      </header>

      <div className="gamejam-years">
        {editions.map((edition) => (
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
                <div key={`${edition.year}-${winner.rank}`} className={`gamejam-card gamejam-rank-${winner.rank}`}>
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
                    {renderReactionBlock(winner.id)}
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
                      {renderReactionBlock(game.id)}
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
