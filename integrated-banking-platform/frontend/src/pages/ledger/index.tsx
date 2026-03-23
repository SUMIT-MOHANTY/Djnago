import React, { useState, useEffect, useRef } from 'react';
import { LedgerTable } from '../../components/ledger/LedgerTable';
import { LedgerPagination } from '../../components/ledger/LedgerPagination';
import { LedgerRow, LedgerResponse } from '../../types/ledger';

const LedgerPage: React.FC = () => {
  const [data, setData] = useState<LedgerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchLedger = async (page: number) => {
    setLoading(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const token = localStorage.getItem('authToken') || '';
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/ledger/?page=${page}&limit=50`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.cookie
              .split('; ')
              .find((row) => row.startsWith('csrftoken='))
              ?.split('=')[1] || '',
            'Authorization': `Token ${token}`,
          },
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Ledger endpoint not found');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: LedgerResponse = await response.json();
      setData(result);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch ledger data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger(currentPage);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Transaction Ledger</h1>
      </div>

      <div className="card">
        <div className="card-header">
          <strong>Immutable Transaction Records</strong>
        </div>
        <div className="card-body">
          <LedgerTable
            rows={data?.results || []}
            loading={loading}
            error={error}
          />

          {data && data.total_pages > 1 && (
            <div className="mt-3">
              <LedgerPagination
                current={data.page}
                totalPages={data.total_pages}
                onPage={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LedgerPage;
