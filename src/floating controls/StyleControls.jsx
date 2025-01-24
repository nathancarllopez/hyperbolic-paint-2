import { useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Draggable from "react-draggable";

export default function StyleControls({
  deleteDisabled,
  onDeleteClick,
}) {
  const nodeRef = useRef(null);
  const cardBodyRef = useRef(null);

  useEffect(() => {
    const cardBody = cardBodyRef.current;
    const cardBodyStyles = getComputedStyle(cardBody);
    const width = parseFloat(cardBodyStyles.getPropertyValue('width'));
    
    const card = nodeRef.current;
    card.style.left = `${(window.innerWidth - width) / 2}px`;
  }, []);

  const buttonInfo = [
    { key: 'delete', label: "Delete", disabled: deleteDisabled, onClick: onDeleteClick },
  ];

  return (
    <Draggable nodeRef={nodeRef}>
      <Card
        ref={nodeRef}
        style={{
          position: "fixed",
          top: 0,
          // left: "10rem",
          margin: "1rem",
          zIndex: "10"
        }}
      >
        <Card.Body ref={cardBodyRef}>
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