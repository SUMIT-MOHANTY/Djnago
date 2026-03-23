import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ActivePolicies.module.css';

/**
 * Displays customer's active insurance policies
 */
const ActivePolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('/api/v1/insurance/enrollments?page=1&page_size=5', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setPolicies(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading policies...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Active Policies</h3>
      <div className={styles.policies}>
        {policies.length === 0 ? (
          <p className={styles.empty}>No active policies</p>
        ) : (
          policies.map(policy => (
            <div key={policy.id} className={styles.policyCard}>
              <div className={styles.policyName}>{policy.policy_name || 'Policy'}</div>
              <div className={styles.policyStatus}>{policy.status}</div>
              <div className={styles.nextDue}>
                Next due: {new Date(policy.next_due_date).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

ActivePolicies.propTypes = {};

export default ActivePolicies;
