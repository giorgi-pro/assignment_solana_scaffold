import { FC } from 'react';
import { TokenAddressInfoMap } from '../types';
import { TokenListItem } from './TokenListItem';

const ERROR_MESSAGE = 'could not retrieve tokens';

export interface TokenListProps {
  addresses?: string[];
  error?: any;
  tokenInfos: TokenAddressInfoMap;
  handleSign: (content: any) => () => void;
}

export const TokenList: FC<TokenListProps> = ({ error, addresses, tokenInfos, handleSign }) => {
  if (error) {
    return <h2>{ERROR_MESSAGE}</h2>;
  }
  return <div className="token-list-container flex flex-wrap justify-around">
    {addresses && addresses.map((_, index) => (<div key={index}>
      <TokenListItem address={_} info={tokenInfos[_]} onSign={handleSign(tokenInfos[_]?.metadata)} />
    </div>))}
  </div>
};
