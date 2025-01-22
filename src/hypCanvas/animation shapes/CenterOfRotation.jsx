import { useEffect, useRef, useState } from "react";
import { CENTER_ROTATION_COLOR, DASH_LENGTH, DASH_SEPARATION, POINT_RADIUS, VERTICAL_AXIS_HEIGHT } from "../../constants";
import Point from "../shapes/Point";
// import { getMathCoordinatesOld } from "../math/coordinates";
import { getHypCircleParams } from "../math/geometry";
import { Circle, Group } from "react-konva";

export default function CenterOfRotation({
  id,
  clickedX,
  clickedY,
  getMathCoordinates,
  getCanvasCoordinates,
  onDragStart,
  onDragMove,
  onDragEnd,
  isAnimating,
  color = CENTER_ROTATION_COLOR,
}) {
  const bdryCircleRef = useRef(null);

  useEffect(() => {
    if (!isAnimating) return;

    const konvaBdryCircle = bdryCircleRef.current;
    let animationFrame = requestAnimationFrame(doRotation);
    
    function doRotation() {
      if (!isAnimating) {
        cancelAnimationFrame(animationFrame);
        return;
      }

      const currRotation = konvaBdryCircle.rotation();
      konvaBdryCircle.rotation(currRotation - 1);

      animationFrame = requestAnimationFrame(doRotation);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    }
  }, [isAnimating]);

  // const center = getMathCoordinatesOld(clickedX, clickedY);
  const center = getMathCoordinates(clickedX, clickedY);
  const anchorY = Math.min(VERTICAL_AXIS_HEIGHT - POINT_RADIUS, center.canvasY + window.innerHeight * 0.1)
  // const anchor = getMathCoordinatesOld(center.canvasX, anchorY);
  const anchor = getMathCoordinates(center.canvasX, anchorY);

  const { eucCenter, radius } = getHypCircleParams(center, anchor, getCanvasCoordinates);

  function handleCenterDragMove(event) {
    const konvaCenter = event.target;

    // const newParams = getMathCoordinatesOld(konvaCenter.x(), konvaCenter.y());
    const newParams = getMathCoordinates(konvaCenter.x(), konvaCenter.y());
    const recipeId = konvaCenter.getParent().id();

    onDragMove(event, newParams, recipeId);
  }

  return (
    <Group id={id}>
      <Circle
        ref={bdryCircleRef}
        x={eucCenter.canvasX}
        y={eucCenter.canvasY}
        radius={radius}
        stroke={color}
        dash={[DASH_LENGTH, DASH_SEPARATION]}
      />
      <Point
        id={id + '-*-center'}
        clickedX={center.canvasX}
        clickedY={center.canvasY}
        getMathCoordinates={getMathCoordinates}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={handleCenterDragMove}
        color={color}
      />
    </Group>
  );
}