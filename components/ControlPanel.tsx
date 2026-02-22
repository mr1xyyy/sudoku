import React from 'react';
import { Eraser, Pause, Play, RotateCcw, Trash2 } from 'lucide-react';
import ActionIconButton from './ActionIconButton';
import NumberPad from './NumberPad';
import type { ActiveTab, Translation } from '../types/sudoku';

type ControlPanelProps = {
  activeTab: ActiveTab;
  darkMode: boolean;
  t: Translation;
  mistakes: number;
  timer: number;
  isPaused: boolean;
  actionButtonClass: string;
  actionIconClass: string;
  numberButtonClass: string;
  onTogglePause: () => void;
  onUndo: () => void;
  onClear: () => void;
  onClearAll: () => void;
  onNumberClick: (num: number) => void;
  onSolve: () => void;
};

const ControlPanel = ({
  activeTab,
  darkMode,
  t,
  mistakes,
  timer,
  isPaused,
  actionButtonClass,
  actionIconClass,
  numberButtonClass,
  onTogglePause,
  onUndo,
  onClear,
  onClearAll,
  onNumberClick,
  onSolve
}: ControlPanelProps) => {
  return (
    <div className="flex w-full flex-col gap-4 lg:flex-1">
      {activeTab === 'sudoku' && (
        <div className={`hidden lg:block p-3 sm:p-4 rounded-lg ${darkMode ? 'bg-zinc-950' : 'bg-white'} shadow-lg`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{t.mistakes}</div>
              <div className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-zinc-100' : 'text-gray-900'}`}>{mistakes}/3</div>
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
              <div className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-zinc-100' : 'text-gray-900'}`}>
                {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2.5 justify-center sm:gap-4">
        <ActionIconButton
          onClick={onUndo}
          className={`flex ${actionButtonClass} flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
            darkMode ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-blue-50 hover:bg-blue-100'
          }`}
          icon={<RotateCcw className={`${actionIconClass} ${darkMode ? 'text-zinc-200' : 'text-blue-600'}`} />}
          label={t.undo}
          labelClassName={`hidden lg:inline max-w-[64px] text-xs sm:text-[13px] text-center leading-tight ${
            darkMode ? 'text-zinc-200' : 'text-blue-600'
          }`}
        />
        <ActionIconButton
          onClick={onClear}
          className={`flex ${actionButtonClass} flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
            darkMode ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-blue-50 hover:bg-blue-100'
          }`}
          icon={<Eraser className={`${actionIconClass} ${darkMode ? 'text-zinc-200' : 'text-blue-600'}`} />}
          label={t.erase}
          labelClassName={`hidden lg:inline max-w-[64px] text-xs sm:text-[13px] text-center leading-tight ${
            darkMode ? 'text-zinc-200' : 'text-blue-600'
          }`}
        />
        <ActionIconButton
          onClick={onClearAll}
          className={`flex ${actionButtonClass} flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
            darkMode ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-blue-50 hover:bg-blue-100'
          }`}
          icon={<Trash2 className={`${actionIconClass} ${darkMode ? 'text-zinc-200' : 'text-blue-600'}`} />}
          label={t.clearAll}
          labelClassName={`hidden lg:inline max-w-[64px] text-xs sm:text-[13px] text-center leading-tight ${
            darkMode ? 'text-zinc-200' : 'text-blue-600'
          }`}
        />
      </div>

      <NumberPad
        onSelect={onNumberClick}
        buttonClassName={`${numberButtonClass} border font-semibold transition-all duration-150 active:scale-95 ${
          darkMode
            ? 'bg-zinc-900 border-zinc-700 text-zinc-100 hover:bg-zinc-800 hover:border-zinc-500'
            : 'bg-blue-100 border-blue-200 text-blue-600 hover:bg-blue-200 hover:border-blue-300'
        }`}
      />

      <button
        onClick={onSolve}
        className={`w-auto lg:w-full self-center lg:self-auto px-8 md:px-10 lg:px-0 py-3 lg:py-4 font-semibold rounded-lg transition-colors ${
          darkMode ? 'bg-zinc-700 text-white hover:bg-zinc-600' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {activeTab === 'sudoku' ? t.newGame : t.solveSudoku}
      </button>
    </div>
  );
};

export default ControlPanel;
