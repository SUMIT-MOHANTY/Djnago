import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { LedgerRow } from '../../types/ledger';

interface LedgerTableProps {
  rows: LedgerRow[];
  loading: boolean;
  error: string | null;
}

export const LedgerTable: React.FC<LedgerTableProps> = ({ rows, loading, error }) => {
  if (error) {
    return (
      <div className="alert alert-danger">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!loading && rows.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No ledger entries found</p>
      </div>
    );
  }

  const renderSkeletonRows = () => (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <tr key={`skeleton-${i}`}>
          <td><Skeleton width={100} /></td>
          <td><Skeleton width={150} /></td>
          <td><Skeleton width={80} /></td>
          <td><Skeleton width={100} /></td>
          <td><Skeleton width={120} /></td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Tx ID</th>
            <th>Account</th>
            <th>Delta ($)</th>
            <th>Balance ($)</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {loading ? renderSkeletonRows() : (
            rows.map((row) => (
              <tr key={row.tx_id}>
                <td title={row.tx_id}>{row.tx_id.substring(0, 8)}...</td>
                <td>{row.account_id}</td>
                <td className={parseFloat(row.delta) >= 0 ? 'text-success' : 'text-danger'}>
                  {parseFloat(row.delta) >= 0 ? '+' : ''}{row.delta}
                </td>
                <td>{row.balance}</td>
                <td>{new Date(row.timestamp).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
