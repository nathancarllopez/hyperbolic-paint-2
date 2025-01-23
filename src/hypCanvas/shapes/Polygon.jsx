import { POLYGON_COLOR, FIXED_ANCHOR_COLOR, FREE_ANCHOR_COLOR, VERTICAL_AXIS_HEIGHT, POINT_RADIUS, SELECTED_SHAPE_COLOR } from "../../constants";
import Point from "./Point";
import { getPolygonParams } from "../math/geometry";
import { Arc, Group, Line } from "react-konva";

export default function Polygon({
  id,
  allClicked,
  getMathCoordinates,
  onDragStart,
  onDragMove,
  onDragEnd,
  isSelected,
  color = POLYGON_COLOR
}) {
  const fixedAnchor = allClicked[0].params;
  const freeAnchors = allClicked.slice(1).map(recipe => recipe.params);
  const polygonColor = isSelected ? SELECTED_SHAPE_COLOR : color;
  const sides = getPolygonParams([fixedAnchor, ...freeAnchors], getMathCoordinates);

  function handleFixedAnchorDragMove(event) {
    const konvaFixedAnchor = event.target;
    const fixedAnchorCoords = getMathCoordinates(konvaFixedAnchor.x(), konvaFixedAnchor.y());

    const draggedAnchorRecipes = freeAnchors.map((anchor, idx) => {
      const dispVector = {
        x: anchor.canvasX - fixedAnchor.canvasX,
        y: anchor.canvasY - fixedAnchor.canvasY
      };
      const anchorY = fixedAnchorCoords.canvasY + dispVector.y;
      const awayFromBoundary = anchorY < VERTICAL_AXIS_HEIGHT - POINT_RADIUS;
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
      ...draggedAnchorRecipes
    ] };
    const recipeId = konvaFixedAnchor.getParent().id();

    onDragMove(event, newParams, recipeId);
  }

  function handleFreeAnchorDragMove(event) {
    const konvaFreeAnchor = event.target;
    console.log(konvaFreeAnchor);
    const anchorIdx = konvaFreeAnchor.name();
    console.log(anchorIdx);

    const draggedAnchorRecipes = freeAnchors.map((_, idx) => {
      if (idx.toString() !== anchorIdx) {
        return allClicked[idx + 1];
      }

      return {
        ...allClicked[idx + 1],
        params: getMathCoordinates(konvaFreeAnchor.x(), konvaFreeAnchor.y())
      }
    });

    const newParams = { allClicked: [ allClicked[0], ...draggedAnchorRecipes ] };
    const recipeId = konvaFreeAnchor.getParent().id();

    onDragMove(event, newParams, recipeId);
  }

  return (
    <Group id={id}>
      {
        sides.map((side, idx) => (
          side.isACircle ?
            <Arc
              key={idx}
              x={side.center}
              y={VERTICAL_AXIS_HEIGHT}
              innerRadius={side.radius}
              outerRadius={side.radius}
              stroke={polygonColor}
              angle={360 - side.arcAngle}
              rotation={-side.rotationAngle}
              clockwise
            /> :
            <Line
              key={idx}
              points={[side.anchor1.canvasX, side.anchor1.canvasY, side.anchor2.canvasX, side.anchor2.canvasY]}
              stroke={polygonColor}
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
          />
        ))
      }
    </Group>
  );
}