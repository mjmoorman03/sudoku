import SudokuCell from './sudokuCell'
import TrioLayout from './trioLayout'

export default function SudokuBox({ 
    pos, 
    handleCellChange, 
    handleArrowKey, 
    handleCellFocus, 
    focusedCell, 
    grid 
}: { 
    pos: [number, number], 
    handleCellChange: (row: number, col: number, value: string) => void, 
    handleArrowKey: (row: number, col: number, direction: string) => void,
    handleCellFocus: (row: number, col: number) => void,
    focusedCell: [number, number] | null,
    grid: string[][] 
}) {

    const cells = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const row = 3 * pos[0] + i;
            const col = 3 * pos[1] + j;
            cells.push(
                <SudokuCell
                    key={`${i},${j}`}
                    pos={[row, col]}
                    handleCellChange={handleCellChange}
                    handleArrowKey={handleArrowKey}
                    handleCellFocus={handleCellFocus}
                    focusedCell={focusedCell}
                    value={grid[row][col]}
                />
            );
        }
    }

    return (
        <div style={sudokuCellStyle}>
            <TrioLayout>{cells}</TrioLayout>
        </div>
    )
}

const sudokuCellStyle: React.CSSProperties = {
    border: '2px solid #999'
};

