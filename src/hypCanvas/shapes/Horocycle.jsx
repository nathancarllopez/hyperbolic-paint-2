import { Circle, Group } from "react-konva";
import { HOROCYCLE_ANCHOR_COLOR, HOROCYCLE_CENTER_COLOR, HOROCYCLE_COLOR, SELECTED_SHAPE_COLOR } from "../../constants";
import Point from "./Point";

export default function Horocycle({
  id,
  clickedX,
  clickedY,
  getMathCoordinates,
  getCanvasCoordinates,
  onDragStart,
  onDragMove,
  onDragEnd,
  isSelected,
  color = HOROCYCLE_COLOR
}) {
  const center = getMathCoordinates(clickedX, clickedY);
  const anchor = getCanvasCoordinates(center.mathX, 2 * center.mathY);
  const radius = center.mathY;
  const horocycleColor = isSelected ? SELECTED_SHAPE_COLOR : color;

  function handleCenterDragMove(event) {
    const konvaCenter = event.target;

    const newParams = getMathCoordinates(konvaCenter.x(), konvaCenter.y());
    const recipeId = konvaCenter.getParent().id();
    
    onDragMove(event, newParams, recipeId);
  }

  function handleAnchorDragMove(event) {
    const konvaAnchor = event.target;
    if (konvaAnchor.x() !== center.canvasX) {
      konvaAnchor.x(center.canvasX);
    }

    const anchorCoords = getMathCoordinates(konvaAnchor.x(), konvaAnchor.y());
    const newParams = getCanvasCoordinates(anchorCoords.mathX, Math.floor(anchorCoords.mathY / 2));
    const recipeId = konvaAnchor.getParent().id();

    onDragMove(event, newParams, recipeId);
  }

  return (
    <Group id={id}>
      <Circle
        x={center.canvasX}
        y={center.canvasY}
        radius={radius}
        stroke={horocycleColor}
      />
      <Point
        clickedX={center.canvasX}
        clickedY={center.canvasY}
        getMathCoordinates={getMathCoordinates}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={handleCenterDragMove}
        color={HOROCYCLE_CENTER_COLOR}
      />
      <Point
        clickedX={anchor.canvasX}
        clickedY={anchor.canvasY}
        getMathCoordinates={getMathCoordinates}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={handleAnchorDragMove}
        color={HOROCYCLE_ANCHOR_COLOR}
      />
    </Group>
  );
}