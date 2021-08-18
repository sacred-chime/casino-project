export interface SlotsSymbol {
  symbol: string;
  value: number;
}

export const slotsSymbols = (): SlotsSymbol[] => {
  return [
    { value: 1, symbol: "💩" },
    { value: 10, symbol: "♣️" },
    { value: 10, symbol: "♦" },
    { value: 10, symbol: "♥" },
    { value: 10, symbol: "♠" },
    { value: 15, symbol: "🍌" },
    { value: 15, symbol: "🍒" },
    { value: 15, symbol: "🍓" },
    { value: 15, symbol: "🍍" },
    { value: 20, symbol: "👑" },
    { value: 20, symbol: "📖" },
    { value: 30, symbol: "💲" },
    { value: 30, symbol: "💍" },
    { value: 1000, symbol: "💯" },
  ];
};
