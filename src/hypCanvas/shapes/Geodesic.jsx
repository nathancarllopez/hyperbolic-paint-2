import { Arc, Group, Line } from "react-konva";
import { GEODESIC_COLOR, POINT_RADIUS, FREE_ANCHOR_COLOR, FIXED_ANCHOR_COLOR, VERTICAL_AXIS_HEIGHT, SELECTED_SHAPE_COLOR } from "../../constants";
import Point from "./Point";
import { getGeodesicParams } from "../math/geometry";

export default function Geodesic({
  id,
  clicked1,
  clicked2,
  getMathCoordinates,
  onDragStart,
  onDragMove,
  onDragEnd,
  isSelected,
  color = GEODESIC_COLOR
}) {
  const fixedAnchor = clicked1.params;
  const freeAnchor = clicked2.params;
  const geodesicColor = isSelected ? SELECTED_SHAPE_COLOR : color;
  const { isACircle, center, radius } = getGeodesicParams(fixedAnchor, freeAnchor, getMathCoordinates);

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
            angle={180}
            innerRadius={radius}
            outerRadius={radius}
            stroke={geodesicColor}
            clockwise
          /> :
          <Line
            points={[fixedAnchor.canvasX, VERTICAL_AXIS_HEIGHT, fixedAnchor.canvasX, 0]}
            stroke={geodesicColor}
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
      />
      <Point
        clickedX={freeAnchor.canvasX}
        clickedY={freeAnchor.canvasY}
        getMathCoordinates={getMathCoordinates}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={handleFreeAnchorDragMove}
        color={FREE_ANCHOR_COLOR}
      />
    </Group>
  );
}