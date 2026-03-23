import React, { useState, useCallback, useEffect } from 'react';
import SystemSettingsForm from '../../components/admin/SystemSettingsForm';
import ErrorBoundary from '../../components/admin/ErrorBoundary';
import adminService from '../../services/admin';

const SystemConfigPage = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const configData = await adminService.getSystemConfig();
      setConfig(configData);
    } catch (err) {
      setError(err.message || 'Failed to load configuration');
      console.error('Failed to fetch configuration:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleConfigUpdate = useCallback((updatedConfig) => {
    setConfig(updatedConfig);
    setLastUpdated(new Date());
  }, []);

  const handleRefresh = useCallback(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return (
    <div className="admin-page system-config-page">
      <header className="admin-header">
        <h1>System Configuration</h1>
        <div className="header-actions">
          {lastUpdated && (
            <span className="last-updated">
              Last updated: {lastUpdated.toLocaleString()}
            </span>
          )}
          <button
            className="btn-refresh"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Refresh configuration"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button onClick={fetchConfig}>Try Again</button>
        </div>
      )}

      <ErrorBoundary>
        <main className="admin-content">
          {loading && !config ? (
            <div className="loading">Loading configuration...</div>
          ) : (
            <SystemSettingsForm initialConfig={config} onConfigUpdate={handleConfigUpdate} />
          )}
        </main>
      </ErrorBoundary>
    </div>
  );
};

export default SystemConfigPage;
