import { useState } from "react";
import { CIRCLE_ANCHOR_COLOR, CIRCLE_CENTER_COLOR, CIRCLE_COLOR, EPSILON, POINT_RADIUS, VERTICAL_AXIS_HEIGHT } from "../../constants";
import { Circle, Group } from "react-konva";
import Point from "./Point";
// import { getCanvasCoordinatesOld, getMathCoordinatesOld } from "../math/coordinates";
import { getHypCircleParams } from "../math/geometry";

export default function HypCircle({
  id,
  clicked1,
  clicked2,
  getMathCoordinates,
  getCanvasCoordinates,
  onDragStart,
  onDragMove,
  onDragEnd,
  color = CIRCLE_COLOR
}) {
  const center = clicked1.params;
  const anchor = clicked2.params;
  // const { eucCenter, radius } = getHypCircleParams(center, anchor);
  const { eucCenter, radius } = getHypCircleParams(center, anchor, getCanvasCoordinates);

  function handleCenterDragMove(event) {
    const konvaCenter = event.target;
    // const centerCoords = getMathCoordinatesOld(konvaCenter.x(), konvaCenter.y());
    const centerCoords = getMathCoordinates(konvaCenter.x(), konvaCenter.y());

    const dispVector = {
      x: anchor.canvasX - center.canvasX,
      y: anchor.canvasY - center.canvasY
    };
    const anchorY = centerCoords.canvasY + dispVector.y;
    const awayFromBoundary = anchorY < VERTICAL_AXIS_HEIGHT - POINT_RADIUS;
    // const anchorCoords = awayFromBoundary ?
    //   getMathCoordinatesOld(centerCoords.canvasX + dispVector.x, centerCoords.canvasY + dispVector.y) : 
    //   { ...clicked2.params };
    const anchorCoords = awayFromBoundary ?
      getMathCoordinates(centerCoords.canvasX + dispVector.x, centerCoords.canvasY + dispVector.y) : 
      { ...clicked2.params };
    
    const newParams = {
      clicked1: {
        ...clicked1,
        params: centerCoords,
      },
      clicked2: {
        ...clicked2,
        params: anchorCoords
      }
    };
    const recipeId = konvaCenter.getParent().id();

    onDragMove(event, newParams, recipeId);
  }

  function handleAnchorDragMove(event) {
    const konvaAnchor = event.target;

    // const newParams = {
    //   clicked1: { ...clicked1 },
    //   clicked2: {
    //     ...clicked2,
    //     params: getMathCoordinatesOld(konvaAnchor.x(), konvaAnchor.y()),
    //   }
    // }
    const newParams = {
      clicked1: { ...clicked1 },
      clicked2: {
        ...clicked2,
        params: getMathCoordinates(konvaAnchor.x(), konvaAnchor.y()),
      }
    };
    const recipeId = konvaAnchor.getParent().id();

    onDragMove(event, newParams, recipeId);
  }

  return (
    <Group id={id}>
      <Circle 
        x={eucCenter.canvasX}
        y={eucCenter.canvasY}
        radius={radius}
        stroke={color}
      />
      <Point
        id={id + '-*-center'}
        clickedX={center.canvasX}
        clickedY={center.canvasY}
        getMathCoordinates={getMathCoordinates}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={handleCenterDragMove}
        color={CIRCLE_CENTER_COLOR}
      />
      <Point
        id={id + '-*-anchor'}
        clickedX={anchor.canvasX}
        clickedY={anchor.canvasY}
        getMathCoordinates={getMathCoordinates}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={handleAnchorDragMove}
        color={CIRCLE_ANCHOR_COLOR}
      />
    </Group>
  );
}