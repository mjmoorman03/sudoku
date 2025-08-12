'use client';

import { useState, useEffect } from "react";
import SudokuGrid from "./sudokuGrid";
import Button from "./button";
import ZoomButton from "./zoomButton";
import Controls from "./controls";
import easyPuzzles from '../data/easyPuzzles.json';
import mediumPuzzles from '../data/mediumPuzzles.json';
import hardPuzzles from '../data/hardPuzzles.json';


const initialGrid = [
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '']
];


export default function SudokuInterface() {
    const [checkStatus, setCheckStatus] = useState<'valid' | 'invalid' | 'unchecked'>('unchecked');
    const [grid, setGrid] = useState(initialGrid);
    const [defaultGrid, setDefaultGrid] = useState(initialGrid)
    const [gridColor, setGridColor] = useState(initialGrid);
    const [visible, setVisible] = useState(false);
    const [focusedCell, setFocusedCell] = useState<[number, number] | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1.0);
    const [panelStatus, setPanelStatus] = useState<'annotations' | 'ordinary' | 'colors'>('ordinary');


    useEffect(() => {
        if (checkStatus === 'unchecked') {
            setVisible(false);
            return;
        }
        // reset to hidden, then show on the next frame so transition runs
        setVisible(false);
        const t = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(t);
    }, [checkStatus]);

    function handleCellChange(row: number, col: number, value: string) {
        // set new color grid value
        if (panelStatus === 'colors' && ['Khaki', 'DarkSeaGreen', 'LightSkyBlue', 'PeachPuff', 'Plum', 'LightGreen', 'LightSalmon', 'LightSteelBlue', 'LightCoral'].includes(value)) {
            setGridColor((prevGrid) => {
                const newColorGird = prevGrid.map((r, i) => {
                    if (i === row) {
                        return r.map((v, j) => {
                            if (j === col) {
                                if (v === value) {
                                    return ''; // toggle off
                                }
                                return value; // set to new color
                            } else {
                                return v;
                            }
                        });
                    } else {
                        return r; 
                    }
                });
                return newColorGird;
            });
            return;
        }
        if (defaultGrid[row][col] !== '') {
            // don't allow changes to default grid cells
            return;
        }
        const newGrid = grid.map((r, i) => (
            i === row ? r.map((v, j) => (j === col ? value : v)) : r
        ));
        setGrid(newGrid);
    }

    function handleZoomIn() {
        setZoomLevel((zl) => Math.min(3.0, zl + 0.1));
    }

    function handleZoomOut() {
        setZoomLevel((zl) => Math.max(0.5, zl - 0.1));
    }

    function handleArrowKey(row: number, col: number, direction: string) {
        let newRow = row;
        let newCol = col;
        
        switch (direction) {
            case 'ArrowUp':
                newRow = Math.max(0, row - 1);
                break;
            case 'ArrowDown':
                newRow = Math.min(8, row + 1);
                break;
            case 'ArrowLeft':
                newCol = Math.max(0, col - 1);
                break;
            case 'ArrowRight':
                newCol = Math.min(8, col + 1);
                break;
        }
        
        setFocusedCell([newRow, newCol]);
    }

    function handleCellFocus(row: number, col: number) {
        setFocusedCell([row, col]);
    }

    function handleCheckGrid() {
        // check rows
        for (let i = 0; i < 9; i++) {
            const seen = new Set<string>();
            for (let j = 0; j < 9; j++) {
                const val = grid[i][j];
                if (val === '' || seen.has(val)) {
                    setCheckStatus('invalid');
                    return;
                }
                seen.add(val);
            }
        }
        // check columns
        for (let j = 0; j < 9; j++) {
            const seen = new Set<string>();
            for (let i = 0; i < 9; i++) {
                const val = grid[i][j];
                if (val === '' || seen.has(val)) {
                    setCheckStatus('invalid');
                    return;
                }
                seen.add(val);
            }
        }
        // check 3x3 boxes
        for (let boxRow = 0; boxRow < 3; boxRow++) {
            for (let boxCol = 0; boxCol < 3; boxCol++) {
                const seen = new Set<string>();
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        const val = grid[3 * boxRow + i][3 * boxCol + j];
                        if (val === '' || seen.has(val)) {
                            setCheckStatus('invalid');
                            return;
                        }
                        seen.add(val);
                    }
                }
            }
        }
        setCheckStatus('valid');
    }

    function handleNewPuzzle(e: React.MouseEvent<HTMLButtonElement>) {
        const difficulty = e.currentTarget?.textContent?.toLowerCase();
        const puzzles = 
            difficulty === 'easy' ? easyPuzzles :
            difficulty === 'medium' ? mediumPuzzles :
            difficulty === 'hard' ? hardPuzzles :
            easyPuzzles;
        const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
        // convert to 2D array
        const newGrid : string[][] = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const val = randomPuzzle['puzzle'][i * 9 + j];
                if (newGrid[i] === undefined) {
                    newGrid[i] = [];
                }
                newGrid[i][j] = val === '0' ? '' : val;
            }
        }
        setDefaultGrid(newGrid);
        setGrid(newGrid);
        setCheckStatus('unchecked');
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {checkStatus !== 'unchecked' && 
            <h3 style={checkStatus === 'valid' ? {...statusValidStyle, opacity: visible ? 1 : 0} : {...statusInvalidStyle, opacity: visible ? 1 : 0}}>
                {checkStatus === 'invalid' ? 'There are errors in your solution.' : 'Congratulations! You solved the puzzle!'}
            </h3>}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", width: "100%" }}>
                    <Button label="Easy" onClick={handleNewPuzzle} />
                    <Button label="Medium" onClick={handleNewPuzzle} />
                    <Button label="Hard" onClick={handleNewPuzzle} />
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', width: '100%', transform: `translateX(-${17}px)`}}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <ZoomButton label="+" onClick={handleZoomIn} />
                        <ZoomButton label="-" onClick={handleZoomOut} />
                    </div>
                    <div style={{ justifySelf: 'center' }}>
                        <SudokuGrid 
                            grid={grid} 
                            defaultGrid={defaultGrid}
                            colorGrid={gridColor}
                            handleCellChange={handleCellChange} 
                            handleArrowKey={handleArrowKey}
                            handleCellFocus={handleCellFocus}
                            focusedCell={focusedCell}
                            zoomLevel={zoomLevel}
                        />
                    </div>
                    <div />
                </div>
                <Button label="Check Solution" onClick={handleCheckGrid} />
            </div>
            <Controls focusedCell={focusedCell} handleCellChange={handleCellChange} panelStatus={panelStatus} changePanel={setPanelStatus}/>
        </div>
    )
}

const statusValidStyle: React.CSSProperties = {
    height: '30px',
    marginBottom: '10px',
    fontSize: '18px',
    lineHeight: '0px',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '5px',
    padding: '20px',
    border: '1px solid green',
    transition: 'opacity 1s ease-in-out'
};

const statusInvalidStyle: React.CSSProperties = {
    height: '30px',
    lineHeight: '0px',
    marginBottom: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#ffcccc',
    color: 'red',
    border: '1px solid red',
    borderRadius: '8px',
    padding: '20px',
    transition: 'opacity 1s ease-in-out'
};