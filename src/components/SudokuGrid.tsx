import React, { ChangeEvent } from 'react';
import { SudokuGridProps, Grid } from '../types/sudoku';
import { createEmptyGrid } from '../utils/sudoku';

const SudokuGrid: React.FC<SudokuGridProps> = ({ 
  initialValues,
  onGridChange,
  isEditable = true,
  highlightedCell
}) => {
  const [grid, setGrid] = React.useState<Grid>(initialValues || createEmptyGrid());

  // Update grid when initialValues changes
  React.useEffect(() => {
    setGrid(initialValues || createEmptyGrid());
  }, [initialValues]);

  const handleCellChange = (row: number, col: number, value: string): void => {
    if (value !== '' && (!/^\d$/.test(value) || value === '0')) {
      return;
    }

    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = value;
    setGrid(newGrid)
    onGridChange?.(newGrid)
  }

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="grid grid-cols-9 border-2 border-gray-900">
        {grid.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((col, colIndex) => {

              const isHighlighted = highlightedCell?.row === rowIndex && highlightedCell?.col === colIndex;

              return (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  value={col}
                  className={`
                    text-center font-medium text-lg
                    border border-gray-200
                    focus:outline-none focus:bg-blue-50
                    disabled:bg-gray-100 disabled:text-gray-600
                    transition-colors duration-200
                    ${colIndex === 8 ? 'border-r-2 border-r-gray-900' : ''}
                    ${rowIndex === 8 ? 'border-b-2 border-b-gray-900' : ''}
                    ${colIndex % 3 === 2 ? 'border-r-2 border-r-gray-900' : ''}
                    ${rowIndex % 3 === 2 ? 'border-b-2 border-b-gray-900' : ''}
                    ${colIndex === 0 ? 'border-l-2 border-l-gray-900' : ''}
                    ${rowIndex === 0 ? 'border-t-2 border-t-gray-900' : ''}
                    ${isHighlighted? 'bg-yellow-100' : 'bg-white'}
                    ${!isEditable && col ? 'bg-gray-50' : ''}
                  `}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleCellChange(rowIndex, colIndex, e.target.value)}
                  disabled={!isEditable}
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}`}
                />
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default SudokuGrid;