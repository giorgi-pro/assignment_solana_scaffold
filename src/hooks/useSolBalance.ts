import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { toSolValue } from "../utils";

type BalanceResult = {
  amount?: string;
  error?: any;
}

const useSolBalance = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const [balanceResult, setBalanceResult] = useState<BalanceResult>();

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

  return {
    balanceResult,
  }
};

export default useSolBalance;