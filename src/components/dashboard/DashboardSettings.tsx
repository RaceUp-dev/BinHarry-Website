'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function DashboardSettings() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Delete account
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
      return;
    }

    setIsChangingPassword(true);
    const response = await api.changePassword(currentPassword, newPassword);

    if (response.success) {
      setPasswordMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMessage({ type: 'error', text: response.error || 'Erreur lors du changement de mot de passe' });
    }

    setIsChangingPassword(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user.email) {
      alert('Veuillez saisir votre email pour confirmer la suppression');
      return;
    }

    if (!confirm('ATTENTION: Cette action est irréversible. Êtes-vous vraiment sûr de vouloir supprimer votre compte ?')) {
      return;
    }

    setIsDeleting(true);
    const response = await api.deleteAccount();

    if (response.success) {
      logout();
      router.push('/');
      alert('Votre compte a été supprimé avec succès.');
    } else {
      alert(response.error || 'Erreur lors de la suppression du compte');
    }

    setIsDeleting(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Password Change */}
      <div className="settings-section">
        <h2>Changer le mot de passe</h2>
        <div className="dashboard-card">
          {passwordMessage && (
            <div className={`alert alert-${passwordMessage.type}`}>
              {passwordMessage.text}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="dashboard-form">
            <div className="dashboard-form-group">
              <label htmlFor="currentPassword">Mot de passe actuel</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="dashboard-form-row">
              <div className="dashboard-form-group">
                <label htmlFor="newPassword">Nouveau mot de passe</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="dashboard-form-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isChangingPassword}>
              {isChangingPassword ? 'Modification...' : 'Modifier le mot de passe'}
            </button>
          </form>
        </div>
      </div>

      {/* Logout */}
      <div className="settings-section">
        <h2>Session</h2>
        <div className="dashboard-card">
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Vous êtes connecté en tant que <strong>{user.email}</strong>
          </p>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="settings-section">
        <h2>Zone de danger</h2>
        <div className="danger-zone">
          <h3>Supprimer mon compte</h3>
          <p>
            Une fois votre compte supprimé, toutes vos données seront perdues définitivement.
            Cette action est irréversible.
          </p>

          <div className="dashboard-form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="deleteConfirm">
              Pour confirmer, tapez votre email: <strong>{user.email}</strong>
            </label>
            <input
              type="email"
              id="deleteConfirm"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Votre email"
              style={{ maxWidth: '300px' }}
            />
          </div>

          <button
            className="btn btn-danger"
            onClick={handleDeleteAccount}
            disabled={deleteConfirm !== user.email || isDeleting}
          >
            {isDeleting ? 'Suppression...' : 'Supprimer définitivement mon compte'}
          </button>
        </div>
      </div>
    </>
  );
}
