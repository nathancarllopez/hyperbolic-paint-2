import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import FloatingDraggableCard from "../util/FloatingDraggableCard";
import { ANIMATION_TOOLNAMES } from "../util/constants";

export default function AnimationControls({
  history,
  isAnimating, setIsAnimating,
  animationSpeed, setAnimationSpeed
}) {
  const { snapshots, currIdx } = history;
  const animationShape = snapshots[currIdx].find(recipe => ANIMATION_TOOLNAMES.includes(recipe.name));
  const animationName = animationShape?.name || null;

  return (
    <FloatingDraggableCard
      title="Animation Controls"
      placement={{ left: 0, bottom: 0 }}
      centered={false}
    >
      <Stack direction="horizontal" gap={3}>
        <Button
          disabled={animationName === null}
          onClick={() => setIsAnimating(prev => !prev)}
          onTouchStart={() => setIsAnimating(prev => !prev)}
        >
          { isAnimating ? "Pause" : "Play" }
        </Button>

        <Form>
          <Form.Group controlId="animation-speed">
            <Form.Label>
              Speed: {animationName === null ? "n/a" : animationSpeed}
            </Form.Label>
            <Form.Range
              disabled={animationName === null}
              onChange={event => setAnimationSpeed(event.target.value)}
              value={animationSpeed}
              min={-10}
              max={10}
            />
          </Form.Group>
        </Form>
      </Stack>
    </FloatingDraggableCard>
  );
}