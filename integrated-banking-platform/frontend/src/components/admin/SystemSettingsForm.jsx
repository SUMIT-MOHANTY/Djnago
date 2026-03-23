import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import adminService from '../../services/admin';

const SystemSettingsForm = ({ initialConfig, onConfigUpdate }) => {
  const [config, setConfig] = useState(initialConfig || {
    site_name: '',
    site_url: '',
    max_login_attempts: 5,
    password_expiration_days: 90,
    session_timeout_minutes: 60,
    require_2fa: false,
    email_notifications: true,
    maintenance_mode: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = useCallback((field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!config.site_name?.trim()) {
      newErrors.site_name = 'Site name is required';
    }

    if (!config.site_url?.trim()) {
      newErrors.site_url = 'Site URL is required';
    } else if (!/^https?:\/\/.+\..+/.test(config.site_url)) {
      newErrors.site_url = 'Please enter a valid URL';
    }

    if (config.max_login_attempts < 1 || config.max_login_attempts > 100) {
      newErrors.max_login_attempts = 'Must be between 1 and 100';
    }

    if (config.password_expiration_days < 1 || config.password_expiration_days > 365) {
      newErrors.password_expiration_days = 'Must be between 1 and 365';
    }

    if (config.session_timeout_minutes < 5 || config.session_timeout_minutes > 1440) {
      newErrors.session_timeout_minutes = 'Must be between 5 and 1440 minutes';
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      await adminService.updateSystemConfig(config);
      onConfigUpdate(config);
      setSuccess(true);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to update configuration' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="system-settings-form">
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-section">
          <h3>Site Configuration</h3>

          <div className="form-group">
            <label htmlFor="site_name">Site Name *</label>
            <input
              type="text"
              id="site_name"
              value={config.site_name}
              onChange={(e) => handleChange('site_name', e.target.value)}
              className={errors.site_name ? 'error' : ''}
              maxLength={50}
            />
            {errors.site_name && <span className="error-message">{errors.site_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="site_url">Site URL *</label>
            <input
              type="url"
              id="site_url"
              value={config.site_url}
              onChange={(e) => handleChange('site_url', e.target.value)}
              className={errors.site_url ? 'error' : ''}
              placeholder="https://example.com"
            />
            {errors.site_url && <span className="error-message">{errors.site_url}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Security Settings</h3>

          <div className="form-group">
            <label htmlFor="max_login_attempts">Max Login Attempts</label>
            <input
              type="number"
              id="max_login_attempts"
              value={config.max_login_attempts}
              onChange={(e) => handleChange('max_login_attempts', parseInt(e.target.value))}
              min="1"
              max="100"
            />
            {errors.max_login_attempts && <span className="error-message">{errors.max_login_attempts}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password_expiration_days">Password Expiration (Days)</label>
            <input
              type="number"
              id="password_expiration_days"
              value={config.password_expiration_days}
              onChange={(e) => handleChange('password_expiration_days', parseInt(e.target.value))}
              min="1"
              max="365"
            />
            {errors.password_expiration_days && <span className="error-message">{errors.password_expiration_days}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="session_timeout_minutes">Session Timeout (Minutes)</label>
            <input
              type="number"
              id="session_timeout_minutes"
              value={config.session_timeout_minutes}
              onChange={(e) => handleChange('session_timeout_minutes', parseInt(e.target.value))}
              min="5"
              max="1440"
            />
            {errors.session_timeout_minutes && <span className="error-message">{errors.session_timeout_minutes}</span>}
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={config.require_2fa}
                onChange={(e) => handleChange('require_2fa', e.target.checked)}
              />
              Require Two-Factor Authentication
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Notifications</h3>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={config.email_notifications}
                onChange={(e) => handleChange('email_notifications', e.target.checked)}
              />
              Enable Email Notifications
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Maintenance</h3>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={config.maintenance_mode}
                onChange={(e) => handleChange('maintenance_mode', e.target.checked)}
              />
              Enable Maintenance Mode
            </label>
          </div>
        </div>

        {errors.submit && (
          <div className="error-message" role="alert">
            {errors.submit}
          </div>
        )}

        {success && (
          <div className="success-message" role="status">
            Configuration updated successfully!
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Save Configuration'}
          </button>
          <button type="button" onClick={() => window.location.reload()} className="btn-secondary">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

SystemSettingsForm.propTypes = {
  initialConfig: PropTypes.shape({
    site_name: PropTypes.string,
    site_url: PropTypes.string,
    max_login_attempts: PropTypes.number,
    password_expiration_days: PropTypes.number,
    session_timeout_minutes: PropTypes.number,
    require_2fa: PropTypes.bool,
    email_notifications: PropTypes.bool,
    maintenance_mode: PropTypes.bool,
  }),
  onConfigUpdate: PropTypes.func.isRequired,
};

export default SystemSettingsForm;
