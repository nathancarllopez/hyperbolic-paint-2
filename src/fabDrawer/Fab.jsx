import Button from "react-bootstrap/Button";

export default function Fab({ placement, onClick, icon }) {
  const cornerCoords = (() => {
    switch(placement) {
      case 'topLeft':
        return { top: 0, left: 0 };
      case 'topRight':
        return { top: 0, right: 0 };
      case 'bottomLeft':
        return { bottom: 0, left: 0 };
      case 'bottomRight':
        return { bottom: 0, right: 0 };
    }
  })();

  return (
    <div style={{
      position: "fixed",
      margin: "1rem",
      zIndex: "10",
      ...cornerCoords
    }}>
      <Button
        onClick={onClick}
        bsPrefix="btn btn-primary btn-lg rounded-circle"
      >
        {icon}
      </Button>
    </div>
  );
}