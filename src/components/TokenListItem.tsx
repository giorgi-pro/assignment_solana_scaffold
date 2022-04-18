import { FC } from 'react';
import Image from "next/image";

import { TokenAddressInfoMap, TokenInfo } from '../types';

const ERROR_MESSAGE = 'error loading token';
const LOADING_PROGRESS_MESSAGE = 'loading...';
const IMAGE_ALT_TEXT = 'missing image';
const SIGN_BUTTON_LABEL = 'sign metadata';

export interface TokenListItemProps {
  info?: TokenInfo;
  error?: any;
  onSign: () => void;
}

export const TokenListItem: FC<TokenListItemProps> = ({ error, info, onSign }) => {
  if (error) {
    return <p>{ERROR_MESSAGE}</p>;
  }
  return <div className="token-list-item">
    {!info ? LOADING_PROGRESS_MESSAGE : (<>
      {info.image && <Image width={150} height={150} src={info.image} alt={IMAGE_ALT_TEXT} />}
      <button className="sign-button" onClick={onSign}>
        {SIGN_BUTTON_LABEL}
      </button>
    </>)}
  </div>
};
