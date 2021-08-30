import { MinesweeperTile } from "../../pages/minesweeper";
import { isValidCoord } from "./isValidCoord";

// calculate adjacency of cells
export const sumAdjacents = (
  matrix: MinesweeperTile[][],
  x: number,
  y: number
) => {
  // Finds the sum of all adjacent boxes
  if (!isValidCoord([x, y], matrix)) {
    return 0;
  }
  // all adjacent moves
  let neighborMoves = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  // creating an array of all valid adjacent coordinates
  const neighbors = [];
  for (let i = 0; i < neighborMoves.length; i++) {
    const curr_neighbor = neighborMoves[i];
    const curr_coordinate = [curr_neighbor[0] + x, curr_neighbor[1] + y];
    if (isValidCoord(curr_coordinate, matrix)) {
      neighbors.push(curr_coordinate);
    }
  }
  // adding all of the adjacent values together
  let total = 0;
  for (let j = 0; j < neighbors.length; j++) {
    total += Number(matrix[neighbors[j][0]][neighbors[j][1]].hasBomb);
  }
  return total;
};
