import { useState } from "react";
import { Circle, Group } from "react-konva";
import { POINT_COLOR, POINT_RADIUS, FOCUSED_POINT_COLOR, SELECTED_SHAPE_COLOR, VERTICAL_AXIS_HEIGHT } from "../../constants";

export default function Point({
  id = "",
  name = undefined,
  clickedX,
  clickedY,
  getMathCoordinates,
  color = POINT_COLOR,
  isDraggable = true,
  onDragStart = () => {},
  onDragMove = () => {},
  onDragEnd = () => {},
  isSelected = false,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const pointColor = isFocused ? FOCUSED_POINT_COLOR :
                     isSelected ? SELECTED_SHAPE_COLOR :
                     color;

  const KonvaCircle = (shapeId, shapeName) => (
    <Circle
      id={shapeId}
      name={shapeName}
      x={clickedX}
      y={clickedY}
      radius={POINT_RADIUS}
  
      stroke={ pointColor }
      fill={ pointColor }
  
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragMove={handleDragMove}
      onDragEnd={onDragEnd}
    />
  );

  function handleDragMove(event) {
    const konvaPoint = event.target;
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

    const newParams = getMathCoordinates(konvaPoint.x(), konvaPoint.y());
    const recipeId = konvaPoint.id();

    onDragMove(event, newParams, recipeId);
  }

  return (
    <>
      {/* We do this so that all shapes (including those that have Points as subcomponents) can access their id via shape.getParent().id() */}
      {
        id !== "" ?
          <Group id={id}>{KonvaCircle(undefined, name)}</Group> :
          KonvaCircle(id, name)
      }
    </>
  );
}