import React from 'react';
import { createRoot } from 'react-dom/client';
import SudokuApp from './sudoku_app';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SudokuApp />
  </React.StrictMode>
);
