'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function EmailVerificationBanner() {
  const { user, updateUser } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  // Ne pas afficher si l'email est déjà vérifié ou si dismissed
  if (!user || user.email_verified || isDismissed) {
    return null;
  }

  const handleResendEmail = async () => {
    setIsSending(true);
    setMessage(null);

    const response = await api.sendVerificationEmail();

    if (response.success) {
      setMessage({ type: 'success', text: 'Email de vérification envoyé ! Vérifiez votre boîte de réception.' });
    } else {
      setMessage({ type: 'error', text: response.error || 'Erreur lors de l\'envoi' });
    }

    setIsSending(false);
  };

  return (
    <div className="email-verification-banner">
      <div className="banner-content">
        <div className="banner-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <div className="banner-text">
          <strong>Vérifiez votre email</strong>
          <p>
            Vérifiez votre adresse email pour accéder aux fonctionnalités de paiement.
            {message && (
              <span className={`banner-message ${message.type}`}> {message.text}</span>
            )}
          </p>
        </div>
        <div className="banner-actions">
          <button
            className="banner-button primary"
            onClick={handleResendEmail}
            disabled={isSending}
          >
            {isSending ? 'Envoi...' : 'Renvoyer l\'email'}
          </button>
          <button
            className="banner-button secondary"
            onClick={() => setIsDismissed(true)}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
