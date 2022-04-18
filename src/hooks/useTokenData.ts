import { useEffect, useRef, useState } from "react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { Account } from "@metaplex-foundation/mpl-core";

import { TokenAddressInfoMap, TokenInfo } from "../types";
import { delay, fromRange } from "../utils";

type TokenAddressResult = {
  addresses: string[];
  error?: any;
}

const EMPTY_TOKEN_ADDRESS_INFO_MAP = {};

const useTokenData = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const tokenInfosRef = useRef<TokenAddressInfoMap>();

  const [tokenAddressesResult, setTokenAddressesResult] = useState<TokenAddressResult>();
  const [tokenInfos, setTokenInfos] = useState<TokenAddressInfoMap>(EMPTY_TOKEN_ADDRESS_INFO_MAP);
  
  useEffect(() => {
    if (!publicKey) {
      setTokenAddressesResult(undefined);
      setTokenInfos(EMPTY_TOKEN_ADDRESS_INFO_MAP);
      return;
    }

    const loadTokens = async () => {
      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: TOKEN_PROGRAM_ID,
        });

        const tokenAddresses = tokenAccounts.value.map(_ => _.account.data.parsed.info?.mint as string).filter(_ => !!_);
        setTokenAddressesResult({
          addresses: tokenAddresses
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadTokens();
  }, [connection, publicKey]);

  useEffect(() => {
    const loadImageData = async (uri: string) => {
      const response = await fetch(uri);
      const { image } = await response.json();
      return image;
    };

    const getMetadata = async () => {
      if (!tokenAddressesResult) return Promise.resolve();
      const getTokenMetadatas = tokenAddressesResult.addresses.map(async (address): Promise<void> => {
        let tokenInfo: TokenInfo;
        try {
          const metadataPDA = await Metadata.getPDA(address);
          const mintAccInfo = await connection.getAccountInfo(metadataPDA);
          await delay(fromRange(1000, 500));
          const {
            data: { data: metadata }
          } = Metadata.from(new Account(address, mintAccInfo as any));
          const image = await loadImageData(metadata.uri);
          tokenInfo = { address, metadata, image };
        } catch (error) {
          console.error(error);
          tokenInfo = {
            address,
            error: true,
          }
        }
        tokenInfosRef.current = {
          ...tokenInfosRef.current,
          [address]: tokenInfo,
        }
        setTokenInfos(tokenInfosRef.current);
      });

      await Promise.allSettled(getTokenMetadatas);
      tokenInfosRef.current = undefined;
    };

    getMetadata();
  }, [connection, tokenAddressesResult]);

  return {
    tokenAddressesResult,
    tokenInfos,
  }
};

export default useTokenData;