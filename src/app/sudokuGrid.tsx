import SudokuBox from './sudokuBox';
import TrioLayout from './trioLayout';
import { JSX } from 'react';

export default function SudokuGrid({ 
    grid, 
    defaultGrid,
    colorGrid,
    handleCellChange, 
    handleArrowKey, 
    handleCellFocus, 
    focusedCell, 
    zoomLevel
} : { 
    grid: string[][], 
    defaultGrid: string[][],
    colorGrid: string[][],
    handleCellChange: (row: number, col: number, value: string) => void,
    handleArrowKey: (row: number, col: number, direction: string) => void,
    handleCellFocus: (row: number, col: number) => void,
    focusedCell: [number, number] | null,
    zoomLevel: number
}) {

    const boxes: JSX.Element[] = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            boxes.push(
                <SudokuBox 
                    key={`${i},${j}`} 
                    pos={[i, j]} 
                    handleCellChange={handleCellChange} 
                    handleArrowKey={handleArrowKey}
                    handleCellFocus={handleCellFocus}
                    focusedCell={focusedCell}
                    grid={grid}
                    defaultGrid={defaultGrid}
                    colorGrid={colorGrid}
                    zoomLevel={zoomLevel}
                />
            );
        }
    }

    return (
        <div style={sudokuGridStyle}>
        <TrioLayout>
            {boxes}
        </TrioLayout>
        </div>
    )
}

const sudokuGridStyle: React.CSSProperties = {
    border: '3px solid #000000',
    borderRadius: '11px'
};
