import { Arc, Group, Line } from "react-konva";
import { AXIS_TRANSLATION_COLOR, POINT_RADIUS, FREE_ANCHOR_COLOR, FIXED_ANCHOR_COLOR, VERTICAL_AXIS_HEIGHT, SELECTED_SHAPE_COLOR, EPSILON, DASH_LENGTH, DASH_SEPARATION, ANIM_SPEED_DAMPENER } from "../../util/constants";
import { getGeodesicParams } from "../math/geometry";
import { useEffect, useRef } from "react";
import Point from "../shapes/Point";

export default function AxisOfTranslation({
  id,
  clicked1,
  clicked2,
  getMathCoordinates,
  getCanvasCoordinates,
  onDragStart,
  onDragMove,
  onDragEnd,
  isSelected,
  isAnimating,
  animationSpeed,
  anchorRadius
}) {
  const circleOrLineRef = useRef(null);

  useEffect(() => {
    if (!isAnimating) return;

    const konvaCircleOrLine = circleOrLineRef.current;
    // console.log(konvaCircleOrLine)

    let animationFrame = requestAnimationFrame(doTranslation);

    function doTranslation() {
      // console.log('doing');

      if (!isAnimating) {
        cancelAnimationFrame(animationFrame);
        return;
      }
  
      const xSeparation = clicked2.params.canvasX - clicked1.params.canvasX;
      // console.log(xSeparation);
      const isACircle = Math.abs(xSeparation) > EPSILON;

      if (isACircle) {
        // console.log('isACircle');
        const currRotation = konvaCircleOrLine.rotation();
        konvaCircleOrLine.rotation(currRotation + animationSpeed * ANIM_SPEED_DAMPENER);
      }

      // console.log('notACircle');

      animationFrame = requestAnimationFrame(doTranslation);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    }
  }, [clicked1, clicked2, isAnimating, animationSpeed]);

  const fixedAnchor = clicked1.params;
  const freeAnchor = clicked2.params;
  const { isACircle, center, radius } = getGeodesicParams(fixedAnchor, freeAnchor, getMathCoordinates, getCanvasCoordinates);

  const LineAxis = () => (
    <Line
      ref={circleOrLineRef}
      points={[fixedAnchor.canvasX, VERTICAL_AXIS_HEIGHT, fixedAnchor.canvasX, 0]}
      stroke={AXIS_TRANSLATION_COLOR}
      listening={false}
    />
  );

  const CircleAxis = () => (
    <Arc
      ref={circleOrLineRef}
      x={center}
      y={VERTICAL_AXIS_HEIGHT}
      angle={360}
      innerRadius={radius}
      outerRadius={radius}
      stroke={AXIS_TRANSLATION_COLOR}
      clockwise
      dash={[DASH_LENGTH, DASH_SEPARATION]}
      listening={false}
    />
  );

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
        isACircle ? CircleAxis() : LineAxis()
      }
      <Point
        clickedX={fixedAnchor.canvasX}
        clickedY={fixedAnchor.canvasY}
        getMathCoordinates={getMathCoordinates}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={handleFixedAnchorDragMove}
        color={FIXED_ANCHOR_COLOR}
        strokeWidth={1}
        isSelected={isSelected}
        radius={anchorRadius}
      />
      <Point
        clickedX={freeAnchor.canvasX}
        clickedY={freeAnchor.canvasY}
        getMathCoordinates={getMathCoordinates}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={handleFreeAnchorDragMove}
        color={FREE_ANCHOR_COLOR}
        strokeWidth={1}
        isSelected={isSelected}
        radius={anchorRadius}
      />
    </Group>
  );
}