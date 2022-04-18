const LAMPORT_PRICE = 0.000000001; //SOL

export const toSolValue = (amount: number) => `${amount * LAMPORT_PRICE}`;

export function shortenText(input: string, pad = 4): string {
  return `${input.substring(0, pad)} ... ${input.substring(input.length - pad)}`;
}
