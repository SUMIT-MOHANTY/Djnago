import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './RecentTransactions.module.css';

/**
 * Displays recent transactions for a specific account
 * @param {number} accountId - The account ID to show transactions for
 */
const RecentTransactions = ({ accountId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accountId) {
      fetchTransactions(accountId);
    }
  }, [accountId]);

  const fetchTransactions = async (account) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(`/api/v1/banking/transfers?account=${account}&page=1&page_size=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setTransactions(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading transactions...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!accountId) return <div className={styles.empty}>Select an account to view transactions</div>;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Recent Transactions</h3>
      <div className={styles.transactions}>
        {transactions.length === 0 ? (
          <p className={styles.empty}>No transactions found</p>
        ) : (
          transactions.map(tx => (
            <div key={tx.id} className={`${styles.transaction} ${styles[tx.status]}`}>
              <div className={styles.amount}>
                {tx.amount < 0 ? '-' : '+'} $$
                {Math.abs(tx.amount).toFixed(2)}
              </div>
              <div className={styles.details}>
                <span>{tx.from_account === accountId ? '_sent to' : 'received from'}</span>
                <span>{tx.from_account === accountId ? tx.to_account : tx.from_account}</span>
              </div>
              <div className={styles.status}>{tx.status}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

RecentTransactions.propTypes = {
  accountId: PropTypes.number
};

export default RecentTransactions;
