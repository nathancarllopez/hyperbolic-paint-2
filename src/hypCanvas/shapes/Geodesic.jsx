import { Arc, Line } from "react-konva";
import { EPSILON, GEODESIC_COLOR, VERTICAL_AXIS_HEIGHT } from "../constants";
import Point from "./Point";

export default function Geodesic({ clicked1, clicked2, color = GEODESIC_COLOR }) {
  // Case 1: Vertical line
  const deltaX = clicked2.mathX - clicked1.mathX;
  if (Math.abs(deltaX) < EPSILON) {
    return (
      <>
        <Point clickedX={clicked1.canvasX} clickedY={clicked1.canvasY} />
        <Line
          x={clicked1.canvasX}
          y={VERTICAL_AXIS_HEIGHT}
          points={[0, 0, window.innerWidth, 0]}
          stroke={color}
        />
      </>
    );
  }
  
  // Case 2: Same y-value
  const anchors = [clicked1, clicked2].toSorted((a, b) => a.mathX - b.mathX);
  const midpointX = (clicked1.mathX + clicked2.mathX) / 2;
  const deltaY = clicked2.mathY - clicked1.mathY;
  if (Math.abs(deltaY) < EPSILON) {
    const radius = Math.sqrt((midpointX - clicked1.mathX) ** 2 + (clicked1.mathY) ** 2);
    const midpointCanvasX = midpointX + window.innerWidth / 2;
    return (
      <>
        {anchors.map((anchor, idx) => (
          <Point key={idx} clickedX={anchor.canvasX} clickedY={anchor.canvasY}/>
        ))}
        <Arc
          x={midpointCanvasX}
          y={VERTICAL_AXIS_HEIGHT}
          angle={180}
          innerRadius={radius}
          outerRadius={radius}
          stroke={color}
          clockwise
        />
      </>
    );
  }
  
  // Case 3: General case
  const midpointY = (clicked1.mathY + clicked2.mathY) / 2;
  const slope = deltaY / deltaX;
  const perpSlope = -1 / slope;
  const yIntercept = midpointY - perpSlope * midpointX;
  const center = -yIntercept / perpSlope;
  const canvasCenter = center + window.innerWidth / 2;
  const radius = Math.sqrt((center - clicked1.mathX) ** 2 + (clicked1.mathY) ** 2);
  return (
    <>
      {anchors.map((anchor, idx) => (
        <Point key={idx} clickedX={anchor.canvasX} clickedY={anchor.canvasY}/>
      ))}
      <Arc 
        x={canvasCenter}
        y={VERTICAL_AXIS_HEIGHT}
        angle={180}
        innerRadius={radius}
        outerRadius={radius}
        stroke={color}
        clockwise
      />
    </>
  );
}