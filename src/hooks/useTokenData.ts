import { useEffect, useState } from "react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { Account } from "@metaplex-foundation/mpl-core";

import { TokenAddressInfoMap, TokenInfo } from "../types";

type TokenAddressResult = {
  addresses: string[];
  error?: any;
}

const EMPTY_TOKEN_ADDRESS_INFO_MAP = {};

const useTokenData = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

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
      const getTokenMetadatas = tokenAddressesResult.addresses.map(async (address): Promise<TokenInfo> => {
        try {
          const metadataPDA = await Metadata.getPDA(address);
          const mintAccInfo = await connection.getAccountInfo(metadataPDA);
          const {
            data: { data: metadata }
          } = Metadata.from(new Account(address, mintAccInfo as any));
          const image = await loadImageData(metadata.uri);
          return { address, metadata, image };
        } catch (error) {
          console.error(error);
          return {
            address,
            error: true,
          }
        }
      });

      const tokenInfos = await Promise.allSettled(getTokenMetadatas);
      const tokenInfoMap = tokenInfos.map((_: any) => _.value).reduce((result: TokenAddressInfoMap, value: TokenInfo) => {
        result[value.address] = value;
        return result;
      }, {});

      setTokenInfos(tokenInfoMap);
    };

    getMetadata();
  }, [connection, tokenAddressesResult]);

  return {
    tokenAddressesResult,
    tokenInfos,
  }
};

export default useTokenData;