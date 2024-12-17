import { useRef } from "react";
import { Button, Card, Container } from "react-bootstrap";
import Draggable from "react-draggable";

export default function HistoryControls({ handleUndoClick, disableUndo }) {
  const nodeRef = useRef(null);

  return (
    <Draggable nodeRef={nodeRef}>
      <Card
        ref={nodeRef}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          margin: "1rem",
          zIndex: "10"
        }}
      >
        <Card.Body>
          <Container>
            <Button
              onClick={handleUndoClick}
              disabled={disableUndo}
            >
              Undo
            </Button>
          </Container>
        </Card.Body>
      </Card>
    </Draggable>
  );
}