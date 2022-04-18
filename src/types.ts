export type TokenInfo = {
  image?: string;
  metadata?: any;
  error?: any;
  address: string;
}

export type TokenAddressInfoMap = {
  [address: string]: TokenInfo;
}
