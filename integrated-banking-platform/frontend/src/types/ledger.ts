export type LedgerRow = {
  tx_id: string;
  account_id: string;
  delta: string;
  balance: string;
  timestamp: string;
};

export type LedgerResponse = {
  count: number;
  total: number;
  page: number;
  total_pages: number;
  results: LedgerRow[];
};
