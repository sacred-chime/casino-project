export const convertNumToCoord = (num: number) => {
  const row = Math.floor(num / 3);
  const col = num % 3;
  return [row, col];
};
