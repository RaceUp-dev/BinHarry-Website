'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  totalRevenue: number;
}

export default function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setIsLoading(true);

    // Load users stats
    const usersResponse = await api.getUsers(1, 1);
    const subscriptionsResponse = await api.getSubscriptionStats();

    const newStats: Stats = {
      totalUsers: 0,
      activeUsers: 0,
      adminUsers: 0,
      totalSubscriptions: 0,
      activeSubscriptions: 0,
      totalRevenue: 0,
    };

    if (usersResponse.success && usersResponse.data) {
      newStats.totalUsers = usersResponse.data.total;
      // These would need additional API calls in a real scenario
      newStats.activeUsers = usersResponse.data.total;
    }

    if (subscriptionsResponse.success && subscriptionsResponse.data) {
      newStats.totalSubscriptions = subscriptionsResponse.data.total;
      newStats.activeSubscriptions = subscriptionsResponse.data.actifs;
      newStats.totalRevenue = subscriptionsResponse.data.revenus || 0;
    }

    setStats(newStats);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="dashboard-card">
        <div className="loading-spinner" style={{ margin: '2rem auto' }} />
      </div>
    );
  }

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats?.totalUsers || 0}</div>
          <div className="stat-label">Utilisateurs inscrits</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats?.activeUsers || 0}</div>
          <div className="stat-label">Utilisateurs actifs</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💳</div>
          <div className="stat-value">{stats?.activeSubscriptions || 0}</div>
          <div className="stat-label">Abonnements actifs</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">{formatCurrency(stats?.totalRevenue || 0)}</div>
          <div className="stat-label">Revenus abonnements</div>
        </div>
      </div>

      <div className="dashboard-card">
        <h2 style={{ marginBottom: '1rem' }}>Bienvenue dans l&apos;administration</h2>
        <p style={{ color: '#666', lineHeight: 1.6 }}>
          Depuis ce panneau d&apos;administration, vous pouvez :
        </p>
        <ul style={{ color: '#666', marginTop: '1rem', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
          <li>Gérer les utilisateurs (modifier rôles, désactiver comptes)</li>
          <li>Créer et gérer les abonnements</li>
          <li>Envoyer des annonces à tous les utilisateurs</li>
          <li>Consulter les statistiques globales</li>
        </ul>
      </div>
    </>
  );
}
