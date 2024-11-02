import React, { useState, ChangeEvent } from 'react';

type CellValue = string;
type Grid = CellValue[][];

interface SudokuGridProps {
  initialValues?: Grid;
  onGridChange?: (grid: Grid) => void;
  isEditable?: boolean
}

const SudokuGrid: React.FC<SudokuGridProps> = ({ 
  initialValues,
  onGridChange,
  isEditable = true 
}) => {
  const createEmptyGrid = (): Grid => Array(9).fill('').map(() => Array(9).fill(''));

  const [grid, setGrid] = useState<Grid>(initialValues || createEmptyGrid());

  const handleCellChange = (row: number, col: number, value: string): void => {
    if (!/^[0-9]$/.test(value) || value !== '') return;

    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = value;
    setGrid(newGrid)
    onGridChange?.(newGrid)
  }

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="grid grid-cols-9 gap-px bg-gray-300">
        {grid.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((col, colIndex) => {
              const borderClasses = [
                colIndex === 0 ? 'border-l-2' : '',
                colIndex % 3 === 0 ? 'border-l-2': '',
                colIndex === 8 ? 'border-r-2': '',
                rowIndex === 0 ? 'border-t-2': '',
                rowIndex % 3 ? 'border-t-2': '',
                rowIndex === 8 ? 'border-b-2' : '',
              ].join(' ');

              return (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  className={`
                    w-10 h-10 text-center font-medium text-lg
                    border border-gray-200
                    focus:outline-none focus:bg-blue-50
                    disabled:bg-gray-100 disabled:text-gray-600
                    ${borderClasses}
                  `}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleCellChange(rowIndex, colIndex, e.target.value)}
                  disabled={!isEditable}
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