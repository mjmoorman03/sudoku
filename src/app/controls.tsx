import Button from "./button";
import TrioLayout from "./trioLayout";


export default function Controls({ focusedCell, handleCellChange, panelStatus, changePanel }: { focusedCell?: [number, number] | null, handleCellChange: (row: number, col: number, value: string) => void, panelStatus: 'annotations' | 'ordinary' | 'colors', changePanel: (panel: 'annotations' | 'ordinary' | 'colors') => void }) {

    const numberButtons = [];
    for (let i = 1; i <= 9; i++) {
        numberButtons.push(
            <Button 
                key={i} 
                label={i.toString()} 
                onClick={() => {
                    if (focusedCell) {
                        handleCellChange(focusedCell[0], focusedCell[1], i.toString());
                    }
                }}
                style={numberButtonStyle}
            />
        );
    }

    const colorButtons = ['Khaki', 'DarkSeaGreen', 'LightSkyBlue', 'PeachPuff', 'Plum', 'LightGreen', 'LightSalmon', 'LightSteelBlue', 'LightCoral'].map(color => (
        <Button 
            key={color} 
            label={''} 
            onClick={() => {
                if (focusedCell) {
                    handleCellChange(focusedCell[0], focusedCell[1], color);
                }
            }}
            style={{ ...numberButtonStyle, backgroundColor: color }}
        />
    ));

    return (
        <div className='sm:mx-4' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', border: '2px solid #000000ff', borderRadius: '12px', padding: '5px'}}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Button label={String.fromCharCode(0x2151)} onClick={() => changePanel('annotations')} style={panelStatus === 'annotations' ? activeControlButtonStyle : controlButtonStyle} />
                <Button label='1' onClick={() => changePanel('ordinary')} style={panelStatus === 'ordinary' ? activeControlButtonStyle : controlButtonStyle} />
                <Button label={String.fromCharCode(0xD83C, 0xDF08)} onClick={() => changePanel('colors')} style={panelStatus === 'colors' ? activeControlButtonStyle : controlButtonStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <TrioLayout>
                    {panelStatus === 'annotations' ? numberButtons : panelStatus === 'ordinary' ? numberButtons : colorButtons}
                </TrioLayout>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <Button label={`\u232B`} onClick={() => (focusedCell) ? handleCellChange(focusedCell[0], focusedCell[1], '') : null} style={delButtonStyle}/>
                </div>
        </div>
    )
}


const controlButtonStyle: React.CSSProperties = {
    backgroundColor: "#292929ff",
    border: "2px solid #aaaaaaff",
    color: "white",
    fontWeight: "bold",
    padding: "5px 10px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "14px",
    margin: "10px 3px",
    cursor: "pointer",
    borderRadius: "12px",
    transition: "background-color 0.3s, border-color 0.3s",
};

const activeControlButtonStyle: React.CSSProperties = {
    ...controlButtonStyle,
    backgroundColor: "#8b8b8bff",
    border: "2px solid #444444ff",
};

const numberButtonStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    backgroundColor: "#444444ff",
    border: "2px solid #aaaaaaff",
    color: "white",
    fontWeight: "bold",
    padding: "10px 15px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "2px",
    cursor: "pointer",
    borderRadius: "0px",
    transition: "background-color 0.3s, border-color 0.3s",
};

const delButtonStyle: React.CSSProperties = {
    width: '70px',
    height: '30px',
    backgroundColor: "#444444ff",
    border: "2px solid #aaaaaaff",
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "26pt",
    lineHeight: '0px',
    cursor: "pointer",
    borderRadius: "2px",
}