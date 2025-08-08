import { useState, useEffect, useRef } from 'react';


export default function SudokuCell({ 
    pos, 
    handleCellChange, 
    handleArrowKey, 
    handleCellFocus, 
    focusedCell, 
    value 
}: { 
    pos: [number, number], 
    handleCellChange: (row: number, col: number, value: string) => void, 
    handleArrowKey: (row: number, col: number, direction: string) => void,
    handleCellFocus: (row: number, col: number) => void,
    focusedCell: [number, number] | null,
    value: string 
}) {
    const [focus, setFocus] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

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
        style={focus ? cellStyleActive : cellStyleInactive}
        type='text' 
        onKeyDown={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={() => {}}
        value={value} />
    )
}


const cellStyleInactive: React.CSSProperties = {
  width: '40px',
  height: '40px',
  fontSize: '24px',
  textAlign: 'center',
  border: '1px solid #999',
  outline: 'none',
  caretColor: 'transparent',
  lineHeight: '40px',
  padding: 0,
  margin: 0,
  boxSizing: 'border-box',
};

const cellStyleActive: React.CSSProperties = {
  backgroundColor: '#636363',
  width: '40px',
  height: '40px',
  fontSize: '24px',
  textAlign: 'center',
  border: '1px solid #999',
  outline: 'none',
  caretColor: 'transparent',
  lineHeight: '40px',
  padding: 0,
  margin: 0,
  boxSizing: 'border-box',
};