import { useState } from "react";
import { Circle } from "react-konva";
import { DRAGGING_POINT_COLOR, POINT_COLOR, POINT_RADIUS } from "../constants";

export default function Point({ clickedX, clickedY, color = POINT_COLOR}) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <Circle
      x={clickedX}
      y={clickedY}
      radius={POINT_RADIUS}
      stroke={isDragging ? DRAGGING_POINT_COLOR : color}
      fill={isDragging ? DRAGGING_POINT_COLOR : color}
      draggable
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    />
  );
}