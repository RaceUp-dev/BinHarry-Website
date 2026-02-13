'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { User } from '@/types';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    const response = await api.getUsers(page, 20, search, roleFilter);
    if (response.success && response.data) {
      setUsers(response.data.items);
      setTotal(response.data.total);
    }
    setIsLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  const handleToggleActive = async (user: User) => {
    const newActive = user.is_active === 0;
    const response = await api.updateUser(user.id, { is_active: newActive });
    if (response.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: newActive ? 1 : 0 } : u))
      );
    }
  };

  const handleChangeRole = async (user: User, newRole: 'user' | 'admin') => {
    if (!confirm(`Êtes-vous sûr de vouloir changer le rôle de ${user.prenom} ${user.nom} en ${newRole} ?`)) {
      return;
    }
    const response = await api.updateUser(user.id, { role: newRole });
    if (response.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement le compte de ${user.prenom} ${user.nom} ?`)) {
      return;
    }
    const response = await api.deleteUser(user.id, true);
    if (response.success) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setTotal((prev) => prev - 1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <>
      <div className="dashboard-card">
        <div className="admin-filters">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '200px' }}
          />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">Tous les rôles</option>
            <option value="user">Utilisateurs</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {isLoading ? (
          <div className="loading-spinner" style={{ margin: '2rem auto' }} />
        ) : (
          <>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Inscrit le</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.prenom} {user.nom}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>{user.role}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                          {user.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>{formatDate(user.created_at)}</td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditingUser(user)}
                          >
                            ✏️
                          </button>
                          <button
                            className={`btn btn-sm ${user.is_active ? 'btn-secondary' : 'btn-success'}`}
                            onClick={() => handleToggleActive(user)}
                            title={user.is_active ? 'Désactiver' : 'Activer'}
                          >
                            {user.is_active ? '🚫' : '✅'}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteUser(user)}
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Précédent
                </button>
                <span>
                  Page {page} sur {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Suivant
                </button>
              </div>
            )}

            <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.85rem' }}>
              {total} utilisateur{total > 1 ? 's' : ''} au total
            </p>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal-overlay" onClick={() => setEditingUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Modifier l&apos;utilisateur</h2>
              <button className="modal-close" onClick={() => setEditingUser(null)}>×</button>
            </div>

            <div className="dashboard-form">
              <div className="dashboard-form-group">
                <label>Nom complet</label>
                <input type="text" value={`${editingUser.prenom} ${editingUser.nom}`} disabled />
              </div>

              <div className="dashboard-form-group">
                <label>Email</label>
                <input type="email" value={editingUser.email} disabled />
              </div>

              <div className="dashboard-form-group">
                <label>Rôle</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => {
                    handleChangeRole(editingUser, e.target.value as 'user' | 'admin');
                    setEditingUser({ ...editingUser, role: e.target.value as 'user' | 'admin' });
                  }}
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setEditingUser(null)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
