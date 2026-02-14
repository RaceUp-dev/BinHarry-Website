'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import '../auth.css';

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const token = searchParams.get('token');

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setStatus('error');
        setMessage('Token de vérification manquant');
        return;
      }

      const response = await api.verifyEmail(token);
      
      if (response.success) {
        setStatus('success');
        setMessage(response.message || 'Email vérifié avec succès !');
        
        // Mettre à jour le user dans le contexte si connecté
        if (user) {
          updateUser({ ...user, email_verified: 1 });
        }
        
        // Rediriger vers dashboard après 3 secondes si connecté
        if (user) {
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        }
      } else {
        setStatus('error');
        setMessage(response.error || 'Erreur lors de la vérification');
      }
    }

    verifyEmail();
  }, [token, user, updateUser, router]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          {status === 'loading' && (
            <>
              <div className="verify-icon loading">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h1>Vérification en cours...</h1>
              <p>Veuillez patienter pendant que nous vérifions votre email.</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="verify-icon success">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h1>Email vérifié !</h1>
              <p>{message}</p>
              {user ? (
                <p className="verify-redirect">Redirection vers le dashboard...</p>
              ) : (
                <Link href="/auth" className="verify-button">
                  Se connecter
                </Link>
              )}
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="verify-icon error">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h1>Erreur de vérification</h1>
              <p>{message}</p>
              <div className="verify-actions">
                {user ? (
                  <Link href="/dashboard" className="verify-button">
                    Retour au dashboard
                  </Link>
                ) : (
                  <Link href="/auth" className="verify-button">
                    Se connecter
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Chargement...</h1>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
