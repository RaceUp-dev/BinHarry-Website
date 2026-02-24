'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

function resizeImage(file: File, maxSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = (h * maxSize) / w; w = maxSize; }
          else { w = (w * maxSize) / h; h = maxSize; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas error'));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DashboardProfile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [nom, setNom] = useState(user?.nom || '');
  const [prenom, setPrenom] = useState(user?.prenom || '');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner une image' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'L\'image ne doit pas dépasser 2 Mo' });
      return;
    }

    setAvatarLoading(true);
    setMessage(null);

    try {
      const dataUrl = await resizeImage(file, 200);
      const response = await api.updateProfile({ avatar_url: dataUrl });

      if (response.success && response.data) {
        updateUser(response.data);
        setMessage({ type: 'success', text: 'Photo de profil mise à jour' });
      } else {
        setMessage({ type: 'error', text: response.error || 'Erreur lors de la mise à jour' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur lors du traitement de l\'image' });
    }

    setAvatarLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveAvatar = async () => {
    setAvatarLoading(true);
    setMessage(null);
    const response = await api.updateProfile({ avatar_url: '' });
    if (response.success && response.data) {
      updateUser(response.data);
      setMessage({ type: 'success', text: 'Photo de profil supprimée' });
    }
    setAvatarLoading(false);
  };

  return (
    <>
      {/* Avatar Card */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2>Photo de profil</h2>
        </div>
        <div className="avatar-section">
          <div className="avatar-preview">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="avatar-img" />
            ) : (
              <span className="avatar-initials">
                {user.prenom[0]}{user.nom[0]}
              </span>
            )}
          </div>
          <div className="avatar-actions">
            {user.avatar_url ? (
              <button
                className="avatar-delete-btn"
                onClick={handleRemoveAvatar}
                disabled={avatarLoading}
              >
                <span>{avatarLoading ? 'Suppression...' : 'Supprimer'}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v8h-2V9zm4 0h2v8h-2V9zM7 9h2v8H7V9zM6 21h12a1 1 0 0 0 1-1V8H5v12a1 1 0 0 0 1 1z" />
                </svg>
              </button>
            ) : (
              <div className="containerDG">
                <div className="headerDG">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path
                      d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15"
                      stroke="#000000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p>{avatarLoading ? 'Uploading...' : 'Browse File to upload!'}</p>
                </div>
                <label htmlFor="file" className="footerDG">
                  <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M15.331 6H8.5v20h15V14.154h-8.169z" />
                    <path d="M18.153 6h-.009v5.342H23.5v-.002z" />
                  </svg>
                  <p>{avatarLoading ? 'Uploading...' : 'Not selected file'}</p>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path
                      d="M5.16565 10.1534C5.07629 8.99181 5.99473 8 7.15975 8H16.8402C18.0053 8 18.9237 8.9918 18.8344 10.1534L18.142 19.1534C18.0619 20.1954 17.193 21 16.1479 21H7.85206C6.80699 21 5.93811 20.1954 5.85795 19.1534L5.16565 10.1534Z"
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <path d="M19.5 5H4.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
                    <path d="M10 3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V5H10V3Z" stroke="#000000" strokeWidth="2" />
                  </svg>
                </label>
                <input
                  ref={fileInputRef}
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={avatarLoading}
                />
              </div>
            )}
            <p className="avatar-hint">JPG, PNG. Max 2 Mo.</p>
          </div>
        </div>
      </div>

      {/* Profile Info Card */}
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
                  <span className="email-verified-badge">&check; Vérifié</span>
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
          .avatar-section {
            display: flex;
            align-items: center;
            gap: 1.5rem;
          }
          .avatar-preview {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #5865F2, #7c3aed);
            color: white;
            font-size: 1.5rem;
            font-weight: 700;
            text-transform: uppercase;
          }
          .avatar-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .avatar-initials {
            line-height: 1;
          }
          .avatar-actions {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }
          .avatar-delete-btn {
            border: none;
            border-radius: 999px;
            background: #ff4045;
            color: #fff;
            min-width: 176px;
            padding: 0.65rem 1.15rem 0.55rem;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.2rem;
            font-weight: 700;
            font-size: 1.1rem;
            line-height: 1;
            cursor: pointer;
            transition: transform 0.2s ease, background 0.2s ease, opacity 0.2s ease;
          }
          .avatar-delete-btn:hover:not(:disabled) {
            background: #ff2e35;
            transform: translateY(-1px);
          }
          .avatar-delete-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          .avatar-delete-btn svg {
            width: 22px;
            height: 22px;
            fill: currentColor;
          }
          .avatar-hint {
            font-size: 0.8rem;
            color: #94a3b8;
            margin: 0;
          }
        `}</style>
      </div>
    </>
  );
}
