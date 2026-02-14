'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function DashboardProfile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [nom, setNom] = useState(user?.nom || '');
  const [prenom, setPrenom] = useState(user?.prenom || '');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const response = await api.updateProfile({ nom, prenom });
    
    if (response.success && response.data) {
      updateUser(response.data);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
      setIsEditing(false);
    } else {
      setMessage({ type: 'error', text: response.error || 'Erreur lors de la mise à jour' });
    }

    setIsLoading(false);
  };

  const handleCancel = () => {
    setNom(user.nom);
    setPrenom(user.prenom);
    setIsEditing(false);
    setMessage(null);
  };

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h2>Informations personnelles</h2>
        {!isEditing && (
          <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>
            Modifier
          </button>
        )}
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="dashboard-form">
          <div className="dashboard-form-row">
            <div className="dashboard-form-group">
              <label htmlFor="prenom">Prénom</label>
              <input
                type="text"
                id="prenom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
              />
            </div>
            <div className="dashboard-form-group">
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="dashboard-form-group">
            <label>Email</label>
            <input type="email" value={user.email} disabled />
            <small style={{ color: '#888' }}>L&apos;email ne peut pas être modifié</small>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <div className="profile-field">
            <span className="profile-label">Nom complet</span>
            <span className="profile-value">{user.prenom} {user.nom}</span>
          </div>
          <div className="profile-field">
            <span className="profile-label">Email</span>
            <span className="profile-value">
              {user.email}
              {user.email_verified ? (
                <span className="email-verified-badge">✓ Vérifié</span>
              ) : (
                <span className="email-unverified-badge">Non vérifié</span>
              )}
            </span>
          </div>
          <div className="profile-field">
            <span className="profile-label">Rôle</span>
            <span className="profile-value" style={{ textTransform: 'capitalize' }}>{user.role}</span>
          </div>
          <div className="profile-field">
            <span className="profile-label">Membre depuis</span>
            <span className="profile-value">
              {new Date(user.created_at).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      )}

      <style jsx>{`
        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .profile-field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .profile-label {
          font-size: 0.85rem;
          color: #666;
        }
        .profile-value {
          font-size: 1rem;
          color: #1a1a2e;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .email-verified-badge {
          background: #d1fae5;
          color: #059669;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .email-unverified-badge {
          background: #fef3c7;
          color: #b45309;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
