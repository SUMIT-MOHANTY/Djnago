import React, { useState, useCallback, useEffect } from 'react';
import UserTable from '../../components/admin/UserTable';
import ErrorBoundary from '../../components/admin/ErrorBoundary';
import adminService from '../../services/admin';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await adminService.getUsers();
      setUsers(userData);
    } catch (err) {
      setError(err.message || 'Failed to load users');
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUsersUpdate = useCallback((updatedUsers) => {
    setUsers(updatedUsers);
  }, []);

  return (
    <div className="admin-page user-management-page">
      <header className="admin-header">
        <h1>User Management</h1>
        <button
          className="btn-refresh"
          onClick={fetchUsers}
          disabled={loading}
          aria-label="Refresh user list"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </header>

      {error && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button onClick={fetchUsers}>Try Again</button>
        </div>
      )}

      <ErrorBoundary>
        <main className="admin-content">
          <div className="stats-summary">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{users.length}</p>
            </div>
            <div className="stat-card">
              <h3>Active Users</h3>
              <p>{users.filter(u => u.is_active).length}</p>
            </div>
            <div className="stat-card">
              <h3>Admins</h3>
              <p>{users.filter(u => u.role === 'admin').length}</p>
            </div>
          </div>

          <section className="users-section">
            <h2>User List</h2>
            {loading && users.length === 0 ? (
              <div className="loading">Loading users...</div>
            ) : (
              <UserTable users={users} onUsersUpdate={handleUsersUpdate} />
            )}
          </section>
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default UserManagementPage;
