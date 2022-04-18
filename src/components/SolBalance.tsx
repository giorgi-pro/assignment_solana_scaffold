import { FC, ReactNode } from 'react';

const ERROR_MESSAGE = 'Could not retrieve balance';

export interface SolBalanceProps {
  amount?: string;
  error?: any;
}

export const SolBalance: FC<SolBalanceProps> = ({ error, amount }) => {
  if (error) {
    return <h2>{ERROR_MESSAGE}</h2>;
  }
  return <h2>Balance: {amount} SOL</h2>
};
