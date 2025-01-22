import { useRef } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Draggable from "react-draggable";

export default function HistoryControls({
  undoDisabled,
  redoDisabled,
  onUndoClick,
  onRedoClick
}) {
  const nodeRef = useRef(null);

  const buttonInfo = [
    { key: 'undo', label: "Undo", disabled: undoDisabled, onClick: onUndoClick },
    { key: 'redo', label: "Redo", disabled: redoDisabled, onClick: onRedoClick },
  ];

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
            <Row>
              {
                buttonInfo.map(({ key, label, disabled, onClick }) => (
                  <Col key={key}>
                    <Button
                      disabled={disabled}
                      onClick={onClick}
                    >
                      { label }
                    </Button>
                  </Col>
                ))
              }
            </Row>
          </Container>
        </Card.Body>
      </Card>
    </Draggable>
  );
}