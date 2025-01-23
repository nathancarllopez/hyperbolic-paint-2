import { Arc, Group, Line } from "react-konva";
import { EPSILON, GEODESIC_COLOR, POINT_RADIUS, FREE_ANCHOR_COLOR, FIXED_ANCHOR_COLOR, VERTICAL_AXIS_HEIGHT } from "../../constants";
import Point from "./Point";
import { useState } from "react";
// import { getCanvasCoordinatesOld, getMathCoordinatesOld, getMouseCoordinatesOld } from "../math/coordinates";
import { getGeodesicParams } from "../math/geometry";

export default function Geodesic({
  id,
  clicked1,
  clicked2,
  getMathCoordinates,
  onDragStart,
  onDragMove,
  onDragEnd,
  color = GEODESIC_COLOR
}) {
  const fixedAnchor = clicked1.params;
  const freeAnchor = clicked2.params;

  const { isACircle, center, radius } = getGeodesicParams(fixedAnchor, freeAnchor, getMathCoordinates);

  function handleFixedAnchorDragMove(event) {
    const konvaFixedAnchor = event.target;
    // const fixedAnchorCoords = getMathCoordinatesOld(konvaFixedAnchor.x(), konvaFixedAnchor.y());
    const fixedAnchorCoords = getMathCoordinates(konvaFixedAnchor.x(), konvaFixedAnchor.y());

    const dispVector = {
      x: freeAnchor.canvasX - fixedAnchor.canvasX,
      y: freeAnchor.canvasY - fixedAnchor.canvasY
    };
    const freeAnchorY = fixedAnchorCoords.canvasY + dispVector.y;
    const awayFromBoundary = freeAnchorY < VERTICAL_AXIS_HEIGHT - POINT_RADIUS;
    // const freeAnchorCoords = awayFromBoundary ?
    //   getMathCoordinatesOld(fixedAnchorCoords.canvasX + dispVector.x, fixedAnchorCoords.canvasY + dispVector.y) :
    //   { ...clicked2.params };
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

    // const newParams = {
    //   clicked1: { ...clicked1 },
    //   clicked2: {
    //     ...clicked2,
    //     params: getMathCoordinatesOld(konvaFreeAnchor.x(), konvaFreeAnchor.y())
    //   }
    // };
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
            stroke={color}
            clockwise
          /> :
          <Line
            points={[fixedAnchor.canvasX, VERTICAL_AXIS_HEIGHT, fixedAnchor.canvasX, 0]}
            stroke={color}
          />
      }
      <Point
        // id={id + '-*-fixed'}
        clickedX={fixedAnchor.canvasX}
        clickedY={fixedAnchor.canvasY}
        getMathCoordinates={getMathCoordinates}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={handleFixedAnchorDragMove}
        color={FIXED_ANCHOR_COLOR}
      />
      <Point
        // id={id + '-*-free'}
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