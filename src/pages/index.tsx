import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { SolBalance } from "../components/SolBalance";
import { Balance } from "../types";
import { toSolValue } from "../utils/conversion";

export default function Home() {
  const [balance, setBalance] = useState<Balance>();
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const reset = useCallback(() => {
    setBalance(undefined);
  }, []);

  useEffect(() => {
    if (!publicKey) {
      reset();
      return;
    }

    const loadBalance = async () => {
      try {
        const balance = await connection.getBalance(publicKey);
        setBalance({
          amount: toSolValue(balance),
        });
      } catch (error) {
        setBalance({
          error: true,
        });
        console.error(error);
      }
    };

    loadBalance();
  }, [connection, publicKey, reset]);

  const renderConnectedContent = useCallback(() => {
    return (<>
      <SolBalance {...balance} />
    </>)
  }, [balance]);

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
        {balance ? renderConnectedContent() : <WalletMultiButton />}
      </main>
    </div>
  );
}
