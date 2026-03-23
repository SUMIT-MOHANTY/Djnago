import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/dashboard/common/LoadingSpinner';
import ErrorBoundary from '../../components/dashboard/common/ErrorBoundary';
import styles from './BankDashboard.module.css';

/**
 * Simple bank dashboard placeholder
 */
const BankDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'bank_staff') {
      navigate('/login');
      return;
    }

    setLoading(false);
  }, [navigate]);

  if (loading) return <LoadingSpinner fullScreen message="Loading bank dashboard..." />;

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <h1 className={styles.welcome}>Bank Dashboard</h1>
        <p className={styles.message}>Bank-specific functionality coming soon...</p>
      </div>
    </ErrorBoundary>
  );
};

export default BankDashboard;
