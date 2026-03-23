import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AccountSummary.module.css';

/**
 * Displays a summary of customer's bank accounts
 * @param {Function} [onAccountSelect] - Callback when an account is selected
 */
const AccountSummary = ({ onAccountSelect }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('/api/v1/banking/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setAccounts(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading accounts...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Your Accounts</h3>
      <div className={styles.accounts}>
        {accounts.map(account => (
          <div
            key={account.id}
            className={styles.accountCard}
            onClick={() => onAccountSelect && onAccountSelect(account)}
          >
            <div className={styles.accountType}>{account.type}</div>
            <div className={styles.accountNo}>{account.account_no}</div>
            <div className={styles.balance}>
              {account.currency} {(account.balance || 0).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

AccountSummary.propTypes = {
  onAccountSelect: PropTypes.func
};

export default AccountSummary;
