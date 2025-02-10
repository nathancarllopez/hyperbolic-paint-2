import { useEffect, useRef } from "react";
import { ANIMATION_SHAPE_COLOR, DASH_LENGTH, DASH_SEPARATION } from "../../util/constants";
import Point from "../shapes/Point";
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
  isSelected,
  animationSpeed,
  anchorRadius,
  originY
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
      konvaBdryCircle.rotation(currRotation - animationSpeed);

      animationFrame = requestAnimationFrame(doRotation);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    }
  }, [isAnimating, animationSpeed]);

  const center = getMathCoordinates(clickedX, clickedY);
  const anchorY = Math.min(originY - anchorRadius, center.canvasY + window.innerHeight * 0.1)
  const anchor = getMathCoordinates(center.canvasX, anchorY);
  const { eucCenter, radius } = getHypCircleParams(center, anchor, getCanvasCoordinates);

  function handleCenterDragMove(event) {
    const konvaCenter = event.target;

    const newParams = getMathCoordinates(konvaCenter.x(), konvaCenter.y());
    const drawingId = konvaCenter.getParent().id();

    onDragMove(event, newParams, drawingId);
  }

  return (
    <Group id={id}>
      <Circle
        ref={bdryCircleRef}
        x={eucCenter.canvasX}
        y={eucCenter.canvasY}
        radius={radius}
        stroke={ANIMATION_SHAPE_COLOR}
        dash={[DASH_LENGTH, DASH_SEPARATION]}
        listening={false}
      />
      <Point
        clickedX={center.canvasX}
        clickedY={center.canvasY}
        getMathCoordinates={getMathCoordinates}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={handleCenterDragMove}
        color={ANIMATION_SHAPE_COLOR}
        strokeWidth={1}
        isSelected={isSelected}
        radius={anchorRadius}
      />
    </Group>
  );
}