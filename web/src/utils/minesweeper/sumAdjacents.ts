import { Cell } from "../../pages/minesweeper";


// calculate adjacency of cells
export const sumAdjacents = (rect: Cell[][], x: number, y: number) => {
    // Finds the sum of all adjacent boxes
    if (!isValidCoord([x, y], rect)) {
        return 0;
    }
    // all adjacent moves
    let neighbor_moves = [
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
    for (let i = 0; i < neighbor_moves.length; i++) {
        const curr_neighbor = neighbor_moves[i];
        const curr_coordinate = [curr_neighbor[0] + x, curr_neighbor[1] + y];
        if (isValidCoord(curr_coordinate, rect)) {
            neighbors.push(curr_coordinate);
        }
    }
    // adding all of the adjacent values together
    let total = 0;
    for (let j = 0; j < neighbors.length; j++) {
        total += Number(rect[neighbors[j][0]][neighbors[j][1]].hasBomb)
    }
    return total;
};

  const isValidCoord = (coordinate: number[], gridArray: Cell[][]) => {
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




// getAdjacent cells of adjacentCount = 0 for multiple clearing , if 'content' = 0