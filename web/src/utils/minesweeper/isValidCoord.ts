import { MinesweeperTile } from "../../pages/minesweeper";

export const isValidCoord = (
  coordinate: number[],
  gridArray: MinesweeperTile[][]
) => {
  // negative number coordinates are bad + number values greater than the dimensions of the 2D array are bad
  if (
    coordinate[0] < 0 ||
    coordinate[1] < 0 ||
    coordinate[0] > gridArray.length - 1 ||
    coordinate[1] > gridArray[0].length - 1
  ) {
    return false;
  } else {
    return true;
  }
};
