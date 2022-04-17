import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Head from "next/head";
import Image from "next/image";

export default function Home() {
  const { publicKey } = useWallet();

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
       
        {publicKey ? <h2>{publicKey.toBase58()}</h2> : <WalletMultiButton />}
      </main>
    </div>
  );
}
