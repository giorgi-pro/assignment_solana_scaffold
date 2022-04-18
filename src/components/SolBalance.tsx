import { FC, ReactNode } from 'react';

const BALANCE_ERROR_MESSAGE = 'Could not retrieve balance';

export interface SolBalanceProps {
  error?: any;
  amount?: string;
}

export const SolBalance: FC<SolBalanceProps> = ({ error, amount }) => {
  if (error) {
    return <h2>{BALANCE_ERROR_MESSAGE}</h2>;
  }
  return <h2>Balance: {amount} SOL</h2>
};
