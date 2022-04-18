import { FC } from 'react';
import Image from "next/image";

import { TokenInfo } from '../types';
import { shortenText } from '../utils';

const ERROR_MESSAGE = 'error loading token';
const IMAGE_ALT_TEXT = 'missing image';

const LOADING_PROGRESS_MESSAGE_TEMPLATE = (args: string) => `loading [${args}]...`;
const LOADING_ERROR_MESSAGE_TEMPLATE = (args: string) => `error loading [${args}]`;

export interface TokenListItemProps {
  address: string;
  info?: TokenInfo;
  error?: any;
  onSign: () => void;
}

export const TokenListItem: FC<TokenListItemProps> = ({ error,address, info, onSign }) => {

  if (error) {
    return <p>{ERROR_MESSAGE}</p>;
  }
  return <div className="token-list-item">
    {!info ? LOADING_PROGRESS_MESSAGE_TEMPLATE(shortenText(address)) : (<>
      {info.error ? LOADING_ERROR_MESSAGE_TEMPLATE(shortenText(address)) : 
        info.image && <Image width={300} height={300} src={info.image} alt={IMAGE_ALT_TEXT} />}
        <button className="sign-button" onClick={onSign}>
          sign metadata
        </button>
    </>)}
  </div>
};
