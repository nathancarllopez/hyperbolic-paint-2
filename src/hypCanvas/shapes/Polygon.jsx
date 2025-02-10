import { FIXED_ANCHOR_COLOR, FREE_ANCHOR_COLOR } from "../../util/constants";
import Point from "./Point";
import { getPolygonParams } from "../math/geometry";
import { Arc, Group, Line } from "react-konva";

export default function Polygon({
  id,
  allClicked,
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
  const fixedAnchor = allClicked[0].params;
  const freeAnchors = allClicked.slice(1).map(drawing => drawing.params);
  const sides = getPolygonParams([fixedAnchor, ...freeAnchors], getMathCoordinates, getCanvasCoordinates);

  function handleFixedAnchorDragMove(event) {
    const konvaFixedAnchor = event.target;
    const fixedAnchorCoords = getMathCoordinates(konvaFixedAnchor.x(), konvaFixedAnchor.y());

    const draggedAnchors = freeAnchors.map((anchor, idx) => {
      const dispVector = {
        x: anchor.canvasX - fixedAnchor.canvasX,
        y: anchor.canvasY - fixedAnchor.canvasY
      };
      const anchorY = fixedAnchorCoords.canvasY + dispVector.y;
      const awayFromBoundary = anchorY < originY - anchorRadius;
      const anchorCoords = awayFromBoundary ?
        getMathCoordinates(fixedAnchorCoords.canvasX + dispVector.x, fixedAnchorCoords.canvasY + dispVector.y) :
        { ...allClicked[idx + 1].params };

      return {
        ...allClicked[idx + 1],
        params: anchorCoords
      };
    });

    const newParams = { allClicked: [
      { ...allClicked[0], params: fixedAnchorCoords },
      ...draggedAnchors
    ] };
    const drawingId = konvaFixedAnchor.getParent().id();

    onDragMove(event, newParams, drawingId);
  }

  function handleFreeAnchorDragMove(event) {
    const konvaFreeAnchor = event.target;
    const anchorIdx = konvaFreeAnchor.name();

    const draggedAnchors = freeAnchors.map((_, idx) => {
      if (idx.toString() !== anchorIdx) {
        return allClicked[idx + 1];
      }

      return {
        ...allClicked[idx + 1],
        params: getMathCoordinates(konvaFreeAnchor.x(), konvaFreeAnchor.y())
      }
    });

    const newParams = { allClicked: [ allClicked[0], ...draggedAnchors ] };
    const drawingId = konvaFreeAnchor.getParent().id();

    onDragMove(event, newParams, drawingId);
  }

  return (
    <Group id={id}>
      {
        sides.map((side, idx) => (
          side.isACircle ?
            <Arc
              key={idx}
              x={side.center}
              y={originY}
              innerRadius={side.radius}
              outerRadius={side.radius}
              stroke={color}
              strokeWidth={strokeWidth}
              listening={false}
              angle={360 - side.arcAngle}
              rotation={-side.rotationAngle}
              clockwise
            /> :
            <Line
              key={idx}
              points={[side.anchor1.canvasX, side.anchor1.canvasY, side.anchor2.canvasX, side.anchor2.canvasY]}
              stroke={color}
              strokeWidth={strokeWidth}
              listening={false}
            />
        ))
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
      {
        freeAnchors.map((anchor, idx) => (
          <Point
            key={idx}
            name={idx.toString()}
            clickedX={anchor.canvasX}
            clickedY={anchor.canvasY}
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
        ))
      }
    </Group>
  );
}