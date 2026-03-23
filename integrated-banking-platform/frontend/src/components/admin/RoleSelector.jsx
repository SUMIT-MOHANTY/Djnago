import React from 'react';
import PropTypes from 'prop-types';

const roles = [
  { value: 'admin', label: 'Admin', description: 'Full system access' },
  { value: 'manager', label: 'Manager', description: 'Limited admin access' },
  { value: 'user', label: 'User', description: 'Standard user access' },
  { value: 'readonly', label: 'Read-Only', description: 'View-only access' },
];

const RoleSelector = ({ currentRole, onRoleChange, disabled = false, userId }) => {
  const handleChange = (event) => {
    const newRole = event.target.value;
    onRoleChange(userId, newRole);
  };

  return (
    <div className="role-selector">
      <select
        value={currentRole}
        onChange={handleChange}
        disabled={disabled}
        className={`role-select ${currentRole}`}
        aria-label="User role selector"
      >
        {roles.map(role => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>

      <div className="role-description">
        {roles.find(r => r.value === currentRole)?.description}
      </div>
    </div>
  );
};

RoleSelector.propTypes = {
  currentRole: PropTypes.string.isRequired,
  onRoleChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default RoleSelector;
