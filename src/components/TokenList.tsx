import { FC, ReactNode } from 'react';
import { TokenAddressInfoMap } from '../types';
import { TokenListItem } from './TokenListItem';

const ERROR_MESSAGE = 'Could not retrieve tokens';

export interface TokenListProps {
  addresses?: string[];
  error?: any;
  tokenInfos: TokenAddressInfoMap;
}

export const TokenList: FC<TokenListProps> = ({ error, addresses, tokenInfos }) => {
  if (error) {
    return <h2>{ERROR_MESSAGE}</h2>;
  }
  return <div className="token-list-container">
    {addresses && addresses.map((_, index) => (<div key={index}>
      <TokenListItem info={tokenInfos[_]} />
    </div>))}
  </div>
};
