import { Circle, Group } from "react-konva";
import { FREE_ANCHOR_COLOR, FIXED_ANCHOR_COLOR } from "../../util/constants";
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
  color,
  strokeWidth,
  anchorRadius,
  originY
}) {
  const center = getMathCoordinates(clickedX, clickedY);
  const anchor = getCanvasCoordinates(center.mathX, 2 * center.mathY);
  const radius = center.mathY;

  function handleCenterDragMove(event) {
    const konvaCenter = event.target;

    const newParams = getMathCoordinates(konvaCenter.x(), konvaCenter.y());
    const drawingId = konvaCenter.getParent().id();
    
    onDragMove(event, newParams, drawingId);
  }

  function handleAnchorDragMove(event) {
    const konvaAnchor = event.target;
    if (konvaAnchor.x() !== center.canvasX) {
      konvaAnchor.x(center.canvasX);
    }

    const anchorCoords = getMathCoordinates(konvaAnchor.x(), konvaAnchor.y());
    const newParams = getCanvasCoordinates(anchorCoords.mathX, Math.floor(anchorCoords.mathY / 2));
    const drawingId = konvaAnchor.getParent().id();

    onDragMove(event, newParams, drawingId);
  }

  return (
    <Group id={id}>
      <Circle
        x={center.canvasX}
        y={center.canvasY}
        radius={radius}
        stroke={color}
        listening={false}
        strokeWidth={strokeWidth}
      />
      <Point
        clickedX={center.canvasX}
        clickedY={center.canvasY}
        getMathCoordinates={getMathCoordinates}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={handleCenterDragMove}
        color={FIXED_ANCHOR_COLOR}
        strokeWidth={strokeWidth}
        isSelected={isSelected}
        radius={anchorRadius}
        originY={originY}
      />
      <Point
        clickedX={anchor.canvasX}
        clickedY={anchor.canvasY}
        getMathCoordinates={getMathCoordinates}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={handleAnchorDragMove}
        color={FREE_ANCHOR_COLOR}
        strokeWidth={strokeWidth}
        isSelected={isSelected}
        radius={anchorRadius}
        originY={originY}
      />
    </Group>
  );
}