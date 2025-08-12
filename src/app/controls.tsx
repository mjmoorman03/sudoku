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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', border: '2px solid #000000ff', borderRadius: '12px', padding: '5px', margin: '30px'}}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Button label="Annotations" onClick={() => changePanel('annotations')} style={panelStatus === 'annotations' ? activeControlButtonStyle : controlButtonStyle} />
                <Button label="Ordinary" onClick={() => changePanel('ordinary')} style={panelStatus === 'ordinary' ? activeControlButtonStyle : controlButtonStyle} />
                <Button label="Colors" onClick={() => changePanel('colors')} style={panelStatus === 'colors' ? activeControlButtonStyle : controlButtonStyle} />
            </div>
            <TrioLayout>
                {panelStatus === 'annotations' ? numberButtons : panelStatus === 'ordinary' ? numberButtons : colorButtons}
            </TrioLayout>
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