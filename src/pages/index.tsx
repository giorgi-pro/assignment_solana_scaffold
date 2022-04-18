import { useCallback, useEffect, useState } from "react";
import Head from "next/head";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { Account } from "@metaplex-foundation/mpl-core";
import { sign } from 'tweetnacl';
import bs58 from 'bs58';

import { SolBalance } from "../components/SolBalance";
import { toSolValue } from "../utils/conversion";
import { TokenList } from "../components/TokenList";
import { TokenAddressInfoMap } from "../types";

const EMPTY_TOKEN_ADDRESS_INFO_MAP = {};
const SIGN_ERROR_MESSAGE = 'Invalid signature!'
const SIGN_SUCCESS_MESSAGE_TEMPLATE = (args: string) => `Message signed: ${args}`;

type BalanceResult = {
  amount?: string;
  error?: any;
}

type TokenAddressResult = {
  addresses: string[];
  error?: any;
}

export default function Home() {
  const [balanceResult, setBalanceResult] = useState<BalanceResult>();
  const [tokenAddressesResult, setTokenAddressesResult] = useState<TokenAddressResult>();
  const [tokenInfos, setTokenInfos] = useState<TokenAddressInfoMap>(EMPTY_TOKEN_ADDRESS_INFO_MAP);
  
  const { publicKey, signMessage } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (!publicKey) {
      setBalanceResult(undefined);
      return;
    }

    const loadBalance = async () => {
      try {
        const balance = await connection.getBalance(publicKey);
        setBalanceResult({
          amount: toSolValue(balance),
        });
      } catch (error) {
        setBalanceResult({
          error: true,
        });
        console.error(error);
      }
    };

    loadBalance();
  }, [connection, publicKey]);

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
      const getTokenMetadatas = tokenAddressesResult.addresses.map(async (_) => {
        const metadataPDA = await Metadata.getPDA(_);
        const mintAccInfo = await connection.getAccountInfo(metadataPDA);
        const {
          data: { data: metadata }
        } = Metadata.from(new Account(_, mintAccInfo as any));
        const image = await loadImageData(metadata.uri);
        setTokenInfos({
          ...tokenInfos,
          [_]: {
            metadata,
            image,
          }
        })
      });

      await Promise.allSettled(getTokenMetadatas);
    };

    getMetadata();
  }, [connection, tokenAddressesResult, tokenInfos]);

  const handleSign = useCallback((message: any) => async () => {
    try {
      if (!publicKey || !signMessage) return;
      const data = new TextEncoder().encode(JSON.stringify(message));
      const signature = await signMessage(data);
      if (!sign.detached.verify(data, signature, publicKey.toBytes())) {
        alert(SIGN_ERROR_MESSAGE);
      } else {
        alert(SIGN_SUCCESS_MESSAGE_TEMPLATE(bs58.encode(signature)));
      }
    } catch (err) {
      console.warn(err);
    }
  }, [publicKey, signMessage]);

  const renderConnectedContent = useCallback(() => {
    return (<>
      <SolBalance {...balanceResult} />
      <TokenList {...tokenAddressesResult} tokenInfos={tokenInfos} handleSign={handleSign} />
    </>)
  }, [balanceResult, handleSign, tokenAddressesResult, tokenInfos]);

  return (
    <div>
      <Head>
        <title>Cryptostraps</title>
        <meta
          name="description"
          content="Cryptostraps"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className="flex fixed flex-col justify-center items-center"
        style={{ inset: 0 }}
      >
        {balanceResult ? renderConnectedContent() : <WalletMultiButton />}
      </main>
    </div>
  );
}
