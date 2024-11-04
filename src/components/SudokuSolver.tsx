import React, { useState, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button"
import { PlayIcon, PauseIcon, RotateCcwIcon } from 'lucide-react';
import { Grid, SolveState, CellPosition } from '../types/sudoku';
import SudokuGrid from './SudokuGrid';
import { createEmptyGrid, isValidCell, findEmptyCell } from '../utils/sudoku';

const SudokuSolver = () => {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [solveState, setSolveState] = useState<SolveState>('idle');
  const [currentCell, setCurrentCell] = useState<CellPosition | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [speed, setSpeed] = useState(100); // 100ms by default

  const solvingRef = useRef(false);

  const solve = useCallback(async (testGrid: Grid): Promise<boolean> => {
    const empty = findEmptyCell(testGrid);

    if(!empty) {
      setSolveState('solved');
      solvingRef.current = false;
      return true;
    }

    const {row, col} = empty;
    setCurrentCell({row, col});

    for (let num = 1; num <= 9; num++) {

      if (!solvingRef.current) return false;
      
      const numStr = num.toString();

      if (isValidCell(testGrid, {row, col}, numStr)) {

        testGrid[row][col] = numStr;
        setGrid([...testGrid]);

        await new Promise<void>((resolve) => {
          timeoutRef.current = window.setTimeout(() => {
            resolve();
          }, speed)
        });

        if (await solve(testGrid)) {
          return true;
        }

        testGrid[row][col] = '';
        setGrid([...testGrid]);
      }
    }

    return false;

  }, [speed]);

  const handleSolve = async () => {
    setSolveState('solving');
    solvingRef.current = true;
    const gridCopy = grid.map(row => [...row]);
    const success = await solve(gridCopy);

    if(!success && solveState === 'solving') {
      setSolveState('idle');
      setCurrentCell(null);
    }
  }

  const handlePause = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setSolveState('paused');
  }

  const handleResume = () => {
    setSolveState('solving');
    solve(grid);
  }

  const handleReset = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setGrid(createEmptyGrid())
    setSolveState('idle');
    setCurrentCell(null);
  }

  // cleanup on mount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-bold">Sudoku Solver</h1>

      <div className="flex items-center gap-4">
        <label className="text-sm">Speed:</label>
        <input
          type="range"
          min="50"
          max="500"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-32"
        />
        <span className="text-sm">{speed}ms</span>
      </div>

      <SudokuGrid
        initialValues={grid}
        onGridChange={setGrid}
        isEditable={solveState === 'idle'}
        highlightedCell={currentCell}
      />

      <div className="flex gap-4">
        {solveState === 'idle' && (
          <Button
            onClick={handleSolve}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <PlayIcon className="w-4 h-4 mr-2" />
            Solve
          </Button>
        )}

        {solveState === 'solving' && (
          <Button
            onClick={handlePause}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            <PauseIcon className="w-4 h-4 mr-2"/>
            Pause
          </Button>
        )}

        {solveState === 'paused' && (
          <>
          <Button
            onClick={handleResume}
            className="bg-green-500 hover:bg-green-600"
          >
            <PlayIcon className="w-4 h-4 mr-2"/>
            Resume
          </Button>
          <Button
            onClick={handleReset}
            className="bg-green-500 hover:bg-green-600"
          >
            <RotateCcwIcon className="w-4 h-4 mr-2"/>
            Reset
          </Button>
        </>
        )}

        {solveState === 'solved' && (
          <div>
            <p className="text-green-600 font-medium">Sudoku solved!</p>
            <Button
              onClick={handleReset}
              className="bg-green-500 hover:bg-green-600"
            >
              <RotateCcwIcon className="w-4 h-4 mr-2"/>
              Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  )
  
}

export default SudokuSolver;