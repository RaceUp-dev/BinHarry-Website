'use client';

import { useState, useEffect, useCallback, useId } from 'react';
import { api } from '@/lib/api';
import { IconUsers, IconUserCheck, IconTrendingUp, IconDollarSign, IconActivity, IconRefresh } from '@/components/Icons';
import type { AdminUserStats } from '@/types';

function formatChartLabel(rawLabel: string): string {
  if (/^\d{4}-\d{2}$/.test(rawLabel)) {
    const [year, month] = rawLabel.split('-').map(Number);
    const date = new Date(year, (month || 1) - 1, 1);
    return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  }

  if (/^\d{2}-\d{2}$/.test(rawLabel)) {
    const [month, day] = rawLabel.split('-').map(Number);
    const date = new Date(new Date().getFullYear(), (month || 1) - 1, day || 1);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(rawLabel)) {
    const date = new Date(rawLabel);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  }

  return rawLabel;
}

function buildSmoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y} L ${points[0].x} ${points[0].y}`;
  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

function LineChart({ data, labelKey, valueKey, color = '#1a1a2e', height = 220 }: {
  data: Array<Record<string, unknown>>;
  labelKey: string;
  valueKey: string;
  color?: string;
  height?: number;
}) {
  const gradientId = useId().replace(/:/g, '');
  if (!data.length) return <div className="chart-empty">Aucune donnee</div>;

  const values = data.map(d => Number(d[valueKey]) || 0);
  const max = Math.max(...values, 1);
  const width = 680;
  const marginTop = 12;
  const marginRight = 12;
  const marginBottom = 38;
  const marginLeft = 40;
  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;

  const points = data.map((d, i) => {
    const val = Number(d[valueKey]) || 0;
    const ratio = max === 0 ? 0 : val / max;
    const x = marginLeft + (data.length === 1 ? innerWidth / 2 : (i / (data.length - 1)) * innerWidth);
    const y = marginTop + innerHeight - ratio * innerHeight;
    return { x, y, value: val, label: formatChartLabel(String(d[labelKey])) };
  });

  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${marginTop + innerHeight} L ${points[0].x} ${marginTop + innerHeight} Z`;
  const yTicks = [0, Math.round(max / 3), Math.round((2 * max) / 3), max]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .sort((a, b) => a - b);

  return (
    <div className="line-chart-wrapper" style={{ height }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="line-chart-svg" role="img" aria-label="Graphique en courbe">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => {
          const y = marginTop + innerHeight - (tick / max) * innerHeight;
          return (
            <g key={tick}>
              <line x1={marginLeft} y1={y} x2={width - marginRight} y2={y} className="line-chart-grid" />
              <text x={marginLeft - 10} y={y + 4} className="line-chart-y-label">
                {tick}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />

        {points.map((p, i) => (
          <g key={`${p.label}-${i}`}>
            <circle cx={p.x} cy={p.y} r="3.5" fill={color} className="line-chart-point" />
            <text x={p.x} y={height - 10} className="line-chart-x-label" textAnchor="middle">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function AdminStats() {
  const [stats, setStats] = useState<AdminUserStats | null>(null);
  const [subStats, setSubStats] = useState<{ total: number; actifs: number; revenus: number; par_type: Array<{ type: string; count: number; total_prix: number }> } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    const [userStatsRes, subStatsRes] = await Promise.all([
      api.getUserStats(),
      api.getSubscriptionStats(),
    ]);

    if (userStatsRes.success && userStatsRes.data) {
      setStats(userStatsRes.data);
    }
    if (subStatsRes.success && subStatsRes.data) {
      setSubStats(subStatsRes.data);
    }
    setLastRefresh(new Date());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
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
      <div className="stats-header">
        <span className="stats-refresh-info">
          Derniere mise a jour : {formatTime(lastRefresh)}
        </span>
        <button className="btn btn-secondary btn-sm" onClick={loadStats}>
          <IconRefresh size={16} /> Actualiser
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#eef2ff', color: '#4f46e5' }}>
            <IconUsers size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{stats?.totalUsers || 0}</div>
            <div className="stat-label">Utilisateurs inscrits</div>
            <div className="stat-sub">{stats?.activeUsers || 0} actifs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
            <IconUserCheck size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{stats?.adherents || 0}</div>
            <div className="stat-label">Adherents BDE</div>
            <div className="stat-sub">{stats?.verifiedUsers || 0} emails verifies</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <IconActivity size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{subStats?.actifs || 0}</div>
            <div className="stat-label">Abonnements actifs</div>
            <div className="stat-sub">{subStats?.total || 0} au total</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#fce7f3', color: '#db2777' }}>
            <IconDollarSign size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-value">{formatCurrency(subStats?.revenus || 0)}</div>
            <div className="stat-label">Revenus totaux</div>
            <div className="stat-sub">{stats?.adminUsers || 0} admin{(stats?.adminUsers || 0) > 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>

      <div className="stats-charts-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IconTrendingUp size={18} />
              Inscriptions par mois
            </h2>
          </div>
          <LineChart
            data={stats?.registrationsPerMonth || []}
            labelKey="month"
            valueKey="count"
            color="#4f46e5"
          />
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IconActivity size={18} />
              Connexions (7 derniers jours)
            </h2>
          </div>
          <LineChart
            data={stats?.loginsPerDay || []}
            labelKey="day"
            valueKey="count"
            color="#059669"
          />
        </div>
      </div>

      {subStats?.par_type && subStats.par_type.length > 0 && (
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IconDollarSign size={18} />
              Abonnements par type
            </h2>
          </div>
          <div className="sub-type-grid">
            {subStats.par_type.map((t) => (
              <div key={t.type} className="sub-type-card">
                <div className="sub-type-name">{t.type}</div>
                <div className="sub-type-count">{t.count} actif{t.count > 1 ? 's' : ''}</div>
                <div className="sub-type-revenue">{formatCurrency(t.total_prix)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IconUsers size={18} />
            Derniers inscrits
          </h2>
        </div>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Role</th>
                <th>Inscrit le</th>
                <th>Derniere connexion</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recentUsers || []).map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {u.avatar_url ? (
                        <img src={u.avatar_url} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600 }}>
                          {u.prenom[0]}{u.nom[0]}
                        </div>
                      )}
                      <strong>{u.prenom} {u.nom}</strong>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                  <td>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                  <td>{u.last_login ? new Date(u.last_login).toLocaleDateString('fr-FR') : 'Jamais'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
