export type CellValue = '' | number;
export type SudokuGrid = CellValue[][];
export type SelectedCell = { row: number; col: number } | null;
export type HistoryEntry = {
  row: number;
  col: number;
  oldValue: CellValue;
  newValue: CellValue;
};
export type Language = 'rus' | 'eng' | 'uzb';
export type ActiveTab = 'solver' | 'sudoku';
export type DifficultyKey = 'easy' | 'medium' | 'hard' | 'expert';

export type BoardSnapshot = {
  grid: SudokuGrid;
  selectedCell: SelectedCell;
  conflicts: Set<string>;
  errorMessage: string;
  history: HistoryEntry[];
  lockedCells: Set<string>;
  mistakes: number;
  timer: number;
  gameOver: boolean;
  gameWon: boolean;
  isPaused: boolean;
};

export type TranslationMap = Record<
  Language,
  {
    classic: string;
    solver: string;
    language: string;
    easy: string;
    medium: string;
    hard: string;
    expert: string;
    mistakes: string;
    time: string;
    undo: string;
    erase: string;
    clearAll: string;
    newGame: string;
    solveSudoku: string;
    level: string;
    gameOver: string;
    gameOverText: string;
    secondChance: string;
    gameWon: string;
    gameWonText: string;
    duplicateNumberError: string;
    fixErrorsFirstError: string;
    unsolvableError: string;
  }
>;

export type Translation = TranslationMap[Language];
