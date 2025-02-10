import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import InputGroup from "react-bootstrap/InputGroup";
import Stack from "react-bootstrap/Stack";
import { ANIMATION_TOOLNAMES } from "../util/constants";
import FloatingDraggableCard from "../util/FloatingDraggableCard";
import CollapsibleCard from "../util/CollapsibleCard";
import playIcon from "../assets/play-fill.svg";
import pauseIcon from "../assets/pause-fill.svg";

export default function AnimationControls({
  history,
  isAnimating, setIsAnimating,
  animationSpeed, setAnimationSpeed
}) {
  const [isOpen, setIsOpen] = useState(true);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const initialPlacement = isTouchDevice ?
  { left: "1rem", bottom: "3rem" } :
  { left: "1rem", bottom: "4rem" };

  const { snapshots, currIdx } = history;
  const animationShape = snapshots[currIdx].find(drawing => ANIMATION_TOOLNAMES.includes(drawing.name));
  const animationName = animationShape?.name || null;
  const speedUnits = (() => {
    if (animationName === null) return "n/a";

    switch(animationName) {
      case 'rotation': {
        return "deg/s";
      }
      case 'translation': {
        return "units/s";
      }
      default: {
        throw new Error(`Unexpected animation name: ${animationName}`)
      }
    }
  })();

  return (
    <FloatingDraggableCard
      placement={initialPlacement}
      cardBodyStyles={{ 
        padding: 0,
        width: isTouchDevice ? "145px" : 'auto'
      }}
    >
      <CollapsibleCard
        title={"Controls"}
        isOpen={isOpen}
        toggleIsOpen={() => setIsOpen(!isOpen)}
      >
        <Stack gap={2}>
          <Button
            disabled={animationSpeed === "" || animationName === null}
            onClick={() => setIsAnimating(!isAnimating)}
            onTouchStart={() => setIsAnimating(!isAnimating)}
          >
            <Image src={ isAnimating ? pauseIcon : playIcon } fluid/>
          </Button>

          <InputGroup className="mb-1">
            <Form.Control
              type="number"
              id="animation-speed-input"
              disabled={animationName === null}
              onChange={event => setAnimationSpeed(event.target.value)}
              value={animationSpeed}
              min={-10}
              max={10}
            />
            <InputGroup.Text>{speedUnits}</InputGroup.Text>
          </InputGroup>
        </Stack>        
      </CollapsibleCard>
    </FloatingDraggableCard>
  );
}