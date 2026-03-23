import React from 'react';
import PropTypes from 'prop-types';
import styles from './LoadingSpinner.module.css';

/**
 * Loading spinner component to display during async operations
 * @param {boolean} [fullScreen=false] - Whether to make the spinner full screen
 * @param {string} [message='Loading...'] - Optional message to display below spinner
 */
const LoadingSpinner = ({ fullScreen = false, message = 'Loading...' }) => {
  return (
    <div className={`${styles.container} ${fullScreen ? styles.fullScreen : ''}`}>
      <div className={styles.spinner}></div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  fullScreen: PropTypes.bool,
  message: PropTypes.string
};

export default LoadingSpinner;
