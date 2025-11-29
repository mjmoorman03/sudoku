import SudokuCell from "./sudokuCell";
import TrioLayout from "./trioLayout";
import { GridObject } from "./interfaces";

export default function SudokuBox({
  pos,
  handleCellChange,
  handleArrowKey,
  handleCellFocus,
  focusedCell,
  gridObj,
  zoomLevel,
}: {
  pos: [number, number];
  handleCellChange: (row: number, col: number, value: string) => void;
  handleArrowKey: (row: number, col: number, direction: string) => void;
  handleCellFocus: (row: number, col: number) => void;
  focusedCell: [number, number] | null;
  gridObj: GridObject;
  zoomLevel: number;
}) {
  const cells = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const row = 3 * pos[0] + i;
      const col = 3 * pos[1] + j;
      const defaultVal = gridObj.default[row][col] !== "";
      cells.push(
        <SudokuCell
          zoomLevel={zoomLevel}
          key={`${i},${j}`}
          pos={[row, col]}
          handleCellChange={handleCellChange}
          handleArrowKey={handleArrowKey}
          handleCellFocus={handleCellFocus}
          focusedCell={focusedCell}
          defaultVal={defaultVal}
          colorValue={gridObj.color[row][col]}
          annotations={gridObj.annotations[row][col]}
          value={gridObj.grid[row][col]}
        />
      );
    }
  }

  return (
    <div style={sudokuCellStyle}>
      <TrioLayout>{cells}</TrioLayout>
    </div>
  );
}

const sudokuCellStyle: React.CSSProperties = {
  border: "2px solid #000000",
};
