import { Arc, Group, Line } from "react-konva";
import { FREE_ANCHOR_COLOR, FIXED_ANCHOR_COLOR } from "../../util/constants";
import Point from "./Point";
import { getGeodesicParams } from "../math/geometry";

export default function Geodesic({
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
  strokeWidth,
  anchorRadius,
  originY
}) {
  const fixedAnchor = clicked1.params;
  const freeAnchor = clicked2.params;
  const { isACircle, center, radius } = getGeodesicParams(fixedAnchor, freeAnchor, getMathCoordinates, getCanvasCoordinates);

  function handleFixedAnchorDragMove(event) {
    const konvaFixedAnchor = event.target;
    const fixedAnchorCoords = getMathCoordinates(konvaFixedAnchor.x(), konvaFixedAnchor.y());

    const dispVector = {
      x: freeAnchor.canvasX - fixedAnchor.canvasX,
      y: freeAnchor.canvasY - fixedAnchor.canvasY
    };
    const freeAnchorY = fixedAnchorCoords.canvasY + dispVector.y;
    const awayFromBoundary = freeAnchorY < originY - anchorRadius;
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
    const drawingId = konvaFixedAnchor.getParent().id();

    onDragMove(event, newParams, drawingId);
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
    const drawingId = konvaFreeAnchor.getParent().id();

    onDragMove(event, newParams, drawingId);
  }

  return (
    <Group id={id}>
      {
        isACircle ?
          <Arc 
            x={center}
            y={originY}
            angle={180}
            innerRadius={radius}
            outerRadius={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            listening={false}
            clockwise
          /> :
          <Line
            points={[fixedAnchor.canvasX, originY, fixedAnchor.canvasX, 0]}
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
        radius={anchorRadius}
        originY={originY}
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
        radius={anchorRadius}
        originY={originY}
      />
    </Group>
  );
}