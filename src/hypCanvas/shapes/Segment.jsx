import { Arc, Group, Line } from "react-konva";
import { SEGMENT_COLOR, VERTICAL_AXIS_HEIGHT, FREE_ANCHOR_COLOR, FIXED_ANCHOR_COLOR, POINT_RADIUS, SELECTED_SHAPE_COLOR } from "../../util/constants";
import Point from "./Point";
import { getSegmentParams } from "../math/geometry";

export default function Segment({
  id,
  clicked1,
  clicked2,
  getMathCoordinates,
  getCanvasCoordinates,
  onDragStart,
  onDragMove,
  onDragEnd,
  isSelected,
  color,
  strokeWidth
}) {
  const fixedAnchor = clicked1.params;
  const freeAnchor = clicked2.params;
  // const segmentColor = isSelected ? SELECTED_SHAPE_COLOR : color;
  const { isACircle, center, radius, rotationAngle, arcAngle } = getSegmentParams(fixedAnchor, freeAnchor, getMathCoordinates, getCanvasCoordinates);

  function handleFixedAnchorDragMove(event) {
    const konvaFixedAnchor = event.target;
    const fixedAnchorCoords = getMathCoordinates(konvaFixedAnchor.x(), konvaFixedAnchor.y());

    const dispVector = {
      x: freeAnchor.canvasX - fixedAnchor.canvasX,
      y: freeAnchor.canvasY - fixedAnchor.canvasY
    };
    const freeAnchorY = fixedAnchorCoords.canvasY + dispVector.y;
    const awayFromBoundary = freeAnchorY < VERTICAL_AXIS_HEIGHT - POINT_RADIUS;
    const freeAnchorCoords = awayFromBoundary ?
      getMathCoordinates(fixedAnchorCoords.canvasX + dispVector.x, fixedAnchorCoords.canvasY + dispVector.y) :
      { ...clicked2.params };

    const newParams = {
      clicked1: {
        ...clicked1,
        params: fixedAnchorCoords
      },
      clicked2: {
        ...clicked2,
        params: freeAnchorCoords
      }
    };
    const recipeId = konvaFixedAnchor.getParent().id();

    onDragMove(event, newParams, recipeId);
  }

  function handleFreeAnchorDragMove(event) {
    const konvaFreeAnchor = event.target;

    const newParams = {
      clicked1: { ...clicked1 },
      clicked2: {
        ...clicked2,
        params: getMathCoordinates(konvaFreeAnchor.x(), konvaFreeAnchor.y())
      }
    };
    const recipeId = konvaFreeAnchor.getParent().id();

    onDragMove(event, newParams, recipeId);
  }

  return (
    <Group id={id}>
      {
        isACircle ?
          <Arc
            x={center}
            y={VERTICAL_AXIS_HEIGHT}
            innerRadius={radius}
            outerRadius={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            listening={false}
            angle={360 - arcAngle}
            rotation={-rotationAngle}
            clockwise
          /> :
          <Line
            points={[fixedAnchor.canvasX, fixedAnchor.canvasY, freeAnchor.canvasX, freeAnchor.canvasY]}
            stroke={color}
            strokeWidth={strokeWidth}
            listening={false}
          />
      }
      <Point
        clickedX={fixedAnchor.canvasX}
        clickedY={fixedAnchor.canvasY}
        getMathCoordinates={getMathCoordinates}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={handleFixedAnchorDragMove}
        color={FIXED_ANCHOR_COLOR}
        strokeWidth={strokeWidth}
        isSelected={isSelected}
      />
      <Point 
        clickedX={freeAnchor.canvasX}
        clickedY={freeAnchor.canvasY}
        getMathCoordinates={getMathCoordinates}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={handleFreeAnchorDragMove}
        color={FREE_ANCHOR_COLOR}
        strokeWidth={strokeWidth}
        isSelected={isSelected}
      />
    </Group>
  );
}