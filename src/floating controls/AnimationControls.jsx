import { useRef } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Draggable from "react-draggable";

export default function AnimationControls({
  isAnimating,
  playPauseDisabled,
  onPlayPauseClick,
}) {
  const nodeRef = useRef(null);

  return (
    <Draggable nodeRef={nodeRef}>
      <Card
        ref={nodeRef}
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          margin: "1rem",
          zIndex: "10"
        }}
      >
        <Card.Body>
          <Container>
            <Button disabled={playPauseDisabled} onClick={onPlayPauseClick}>
              { isAnimating ? 'Pause' : 'Play' }
            </Button>
          </Container>
        </Card.Body>
      </Card>
    </Draggable>
  )
}