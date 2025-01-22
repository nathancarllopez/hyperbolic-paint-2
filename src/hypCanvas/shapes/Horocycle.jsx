import { useEffect, useState } from "react";
import { Circle, Group } from "react-konva";
import { HOROCYCLE_ANCHOR_COLOR, HOROCYCLE_CENTER_COLOR, HOROCYCLE_COLOR, POINT_RADIUS } from "../../constants";
import Point from "./Point";
// import { getCanvasCoordinatesOld, getMathCoordinatesOld, getMouseCoordinatesOld } from "../math/coordinates";

export default function Horocycle({
  id,
  clickedX,
  clickedY,
  getMathCoordinates,
  getCanvasCoordinates,
  onDragStart,
  onDragMove,
  onDragEnd,
  color = HOROCYCLE_COLOR
}) {
  // const center = getMathCoordinatesOld(clickedX, clickedY);
  const center = getMathCoordinates(clickedX, clickedY);
  // const anchor = getCanvasCoordinatesOld(center.mathX, 2 * center.mathY);
  const anchor = getCanvasCoordinates(center.mathX, 2 * center.mathY);
  const radius = center.mathY;

  function handleCenterDragMove(event) {
    const konvaCenter = event.target;

    // const newParams = getMathCoordinatesOld(konvaCenter.x(), konvaCenter.y());
    const newParams = getMathCoordinates(konvaCenter.x(), konvaCenter.y());
    const recipeId = konvaCenter.getParent().id();
    
    onDragMove(event, newParams, recipeId);
  }

  function handleAnchorDragMove(event) {
    const konvaAnchor = event.target;
    if (konvaAnchor.x() !== center.canvasX) {
      konvaAnchor.x(center.canvasX);
    }

    // const anchorCoords = getMathCoordinatesOld(konvaAnchor.x(), konvaAnchor.y());
    // const newParams = getCanvasCoordinatesOld(anchorCoords.mathX, Math.floor(anchorCoords.mathY / 2));
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
        color={HOROCYCLE_CENTER_COLOR}
      />
      <Point
        id={id + '-*-anchor'}
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