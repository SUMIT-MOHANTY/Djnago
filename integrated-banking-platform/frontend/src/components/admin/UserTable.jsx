import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import RoleSelector from './RoleSelector';
import adminService from '../../services/admin';

const UserTable = ({ users, onUsersUpdate }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [error, setError] = useState(null);

  const handleRoleChange = useCallback(async (userId, newRole) => {
    setLoadingStates(prev => ({ ...prev, [userId]: true }));
    setError(null);

    try {
      const updatedUser = await adminService.updateUserRole(userId, newRole);
      onUsersUpdate(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    } catch (err) {
      setError(err.message || 'Failed to update user role');
      console.error('Role update error:', err);
    } finally {
      setLoadingStates(prev => ({ ...prev, [userId]: false }));
    }
  }, [users, onUsersUpdate]);

  if (!users || users.length === 0) {
    return <div className="no-users">No users found</div>;
  }

  return (
    <div className="user-table-container">
      {error && (
        <div className="error-message" role="alert">
          <span>{error}</span>
          <button onClick={() => setError(null)}></button>
        </div>
      )}

      <table className="user-table" role="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Status</th>
            <th>Role</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className={`user-row ${user.is_active ? 'active' : 'inactive'}`}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{`${user.first_name || ''} ${user.last_name || ''}`.trim()}</td>
              <td>
                <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <RoleSelector
                  userId={user.id}
                  currentRole={user.role}
                  onRoleChange={handleRoleChange}
                  disabled={loadingStates[user.id]}
                />
              </td>
              <td>{user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</td>
              <td>
                <button
                  className="btn-view"
                  onClick={() => console.log('View user:', user.id)}
                  aria-label={`View details for ${user.username}`}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

UserTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      role: PropTypes.string.isRequired,
      is_active: PropTypes.bool.isRequired,
      last_login: PropTypes.string,
    })
  ).isRequired,
  onUsersUpdate: PropTypes.func.isRequired,
};

export default UserTable;
