import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './LoanOverview.module.css';

/**
 * Displays customer's active loans
 */
const LoanOverview = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('/api/v1/banking/loans?status=active&page=1&page_size=5', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setLoans(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading loans...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Active Loans</h3>
      <div className={styles.loans}>
        {loans.length === 0 ? (
          <p className={styles.empty}>No active loans</p>
        ) : (
          loans.map(loan => (
            <div key={loan.id} className={styles.loanCard}>
              <div className={styles.loanDetails}>
                <span className={styles.principal}>${loan.principal?.toFixed(2)}</span>
                <span className={styles.duration}>{loan.duration_months} months</span>
                <span className={styles.rate}>{loan.interest_rate}%</span>
              </div>
              <div className={styles.status}>{loan.status}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

LoanOverview.propTypes = {};

export default LoanOverview;
