import { useEffect, useState } from "react";
import { Circle, Group } from "react-konva";
import { DRAGGING_POINT_COLOR, POINT_COLOR, POINT_RADIUS, FOCUSED_POINT_COLOR, POINT_SHADOW_COLOR, SELECTED_POINT_COLOR, VERTICAL_AXIS_HEIGHT } from "../../constants";
// import { getCanvasCoordinatesOld, getMathCoordinatesOld, getMouseCoordinatesOld } from "../math/coordinates";

export default function Point({
  id,
  clickedX,
  clickedY,
  getMathCoordinates,
  color = POINT_COLOR,
  isDraggable = true,
  onDragStart = () => {},
  onDragMove = () => {},
  onDragEnd = () => {},
}) {
  const [isFocused, setIsFocused] = useState(false);

  function handleDragStart() {
    onDragStart();
  }

  function handleDragMove(event) {
    const konvaPoint = event.target;
    // const { canvasX, canvasY } = getMathCoordinatesOld(konvaPoint.x(), konvaPoint.y());
    const { canvasX, canvasY } = getMathCoordinates(konvaPoint.x(), konvaPoint.y());
    if (canvasY > VERTICAL_AXIS_HEIGHT - POINT_RADIUS) {
      konvaPoint.y(VERTICAL_AXIS_HEIGHT - POINT_RADIUS)
    } else if (canvasY < POINT_RADIUS) {
      konvaPoint.y(POINT_RADIUS)
    } else if (canvasX < POINT_RADIUS) {
      konvaPoint.x(POINT_RADIUS)
    } else if (canvasX > window.innerWidth - POINT_RADIUS) {
      konvaPoint.x(window.innerWidth - POINT_RADIUS)
    }

    // const newParams = getMathCoordinatesOld(konvaPoint.x(), konvaPoint.y());
    const newParams = getMathCoordinates(konvaPoint.x(), konvaPoint.y());
    const recipeId = konvaPoint.id();

    onDragMove(event, newParams, recipeId);
  }

  function handleDragEnd() {
    onDragEnd();
  }

  return (
    <Circle
      id={id}
      x={clickedX}
      y={clickedY}
      radius={POINT_RADIUS}

      stroke={ isFocused ? FOCUSED_POINT_COLOR : color }
      fill={ isFocused ? FOCUSED_POINT_COLOR : color }

      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    />
  );
}
