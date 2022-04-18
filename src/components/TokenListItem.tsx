import { FC } from 'react';
import Image from "next/image";

import { TokenAddressInfoMap, TokenInfo } from '../types';

const ERROR_MESSAGE = 'Error loading token';
const LOADING_PROGRESS_MESSAGE = 'loading...';
const IMAGE_ALT_TEXT = 'missing image';

export interface TokenListItemProps {
  info?: TokenInfo;
  error?: any;
}

export const TokenListItem: FC<TokenListItemProps> = ({ error, info }) => {
  if (error) {
    return <p>{ERROR_MESSAGE}</p>;
  }
  return <div className="token-list-item">
    {!info ? LOADING_PROGRESS_MESSAGE : (<>
      {info.image && <Image layout="fill" src={info.image} alt={IMAGE_ALT_TEXT} />}
      <button>
        Sign Metadata
      </button>
    </>)}
  </div>
};
