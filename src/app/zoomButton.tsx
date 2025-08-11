import React from "react";

export default function ZoomButton({ label, onClick }: { label: string; onClick: () => void }) {
  const buttonStyle: React.CSSProperties = {
    padding: '5px',
    fontSize: '16px',
    color: 'white',
    backgroundColor: 'black',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '5px',
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      {label}
    </button>
  );
}