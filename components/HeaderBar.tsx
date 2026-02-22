import React from 'react';
import { Moon, Sun } from 'lucide-react';
import type { ActiveTab, DifficultyKey, Language, Translation } from '../types/sudoku';

type HeaderBarProps = {
  darkMode: boolean;
  activeTab: ActiveTab;
  language: Language;
  difficulty: DifficultyKey;
  difficulties: DifficultyKey[];
  t: Translation;
  showLanguageMenu: boolean;
  showDifficultyMenu: boolean;
  onTabChange: (tab: ActiveTab) => void;
  onSelectLanguage: (lang: Language) => void;
  onToggleLanguageMenu: () => void;
  onSelectDifficulty: (difficulty: DifficultyKey) => void;
  onToggleDifficultyMenu: () => void;
  onToggleDarkMode: () => void;
};

const HeaderBar = ({
  darkMode,
  activeTab,
  language,
  difficulty,
  difficulties,
  t,
  showLanguageMenu,
  showDifficultyMenu,
  onTabChange,
  onSelectLanguage,
  onToggleLanguageMenu,
  onSelectDifficulty,
  onToggleDifficultyMenu,
  onToggleDarkMode
}: HeaderBarProps) => {
  return (
    <header className={`border-b ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded flex items-center justify-center ${darkMode ? 'bg-zinc-700' : 'bg-blue-600'}`}>
                <div className="w-5 h-5 border-2 border-white grid grid-cols-3 gap-px">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="bg-white"></div>
                  ))}
                </div>
              </div>
              <span className={`text-lg lg:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sudoku</span>
            </div>

            <nav className="flex gap-3 sm:gap-6 lg:hidden">
              <button
                onClick={() => onTabChange('sudoku')}
                className={`pb-2 font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'sudoku'
                    ? darkMode
                      ? 'text-zinc-100 border-b-2 border-zinc-300'
                      : 'text-blue-600 border-b-2 border-blue-600'
                    : darkMode
                      ? 'text-zinc-500 hover:text-zinc-300'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.classic}
              </button>
              <button
                onClick={() => onTabChange('solver')}
                className={`pb-2 font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'solver'
                    ? darkMode
                      ? 'text-zinc-100 border-b-2 border-zinc-300'
                      : 'text-blue-600 border-b-2 border-blue-600'
                    : darkMode
                      ? 'text-zinc-500 hover:text-zinc-300'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.solver}
              </button>
            </nav>

            <nav className="hidden gap-6 lg:flex">
              <button
                onClick={() => onTabChange('sudoku')}
                className={`pb-2 font-medium transition-colors ${
                  activeTab === 'sudoku'
                    ? darkMode
                      ? 'text-zinc-100 border-b-2 border-zinc-300'
                      : 'text-blue-600 border-b-2 border-blue-600'
                    : darkMode
                      ? 'text-zinc-500 hover:text-zinc-300'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.classic}
              </button>
              <button
                onClick={() => onTabChange('solver')}
                className={`pb-2 font-medium transition-colors ${
                  activeTab === 'solver'
                    ? darkMode
                      ? 'text-zinc-100 border-b-2 border-zinc-300'
                      : 'text-blue-600 border-b-2 border-blue-600'
                    : darkMode
                      ? 'text-zinc-500 hover:text-zinc-300'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.solver}
              </button>
            </nav>
          </div>

          <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:justify-start lg:gap-4">
            <div className="relative flex items-center gap-2 lg:hidden">
              <span className={`text-sm font-medium ${darkMode ? 'text-zinc-200' : 'text-gray-700'}`}>{t.language}</span>
              <button
                onClick={onToggleLanguageMenu}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  darkMode ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {language.toUpperCase()}
              </button>
              {showLanguageMenu && (
                <div
                  className={`absolute left-0 top-full mt-2 z-20 min-w-[132px] rounded-lg border p-1.5 shadow-lg ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-gray-200'}`}
                >
                  {(['rus', 'eng', 'uzb'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => onSelectLanguage(lang)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                        language === lang
                          ? darkMode
                            ? 'bg-zinc-700 text-white'
                            : 'bg-blue-600 text-white'
                          : darkMode
                            ? 'text-zinc-300 hover:bg-zinc-800'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}

              <span className={`text-sm font-medium ${darkMode ? 'text-zinc-200' : 'text-gray-700'}`}>{t.level}</span>
              <button
                onClick={onToggleDifficultyMenu}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  darkMode ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t[difficulty]}
              </button>
              {showDifficultyMenu && (
                <div
                  className={`absolute right-0 top-full mt-2 z-20 min-w-[160px] rounded-lg border p-1.5 shadow-lg ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-gray-200'}`}
                >
                  {difficulties.map((levelKey) => (
                    <button
                      key={levelKey}
                      onClick={() => onSelectDifficulty(levelKey)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                        difficulty === levelKey
                          ? darkMode
                            ? 'bg-zinc-700 text-white'
                            : 'bg-blue-600 text-white'
                          : darkMode
                            ? 'text-zinc-300 hover:bg-zinc-800'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {t[levelKey]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden lg:flex gap-2">
              {(['rus', 'eng', 'uzb'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onSelectLanguage(lang)}
                  className={`px-2 py-1 rounded transition-colors text-xs font-medium sm:px-3 sm:text-sm ${
                    language === lang
                      ? darkMode
                        ? 'bg-zinc-700 text-white'
                        : 'bg-blue-600 text-white'
                      : darkMode
                        ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-lg transition-all ${darkMode ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
