import { Grid, CellPosition } from '../types/sudoku';

export const createEmptyGrid = (): Grid => Array(9).fill('').map(() => Array(9).fill(''));

export const isValidCell = (grid: Grid, pos: CellPosition, num: string): boolean => {
  const { row, col } = pos;

  // check the row to see if already contains number
  for (let x = 0; x < 9; x++) {
    if (x !== col && grid[row][x] === num) return false;
  }

  // check column to see if already contains number
  for (let y = 0; y < 9; y++) {
    if (y !== row && grid[y][col] === num) return false;
  }

  // check 3x3 box 
  // calculate in which box the cell is located
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let y = boxRow; y < boxRow + 3; y++) {
    for (let x = boxCol; x < boxCol + 3; x++) {
      if (y !== row && x !== col && grid[y][x] === num) return false;
    }
  }

  return true;
}

export const findEmptyCell = (grid: Grid): CellPosition | null => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === '') return {row, col}; 
    }
  }
  return null;
}

export const isValidSudoku = (grid: Grid): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const currentValue = grid[row][col];
      if (currentValue !== '') {
        // temporarily clear cell because isValidCell checks if the cell is empty
        grid[row][col] = '';
        const isValid = isValidCell(grid, {row, col}, currentValue);
        grid[row][col] = currentValue;

        if (!isValid) return false;
      }
    }
  }
  
  return true;
}