import React, { useEffect, useRef, useState } from 'react';
import HeaderBar from './components/HeaderBar';
import SudokuBoard from './components/SudokuBoard';
import ControlPanel from './components/ControlPanel';
import { translations } from './constants/translations';
import {
  emptyGrid,
  findConflicts as findConflictsFn,
  generateGame,
  isValid as isValidFn,
  solveSudoku as solveSudokuFn
} from './logic/sudoku';
import type {
  ActiveTab,
  BoardSnapshot,
  DifficultyKey,
  HistoryEntry,
  Language,
  SelectedCell,
  SudokuGrid
} from './types/sudoku';

const SudokuApp = () => {
  const [grid, setGrid] = useState<SudokuGrid>(emptyGrid());
  const [selectedCell, setSelectedCell] = useState<SelectedCell>(null);
  const [conflicts, setConflicts] = useState<Set<string>>(new Set<string>());
  const [errorMessage, setErrorMessage] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('solver');
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);
  const [difficulty, setDifficulty] = useState<DifficultyKey>('medium');
  const [lockedCells, setLockedCells] = useState<Set<string>>(new Set<string>());
  const [language, setLanguage] = useState<Language>('rus');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showDifficultyMenu, setShowDifficultyMenu] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLandscapeTouchLayout, setIsLandscapeTouchLayout] = useState(false);

  const solverSnapshotRef = useRef<BoardSnapshot | null>(null);
  const sudokuSnapshotRef = useRef<BoardSnapshot | null>(null);

  const t = translations[language];
  const difficulties: DifficultyKey[] = ['easy', 'medium', 'hard', 'expert'];

  const isValid = isValidFn;
  const findConflicts = findConflictsFn;
  const solveSudoku = solveSudokuFn;

  const captureCurrentSnapshot = (): BoardSnapshot => ({
    grid: grid.map((row) => [...row]),
    selectedCell: selectedCell ? { ...selectedCell } : null,
    conflicts: new Set(conflicts),
    errorMessage,
    history: history.map((entry) => ({ ...entry })),
    lockedCells: new Set(lockedCells),
    mistakes,
    timer,
    gameOver,
    gameWon,
    isPaused
  });

  const applySnapshot = (snapshot: BoardSnapshot): void => {
    setGrid(snapshot.grid.map((row) => [...row]));
    setSelectedCell(snapshot.selectedCell ? { ...snapshot.selectedCell } : null);
    setConflicts(new Set(snapshot.conflicts));
    setErrorMessage(snapshot.errorMessage);
    setHistory(snapshot.history.map((entry) => ({ ...entry })));
    setLockedCells(new Set(snapshot.lockedCells));
    setMistakes(snapshot.mistakes);
    setTimer(snapshot.timer);
    setGameOver(snapshot.gameOver);
    setGameWon(snapshot.gameWon);
    setIsPaused(snapshot.isPaused);
  };

  const createSolverSnapshot = (): BoardSnapshot => ({
    grid: emptyGrid(),
    selectedCell: null,
    conflicts: new Set<string>(),
    errorMessage: '',
    history: [],
    lockedCells: new Set<string>(),
    mistakes: 0,
    timer: 0,
    gameOver: false,
    gameWon: false,
    isPaused: false
  });

  const handleTabChange = (nextTab: ActiveTab): void => {
    if (nextTab === activeTab) return;

    if (activeTab === 'sudoku') {
      sudokuSnapshotRef.current = captureCurrentSnapshot();
    } else {
      solverSnapshotRef.current = captureCurrentSnapshot();
    }

    const nextSnapshot =
      nextTab === 'sudoku'
        ? (sudokuSnapshotRef.current ?? captureCurrentSnapshot())
        : (solverSnapshotRef.current ?? createSolverSnapshot());

    applySnapshot(nextSnapshot);
    setActiveTab(nextTab);
  };

  const handleCellClick = (row: number, col: number): void => {
    setSelectedCell({ row, col });
  };

  const checkWin = (currentGrid: SudokuGrid): void => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (currentGrid[row][col] === '') return;
      }
    }
    setGameWon(true);
  };

  const handleNumberClick = (num: number): void => {
    if (!selectedCell || gameOver || isPaused) return;

    const { row, col } = selectedCell;
    if (lockedCells.has(`${row}-${col}`)) return;

    const oldValue = grid[row][col];
    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = num;

    setHistory([...history, { row, col, oldValue, newValue: num }]);
    setGrid(newGrid);

    const newConflicts = findConflicts(newGrid);
    setConflicts(newConflicts);

    if (newConflicts.size > 0) {
      if (activeTab === 'sudoku') {
        const newMistakes = Math.min(mistakes + 1, 3);
        setMistakes(newMistakes);
        if (newMistakes >= 3) setGameOver(true);
      }
      setErrorMessage(t.duplicateNumberError);
    } else {
      setErrorMessage('');
      checkWin(newGrid);
    }
  };

  const handleUndo = (): void => {
    if (history.length === 0) return;

    const lastAction = history[history.length - 1];
    const newGrid = grid.map((r) => [...r]);
    newGrid[lastAction.row][lastAction.col] = lastAction.oldValue;

    setGrid(newGrid);
    setHistory(history.slice(0, -1));
    setConflicts(findConflicts(newGrid));
    setErrorMessage('');
    setSelectedCell({ row: lastAction.row, col: lastAction.col });
  };

  const handleClear = (): void => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    if (lockedCells.has(`${row}-${col}`)) return;

    const oldValue = grid[row][col];
    if (oldValue) {
      setHistory([...history, { row, col, oldValue, newValue: '' }]);
    }

    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = '';
    setGrid(newGrid);
    setConflicts(findConflicts(newGrid));
    setErrorMessage('');
  };

  const handleClearAll = (): void => {
    if (activeTab === 'solver') {
      setGrid(emptyGrid());
      setConflicts(new Set<string>());
      setErrorMessage('');
      setSelectedCell(null);
      setHistory([]);
      setLockedCells(new Set<string>());
      return;
    }

    const newGrid = grid.map((r) => [...r]);
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (!lockedCells.has(`${row}-${col}`)) newGrid[row][col] = '';
      }
    }

    setGrid(newGrid);
    setConflicts(new Set<string>());
    setErrorMessage('');
    setHistory([]);
  };

  const generateNewGame = (): void => {
    const { grid: newGrid, lockedCells: newLockedCells } = generateGame(difficulty, difficulties);
    setGrid(newGrid);
    setLockedCells(newLockedCells);
    setHistory([]);
    setConflicts(new Set<string>());
    setErrorMessage('');
    setMistakes(0);
    setTimer(0);
    setGameOver(false);
    setGameWon(false);
    setIsPaused(false);
  };

  const handleSolve = (): void => {
    if (activeTab === 'solver') {
      if (conflicts.size > 0) {
        setErrorMessage(t.fixErrorsFirstError);
        return;
      }

      const solution = solveSudoku(grid);
      if (solution) {
        setGrid(solution);
        setErrorMessage('');
      } else {
        setErrorMessage(t.unsolvableError);
      }
    } else {
      generateNewGame();
    }
  };

  const handleSecondChance = (): void => {
    setMistakes(0);
    setGameOver(false);
  };

  const handleNewGameFromModal = (): void => {
    setGameOver(false);
    setGameWon(false);
    generateNewGame();
  };

  const handleToggleLanguageMenu = (): void => {
    setShowDifficultyMenu(false);
    setShowLanguageMenu((prev) => !prev);
  };

  const handleToggleDifficultyMenu = (): void => {
    setShowLanguageMenu(false);
    setShowDifficultyMenu((prev) => !prev);
  };

  const handleSelectLanguage = (lang: Language): void => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  const handleSelectDifficulty = (level: DifficultyKey): void => {
    setDifficulty(level);
    setShowDifficultyMenu(false);
  };

  useEffect(() => {
    if (activeTab === 'sudoku' && difficulty) {
      generateNewGame();
    }
  }, [difficulty]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (activeTab === 'sudoku' && !isPaused && !gameOver && !gameWon) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTab, isPaused, gameOver, gameWon]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (!selectedCell || gameOver || isPaused) return;

      if (event.key >= '1' && event.key <= '9') {
        event.preventDefault();
        handleNumberClick(Number(event.key));
        return;
      }

      if (event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') {
        event.preventDefault();
        handleClear();
        return;
      }

      const { row, col } = selectedCell;
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedCell({ row: Math.max(0, row - 1), col });
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedCell({ row: Math.min(8, row + 1), col });
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setSelectedCell({ row, col: Math.max(0, col - 1) });
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setSelectedCell({ row, col: Math.min(8, col + 1) });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, gameOver, isPaused, handleClear, handleNumberClick]);

  useEffect(() => {
    const updateLayoutMode = (): void => {
      const isLandscape = window.matchMedia('(orientation: landscape)').matches;
      setIsLandscapeTouchLayout(isLandscape && window.innerWidth <= 1024);
    };

    updateLayoutMode();
    window.addEventListener('resize', updateLayoutMode);
    return () => window.removeEventListener('resize', updateLayoutMode);
  }, []);

  const boardCellClass = isLandscapeTouchLayout
    ? 'w-7 h-7 text-xs md:w-8 md:h-8 md:text-sm'
    : 'w-8 h-8 text-sm md:w-10 md:h-10 md:text-base lg:w-14 lg:h-14 lg:text-xl';
  const actionButtonClass = isLandscapeTouchLayout
    ? 'w-10 h-10 md:w-12 md:h-12'
    : 'w-12 h-12 md:w-14 md:h-14 lg:w-24 lg:h-24';
  const actionIconClass = isLandscapeTouchLayout
    ? 'w-3 h-3 md:w-3.5 md:h-3.5'
    : 'w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5';
  const numberButtonClass = isLandscapeTouchLayout
    ? 'w-8 h-8 md:w-10 md:h-10 text-sm md:text-base rounded-lg'
    : 'w-10 h-10 md:w-12 md:h-12 lg:w-24 lg:h-24 text-lg md:text-xl lg:text-4xl rounded-lg md:rounded-xl';

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
      <HeaderBar
        darkMode={darkMode}
        activeTab={activeTab}
        language={language}
        difficulty={difficulty}
        difficulties={difficulties}
        t={t}
        showLanguageMenu={showLanguageMenu}
        showDifficultyMenu={showDifficultyMenu}
        onTabChange={handleTabChange}
        onSelectLanguage={handleSelectLanguage}
        onToggleLanguageMenu={handleToggleLanguageMenu}
        onSelectDifficulty={handleSelectDifficulty}
        onToggleDifficultyMenu={handleToggleDifficultyMenu}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <div className={`${isLandscapeTouchLayout ? 'p-1.5 md:p-2 lg:p-8' : 'p-2 md:p-3 lg:p-8'}`}>
        <div className="max-w-4xl mx-auto">
          {activeTab === 'sudoku' && (
            <div className={`hidden lg:block mb-6 p-4 rounded-lg ${darkMode ? 'bg-zinc-950' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-3 flex-wrap sm:gap-4">
                <span className={`font-medium ${darkMode ? 'text-zinc-200' : 'text-gray-700'}`}>{t.level}</span>
                <div className="flex gap-2 flex-wrap">
                  {difficulties.map((levelKey) => (
                    <button
                      key={levelKey}
                      onClick={() => setDifficulty(levelKey)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        difficulty === levelKey
                          ? darkMode
                            ? 'bg-zinc-700 text-white'
                            : 'bg-blue-600 text-white'
                          : darkMode
                            ? 'text-zinc-500 hover:text-zinc-200'
                            : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {t[levelKey]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className={`mb-4 border rounded-lg p-4 flex items-start ${darkMode ? 'bg-red-900 border-red-700' : 'bg-red-100 border-red-300'}`}>
              <div className="bg-red-400 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">!</div>
              <p className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-800'}`}>{errorMessage}</p>
            </div>
          )}

          <div className="flex flex-col gap-4 sm:gap-8 lg:flex-row lg:items-start">
            <SudokuBoard
              activeTab={activeTab}
              darkMode={darkMode}
              t={t}
              grid={grid}
              selectedCell={selectedCell}
              conflicts={conflicts}
              lockedCells={lockedCells}
              boardCellClass={boardCellClass}
              isPaused={isPaused}
              mistakes={mistakes}
              timer={timer}
              onCellClick={handleCellClick}
              onTogglePause={() => setIsPaused(!isPaused)}
              onResume={() => setIsPaused(false)}
            />

            <ControlPanel
              activeTab={activeTab}
              darkMode={darkMode}
              t={t}
              mistakes={mistakes}
              timer={timer}
              isPaused={isPaused}
              actionButtonClass={actionButtonClass}
              actionIconClass={actionIconClass}
              numberButtonClass={numberButtonClass}
              onTogglePause={() => setIsPaused(!isPaused)}
              onUndo={handleUndo}
              onClear={handleClear}
              onClearAll={handleClearAll}
              onNumberClick={handleNumberClick}
              onSolve={handleSolve}
            />
          </div>
        </div>
      </div>

      {(gameOver || gameWon) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-8 max-w-md w-full mx-4 ${darkMode ? 'bg-zinc-950' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold text-center mb-4 ${darkMode ? 'text-zinc-100' : 'text-gray-900'}`}>
              {gameWon ? t.gameWon : t.gameOver}
            </h2>
            <p className={`text-center mb-6 ${darkMode ? 'text-zinc-300' : 'text-gray-600'}`}>
              {gameWon ? t.gameWonText : t.gameOverText}
            </p>
            <div className="flex flex-col gap-3">
              {gameOver && (
                <button
                  onClick={handleSecondChance}
                  className={`w-full py-3 text-white font-semibold rounded-lg transition-colors ${darkMode ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {t.secondChance}
                </button>
              )}
              <button
                onClick={handleNewGameFromModal}
                className={`w-full py-3 font-semibold rounded-lg transition-colors ${
                  darkMode ? 'bg-zinc-900 text-zinc-100 hover:bg-zinc-800' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {t.newGame}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SudokuApp;
