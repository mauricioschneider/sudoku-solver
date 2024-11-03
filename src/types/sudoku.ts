export type CellValue = string;
export type Grid = CellValue[][];

export type SolveState = 'idle' | 'solving' | 'paused' | 'solved';

export interface CellPosition {
  row: number;
  col: number;
}

export interface SudokuGridProps {
  initialValues?: Grid;
  onGridChange?: (grid: Grid) => void;
  isEditable?: boolean;
  highlightedCell?: CellPosition | null;
}