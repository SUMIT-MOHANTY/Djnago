import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/dashboard/common/LoadingSpinner';
import ErrorBoundary from '../../components/dashboard/common/ErrorBoundary';
import styles from './InsuranceDashboard.module.css';

/**
 * Simple insurance dashboard placeholder
 */
const InsuranceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'insurer') {
      navigate('/login');
      return;
    }

    setLoading(false);
  }, [navigate]);

  if (loading) return <LoadingSpinner fullScreen message="Loading insurance dashboard..." />;

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <h1 className={styles.welcome}>Insurance Provider Dashboard</h1>
        <p className={styles.message}>Insurance-specific functionality coming soon...</p>
      </div>
    </ErrorBoundary>
  );
};

export default InsuranceDashboard;
