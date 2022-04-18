import { FC, ReactNode } from 'react';
import { TokenAddressInfoMap } from '../types';

const ERROR_MESSAGE = 'Could not retrieve tokens';

export interface TokenListProps {
  addresses: string[];
  error?: any;
}

export const TokenList: FC<TokenListProps> = ({ error, addresses}) => {
  if (error) {
    return <h2>{ERROR_MESSAGE}</h2>;
  }
  return <div className="token-container">
    {addresses && addresses.map((_, index) => (<div key={index}>
      {_}
    </div>))}
  </div>
};
