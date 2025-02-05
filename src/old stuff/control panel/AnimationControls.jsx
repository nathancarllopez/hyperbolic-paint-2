import { Button, Card, Form, Stack } from "react-bootstrap";
import CollapsibleCard from "../../util/CollapsibleCard";
import { useState } from "react";

export default function AnimationControls({
  isAnimating,
  setIsAnimating,
  animationSpeed,
  setAnimationSpeed,
  animationName,
  isOpen,
  toggleIsOpen
}) {
  // const [animSpeed, setAnimSpeed] = useState(1);

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const clickTap = isTouchDevice ? "Tap" : "Click";
  const allAnimationInfo = {
    rotation: { label: "Rotation", instructions: `${clickTap} once to choose the center of rotation` },
    translation: { label: "Translation", instructions: `${clickTap} twice to choose an axis of translation` }
  };
  const animationInfo = allAnimationInfo[animationName] || {};

  function handlePlayPausePress() {
    setIsAnimating(is => !is);
  }

  // function handleAnimSpeedChange(event) {
  //   setAnimSpeed(event.target.value);
  // }
  function handleAnimationSpeedChange(event) {
    setAnimationSpeed(event.target.value);
  }

  return (
    <CollapsibleCard
      title={"Animations"}
      isOpen={isOpen}
      toggleIsOpen={toggleIsOpen}
    >
      <Card.Text>
        Animation: { animationInfo.label || "n/a" }
        <br/>
        Instructions: { animationInfo.instructions || "n/a" }
      </Card.Text>

      <Stack direction="horizontal" gap={3}>
        <Button
          className="ms-auto"
          disabled={animationName === undefined}
          onClick={handlePlayPausePress}
          onTouchStart={handlePlayPausePress}
        >
          { isAnimating ? "Pause" : "Play" }
        </Button>
        <Form>
          <Form.Group controlId="animation-speed">
            <Form.Label>
              Speed: { animationName === undefined ? "n/a" : animationSpeed }
            </Form.Label>
            <Form.Range
              disabled={animationName === undefined}
              onChange={handleAnimationSpeedChange}
              value={animationSpeed}
              min={-10}
              max={10}
            />
          </Form.Group>
        </Form>
      </Stack>
    </CollapsibleCard>
  );
}