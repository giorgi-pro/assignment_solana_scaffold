import { useCallback, useEffect, useState } from "react";
import Head from "next/head";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { SolBalance } from "../components/SolBalance";
import { toSolValue } from "../utils/conversion";
import { TokenList } from "../components/TokenList";
import { TokenAddressInfoMap } from "../types";

const EMPTY_TOKEN_ADDRESS_INFO_MAP = {};

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
  
  const { publicKey } = useWallet();
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

  const renderConnectedContent = useCallback(() => {
    return (<>
      <SolBalance {...balanceResult} />
      <TokenList {...tokenAddressesResult} />
    </>)
  }, [balanceResult, tokenAddressesResult]);

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
