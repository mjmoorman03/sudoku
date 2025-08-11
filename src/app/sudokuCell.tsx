import { useState, useEffect, useRef } from 'react';


export default function SudokuCell({ 
    zoomLevel,
    pos, 
    handleCellChange, 
    handleArrowKey, 
    handleCellFocus, 
    focusedCell, 
    defaultVal,
    value,  
}: { 
    zoomLevel: number,
    pos: [number, number], 
    handleCellChange: (row: number, col: number, value: string) => void, 
    handleArrowKey: (row: number, col: number, direction: string) => void,
    handleCellFocus: (row: number, col: number) => void,
    focusedCell: [number, number] | null,
    value: string,
    defaultVal: boolean
}) {
    const [focus, setFocus] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const cellStyleInactive: React.CSSProperties = {
        width: `${40 * zoomLevel}px`,
        height: `${40 * zoomLevel}px`,
        fontSize: `${24 * zoomLevel}px`,
        textAlign: 'center',
        border: '1px solid #000000ff',
        borderRadius: '2px',
        outline: 'none',
        color: 'black',
        backgroundColor: 'white',
        caretColor: 'transparent',
        cursor: 'pointer',
        lineHeight: `${40 * zoomLevel}px`,
        padding: 0,
        margin: 0,
        boxSizing: 'border-box',
        };


    const cellStyleActive: React.CSSProperties = {
        ...cellStyleInactive,
        backgroundColor: '#d6d6d6ff'
    };

    const cellStyleActiveDefault: React.CSSProperties = {
        ...cellStyleActive,
        fontWeight: 'bold'
    };

    const cellStyleInactiveDefault: React.CSSProperties = {
        ...cellStyleInactive,
        fontWeight: 'bold'
    };

    // Focus this cell when it becomes the focused cell
    useEffect(() => {
        if (focusedCell && focusedCell[0] === pos[0] && focusedCell[1] === pos[1] && inputRef.current) {
            inputRef.current.focus();
        }
    }, [focusedCell, pos]);

    function handleFocus() {
        setFocus(true);
        handleCellFocus(pos[0], pos[1]);
    }

    function handleBlur() {
        setFocus(false);
    }

    function handleChange(e: React.KeyboardEvent<HTMLInputElement>) {
        const key = e.key;
        
        // Handle arrow keys
        if (key.startsWith('Arrow')) {
            e.preventDefault();
            handleArrowKey(pos[0], pos[1], key);
            return;
        }
        
        if (defaultVal) {
            return;
        }
        
        // Handle number input
        for (let i = 1; i < 10; i++) {
            if (String(i) === key) {
                handleCellChange(pos[0], pos[1], key);
                return;
            }
        }
        
        // Handle deletion
        if (key === "Backspace" || key === "Delete") {
            handleCellChange(pos[0], pos[1], '');
        }
    }

    return (
        <input 
        ref={inputRef}
        style={
            focus ? (defaultVal ? cellStyleActiveDefault : cellStyleActive) : (defaultVal ? cellStyleInactiveDefault : cellStyleInactive)
        }
        type='text' 
        onKeyDown={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={() => {}}
        value={value} />
    )
}
