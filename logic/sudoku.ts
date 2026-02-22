import type { DifficultyKey, SudokuGrid } from '../types/sudoku';

export const emptyGrid = (): SudokuGrid =>
  Array(9)
    .fill(null)
    .map(() => Array(9).fill(''));

export const isValid = (grid: SudokuGrid, row: number, col: number, num: number): boolean => {
  for (let x = 0; x < 9; x++) {
    if (x !== col && grid[row][x] === num) return false;
  }

  for (let x = 0; x < 9; x++) {
    if (x !== row && grid[x][col] === num) return false;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const r = boxRow + i;
      const c = boxCol + j;
      if ((r !== row || c !== col) && grid[r][c] === num) return false;
    }
  }

  return true;
};

export const findConflicts = (grid: SudokuGrid): Set<string> => {
  const conflicts = new Set<string>();

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = grid[row][col];
      if (num && !isValid(grid, row, col, num)) {
        conflicts.add(`${row}-${col}`);
      }
    }
  }

  return conflicts;
};

export const solveSudoku = (grid: SudokuGrid): SudokuGrid | null => {
  const newGrid = grid.map((r) => [...r]);

  const solve = (): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (newGrid[row][col] === '') {
          for (let num = 1; num <= 9; num++) {
            if (isValid(newGrid, row, col, num)) {
              newGrid[row][col] = num;
              if (solve()) return true;
              newGrid[row][col] = '';
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  return solve() ? newGrid : null;
};

export const fillGrid = (grid: SudokuGrid): boolean => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === '') {
        const shuffled = [...numbers].sort(() => Math.random() - 0.5);
        for (const num of shuffled) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) return true;
            grid[row][col] = '';
          }
        }
        return false;
      }
    }
  }

  return true;
};

export const generateGame = (
  difficulty: DifficultyKey,
  difficulties: DifficultyKey[]
): { grid: SudokuGrid; lockedCells: Set<string> } => {
  const grid = emptyGrid();
  const tempGrid = emptyGrid();
  fillGrid(tempGrid);

  const cellsMap: Record<number, number> = { 0: 45, 1: 35, 2: 28, 3: 22 };
  const diffIndex = difficulties.indexOf(difficulty);
  const cellsToFill = cellsMap[diffIndex] || 35;

  const positions: [number, number][] = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) positions.push([i, j]);
  }

  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  const lockedCells = new Set<string>();
  for (let i = 0; i < cellsToFill; i++) {
    const [row, col] = positions[i];
    grid[row][col] = tempGrid[row][col];
    lockedCells.add(`${row}-${col}`);
  }

  return { grid, lockedCells };
};
