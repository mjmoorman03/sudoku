export default function Button({
  label,
  onClick,
  style = buttonStyle,
}: {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}) {
  return (
    <div className="!sm:mx-1">
      <button style={style} onClick={onClick}>
        {label}
      </button>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#292929ff",
  border: "2px solid #aaaaaaff",
  color: "white",
  fontWeight: "bold",
  padding: "15px 32px",
  textAlign: "center",
  textDecoration: "none",
  display: "inline-block",
  fontSize: "16px",
  margin: "30px 2px",
  cursor: "pointer",
  borderRadius: "12px",
  transition: "background-color 0.3s",
};
