import { useState } from "react";
import { Circle, Group, Rect } from "react-konva";
import { SELECT_BOX_COLOR } from "../../util/constants";

export default function Point({
  id = "",
  name = undefined,
  clickedX,
  clickedY,
  getMathCoordinates,
  color,
  strokeWidth,
  radius,
  // hitRadius,
  isDraggable = true,
  onDragStart = () => {},
  onDragMove = () => {},
  onDragEnd = () => {},
  isSelected = false,
  originY
}) {
  // console.log(clickedX, clickedY)
  // console.log('id:', id);
  const [isFocused, setIsFocused] = useState(false);

  function handleDragMove(event) {
    const konvaPoint = event.target;
    const { canvasX, canvasY } = getMathCoordinates(konvaPoint.x(), konvaPoint.y());
    if (canvasY > originY - (radius + strokeWidth)) {
      konvaPoint.y(originY - (radius + strokeWidth))
    } else if (canvasY < radius + strokeWidth) {
      konvaPoint.y(radius + strokeWidth)
    } else if (canvasX < radius + strokeWidth) {
      konvaPoint.x(radius + strokeWidth)
    } else if (canvasX > window.innerWidth - (radius + strokeWidth)) {
      konvaPoint.x(window.innerWidth - (radius + strokeWidth))
    }

    const newParams = getMathCoordinates(konvaPoint.x(), konvaPoint.y());
    const drawingId = konvaPoint.getParent().id();

    onDragMove(event, newParams, drawingId);
  }

  const PointComponent = (pointId, pointName) => {
    // console.log('id:', pointId);
    // console.log('name:', pointName);
    
    return (
      <Circle
        id={pointId}
        name={pointName}
        x={clickedX}
        y={clickedY}
        radius={radius + strokeWidth}
        // hitStrokeWidth={hitRadius}
    
        stroke={color}
        fill={color}
    
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
        
        draggable={isDraggable}
        onDragStart={onDragStart}
        onDragMove={handleDragMove}
        onDragEnd={onDragEnd}
      />
    );
  }

  return (
    <>
      <Rect
        x={clickedX - (radius + strokeWidth) - 2}
        y={clickedY - (radius + strokeWidth) - 2}
        width={2 * (radius + strokeWidth + 2)}
        height={2 * (radius + strokeWidth + 2)}
        stroke={SELECT_BOX_COLOR}
        listening={false}
        strokeWidth={isFocused || isSelected ? 1 : 0}
      />
      {/* We do this so that all shapes (including those that have Points as subcomponents) can access their id via shape.getParent().id() */}
      {
        id !== "" ? 
          <Group id={id}>
            { PointComponent(undefined, name) }
          </Group> :
          PointComponent(id, name)
      }
    </>
  );
}