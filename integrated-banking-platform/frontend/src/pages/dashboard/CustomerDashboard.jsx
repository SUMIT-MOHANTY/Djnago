import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountSummary from '../../components/dashboard/customer/AccountSummary';
import RecentTransactions from '../../components/dashboard/customer/RecentTransactions';
import LoanOverview from '../../components/dashboard/customer/LoanOverview';
import ActivePolicies from '../../components/dashboard/customer/ActivePolicies';
import ErrorBoundary from '../../components/dashboard/common/ErrorBoundary';
import LoadingSpinner from '../../components/dashboard/common/LoadingSpinner';
import styles from './CustomerDashboard.module.css';

/**
 * Customer dashboard page showing accounts, transactions, loans, and insurance
 */
const CustomerDashboard = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Verify token is valid for customer role
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'customer') {
      navigate('/login');
      return;
    }

    setLoading(false);
  }, [navigate]);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <h1 className={styles.welcome}>Welcome to your Dashboard</h1>

        <div className={styles.grid}>
          <div className={styles.leftColumn}>
            <div className={styles.section}>
              <AccountSummary onAccountSelect={setSelectedAccount} />
            </div>

            <div className={styles.section}>
              <RecentTransactions accountId={selectedAccount?.id} />
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.section}>
              <LoanOverview />
            </div>

            <div className={styles.section}>
              <ActivePolicies />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CustomerDashboard;
