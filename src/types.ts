export type TokenInfo = {
  image?: string;
  metadata: any;
  error?: any;
}

export type TokenAddressInfoMap = {
  [address: string]: TokenInfo;
}
