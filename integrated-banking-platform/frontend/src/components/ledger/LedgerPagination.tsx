import React from 'react';

interface LedgerPaginationProps {
  current: number;
  totalPages: number;
  onPage: (page: number) => void;
}

export const LedgerPagination: React.FC<LedgerPaginationProps> = ({
  current,
  totalPages,
  onPage,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
    let pageNum;
    if (totalPages <= 10) {
      pageNum = i + 1;
    } else if (current <= 6) {
      pageNum = i + 1;
    } else if (current >= totalPages - 5) {
      pageNum = totalPages - 9 + i;
    } else {
      pageNum = current - 5 + i;
    }
    return pageNum;
  }).filter(p => p >= 1 && p <= totalPages);

  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${current === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => current > 1 && onPage(current - 1)}
            disabled={current === 1}
          >
            Previous
          </button>
        </li>
        {pages.map(page => (
          <li key={page} className={`page-item ${current === page ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPage(page)}>
              {page}
            </button>
          </li>
        ))}
        <li className={`page-item ${current === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => current < totalPages && onPage(current + 1)}
            disabled={current === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};
