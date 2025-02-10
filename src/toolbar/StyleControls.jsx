import { useState } from "react";
import FloatingDraggableCard from "../util/FloatingDraggableCard";
import CollapsibleCard from "../util/CollapsibleCard";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { ANIMATION_TOOLNAMES } from "../util/constants";

export default function StyleControls({
  history, setHistory
}) {
  const [isOpen, setIsOpen] = useState(true);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const initialPlacement = { left: "1rem", bottom: isTouchDevice ? "3rem" : "4rem" };

  const { snapshots, currIdx } = history;
  const selectedShape = snapshots[currIdx].find(drawing => drawing.isSelected && !ANIMATION_TOOLNAMES.includes(drawing.name));

  function handleEditStyle(attribute, event) {
    console.log('changing style panel')
    event.nativeEvent.stopPropagation();

    setHistory(prev => {
      const value = (() => {
        switch(attribute) {
          case "color": {
            return event.target.value;
          }
          case "strokeWidth": {
            return parseInt(event.target.value);
          }
          default: {
            throw new Error(`Unexpected style attribute: ${attribute}`)
          }
        }
      })();

      const { snapshots, currIdx } = prev;
      const snapshotsTillCurrent = snapshots.slice(0, currIdx + 1);
      const currentSnapshot = snapshots[currIdx];
      const editedCurrent = currentSnapshot.map(drawing => {
        if (drawing.id !== selectedShape.id) return drawing;
        return {
          ...drawing,
          styles: { ...drawing.styles, [attribute]: value }
        };
      });

      return {
        snapshots: [ ...snapshotsTillCurrent, editedCurrent ],
        currIdx: currIdx + 1
      }
    });
  }

  return (
    <FloatingDraggableCard
      placement={initialPlacement}
      cardBodyStyles={{
        padding: 0
      }}
    >
      <CollapsibleCard
        title={"Edit"}
        isOpen={isOpen}
        toggleIsOpen={() => setIsOpen(!isOpen)}
      >
        <Form>
          <Form.Group className="mb-1" as={Row} controlId="edit-drawing-color">
            <Form.Label column>Color</Form.Label>
            <Col>
              <Form.Control
                type="color"
                value={selectedShape.styles.color}
                onChange={(event) => handleEditStyle('color', event)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="edit-drawing-width">
            <Form.Label column>Width</Form.Label>
            <Col>
              <Form.Control
                type="number"
                value={selectedShape.styles.strokeWidth}
                onChange={(event) => handleEditStyle('strokeWidth', event)}
                min={1}
                max={100}
              />
            </Col>
          </Form.Group>
        </Form>
      </CollapsibleCard>
    </FloatingDraggableCard>
  );
}