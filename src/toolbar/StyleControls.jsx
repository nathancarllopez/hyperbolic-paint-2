import { useRef } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Draggable from "react-draggable";

export default function HistoryControls({
  deleteDisabled,
  onDeleteClick,
}) {
  const nodeRef = useRef(null);

  const buttonInfo = [
    { key: 'undo', label: "Undo", disabled: deleteDisabled, onClick: onDeleteClick },
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