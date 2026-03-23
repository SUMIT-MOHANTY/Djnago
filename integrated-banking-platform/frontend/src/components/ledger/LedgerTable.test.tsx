import React from 'react';
import renderer from 'react-test-renderer';
import { LedgerTable } from './LedgerTable';
import { LedgerRow } from '../../types/ledger';

describe('LedgerTable', () => {
  const mockRows: LedgerRow[] = [
    {
      tx_id: 'TXN123456',
      account_id: 'ACC001',
      delta: '100.00',
      balance: '1100.00',
      timestamp: '2024-01-01T12:00:00Z'
    },
    {
      tx_id: 'TXN789012',
      account_id: 'ACC002',
      delta: '-50.25',
      balance: '450.75',
      timestamp: '2024-01-02T13:30:00Z'
    }
  ];

  it('renders correctly with data', () => {
    const tree = renderer.create(
      <LedgerTable rows={mockRows} loading={false} error={null} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders loading state', () => {
    const tree = renderer.create(
      <LedgerTable rows={[]} loading={true} error={null} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders error state', () => {
    const tree = renderer.create(
      <LedgerTable rows={[]} loading={false} error="Connection failed" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders empty state', () => {
    const tree = renderer.create(
      <LedgerTable rows={[]} loading={false} error={null} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
