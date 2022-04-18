const LAMPORT_PRICE = 0.000000001; //SOL

export const toSolValue = (amount: number) => `${amount * LAMPORT_PRICE}`;
