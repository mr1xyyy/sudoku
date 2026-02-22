import React from 'react';
import { Pause, Play } from 'lucide-react';
import type { ActiveTab, SelectedCell, SudokuGrid, Translation } from '../types/sudoku';

type SudokuBoardProps = {
  activeTab: ActiveTab;
  darkMode: boolean;
  t: Translation;
  grid: SudokuGrid;
  selectedCell: SelectedCell;
  conflicts: Set<string>;
  lockedCells: Set<string>;
  boardCellClass: string;
  isPaused: boolean;
  mistakes: number;
  timer: number;
  onCellClick: (row: number, col: number) => void;
  onTogglePause: () => void;
  onResume: () => void;
};

const SudokuBoard = ({
  activeTab,
  darkMode,
  t,
  grid,
  selectedCell,
  conflicts,
  lockedCells,
  boardCellClass,
  isPaused,
  mistakes,
  timer,
  onCellClick,
  onTogglePause,
  onResume
}: SudokuBoardProps) => {
  return (
    <>
      <div className="w-full lg:hidden">
        {activeTab === 'sudoku' && (
          <div className={`lg:hidden w-full mb-2 p-2.5 md:p-3 rounded-lg ${darkMode ? 'bg-zinc-950' : 'bg-white'} shadow-lg`}>
            <div className="flex justify-between items-center">
              <div>
                <div className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{t.mistakes}</div>
                <div className={`text-lg md:text-xl font-bold ${darkMode ? 'text-zinc-100' : 'text-gray-900'}`}>{mistakes}/3</div>
              </div>
              <div>
                <div className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-gray-600'} flex items-center gap-2`}>
                  {t.time}
                  <button
                    onClick={onTogglePause}
                    className={`p-1 rounded transition-colors ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`}
                  >
                    {isPaused ? (
                      <Play className={`w-4 h-4 ${darkMode ? 'text-zinc-300' : 'text-gray-600'}`} />
                    ) : (
                      <Pause className={`w-4 h-4 ${darkMode ? 'text-zinc-300' : 'text-gray-600'}`} />
                    )}
                  </button>
                </div>
                <div className={`text-lg md:text-xl font-bold ${darkMode ? 'text-zinc-100' : 'text-gray-900'}`}>
                  {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative w-full overflow-x-auto lg:overflow-visible flex justify-center lg:justify-start">
        <div className={`inline-block p-1.5 md:p-2 lg:p-4 rounded-lg shadow-lg ${darkMode ? 'bg-zinc-950' : 'bg-white'}`}>
          <div className={`inline-block border-4 ${darkMode ? 'border-zinc-700' : 'border-gray-800'}`}>
            {[0, 3, 6].map((blockRow) => (
              <div key={blockRow} className="flex">
                {[0, 3, 6].map((blockCol) => (
                  <div
                    key={blockCol}
                    className={`border-2 ${darkMode ? 'border-zinc-700' : 'border-gray-800'} ${blockCol > 0 ? 'border-l-4' : ''}`}
                  >
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex">
                        {[0, 1, 2].map((j) => {
                          const row = blockRow + i;
                          const col = blockCol + j;
                          const isSelected = selectedCell?.row === row && selectedCell?.col === col;
                          const hasConflict = conflicts.has(`${row}-${col}`);
                          const isLocked = lockedCells.has(`${row}-${col}`);

                          const inSameRow = selectedCell?.row === row;
                          const inSameCol = selectedCell?.col === col;
                          const inSameBlock =
                            selectedCell &&
                            Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
                            Math.floor(selectedCell.col / 3) === Math.floor(col / 3);
                          const isHighlighted = inSameRow || inSameCol || inSameBlock;

                          let bgColor = darkMode ? 'bg-zinc-900' : 'bg-white';
                          let textColor = darkMode ? 'text-zinc-100' : 'text-gray-800';
                          const borderColor = darkMode ? 'border-zinc-700' : 'border-gray-300';

                          if (isLocked) textColor = darkMode ? 'text-white' : 'text-gray-900';

                          if (hasConflict) {
                            bgColor = darkMode ? 'bg-red-900' : 'bg-red-200';
                            textColor = darkMode ? 'text-red-300' : 'text-red-600';
                          } else if (isSelected) {
                            bgColor = darkMode ? 'bg-zinc-700' : 'bg-blue-300';
                          } else if (isHighlighted) {
                            bgColor = darkMode ? 'bg-zinc-800' : 'bg-blue-100';
                          } else if (col % 3 === 1) {
                            bgColor = darkMode ? 'bg-zinc-950' : 'bg-blue-50';
                          }

                          return (
                            <div
                              key={j}
                              onClick={() => onCellClick(row, col)}
                              className={`${boardCellClass} border ${borderColor} flex items-center justify-center ${
                                isLocked ? 'font-bold' : 'font-semibold'
                              } ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'} transition-colors ${bgColor} ${textColor} ${
                                !isLocked && (darkMode ? 'hover:bg-zinc-700' : 'hover:bg-blue-100')
                              }`}
                            >
                              {grid[row][col]}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {isPaused && activeTab === 'sudoku' && (
          <div className={`absolute inset-0 flex items-center justify-center rounded-lg ${darkMode ? 'bg-black/90' : 'bg-white/90'}`}>
            <button
              onClick={onResume}
              className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-colors shadow-lg ${
                darkMode ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Play className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white ml-1" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SudokuBoard;
