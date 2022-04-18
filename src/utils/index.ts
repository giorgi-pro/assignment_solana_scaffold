const LAMPORT_PRICE = 0.000000001; //SOL

export const toSolValue = (amount: number) => `${amount * LAMPORT_PRICE}`;

export function shortenText(input: string, pad = 4): string {
  return `${input.substring(0, pad)} ... ${input.substring(input.length - pad)}`;
}

export function delay(length = 1000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, length));
}

export function fromRange(max: number, min = 0): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
