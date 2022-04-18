import { useCallback } from "react";
import Head from "next/head";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { sign } from 'tweetnacl';
import bs58 from 'bs58';

import useTokenData from '../hooks/useTokenData';
import useSolBalance from '../hooks/useSolBalance';

import { SolBalance } from "../components/SolBalance";
import { TokenList } from "../components/TokenList";

const SIGN_ERROR_MESSAGE = 'Invalid signature!'
const SIGN_SUCCESS_MESSAGE_TEMPLATE = (args: string) => `Message signed: ${args}`;

export default function Home() {
  const { publicKey, signMessage } = useWallet();
  const { balanceResult } = useSolBalance();
  const { tokenAddressesResult, tokenInfos } = useTokenData();

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
