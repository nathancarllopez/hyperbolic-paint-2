import { useState } from "react";
import { Label, Layer, Stage, Tag, Text } from "react-konva";

import Axes from "./shapes/Axes";
import Geodesic from "./shapes/Geodesic";
import Point from "./shapes/Point";
import { CLICKED_POINT_COLOR, CURSOR_COORD_COLOR, CURSOR_FONT_SIZE, VERTICAL_AXIS_HEIGHT } from "./constants";
import { getPointerCoordinates } from "./coordinates";

export default function HypCanvas({ toolbarState, shapes, addShapes }) {
  // const [shapes, setShapes] = useState([]);
  const [activePoints, setActivePoints] = useState([]);

  function handleOnClick(event) {
    const { canvasX, canvasY, mathX, mathY } = getPointerCoordinates(event);

    switch(toolbarState.clickTool) {
      case 'point':
        return addPoint(canvasX, canvasY);
      case 'line':
        return addGeodesic(canvasX, canvasY, mathX, mathY);
    }

    function addPoint(canvasX, canvasY) {
      addShapes(<Point clickedX={canvasX} clickedY={canvasY} />)
      // setShapes([ ...shapes, <Point clickedX={canvasX} clickedY={canvasY} /> ]);
    }

    function addGeodesic(canvasX, canvasY, mathX, mathY) {
      if (!activePoints.length) {
        setActivePoints([{ canvasX, canvasY, mathX, mathY }]);
        return;
      }

      const firstClicked = [...activePoints].pop();
      addShapes(<Geodesic clicked1={firstClicked} clicked2={{ canvasX, canvasY, mathX, mathY }} />);
      // setShapes([ ...shapes, <Geodesic clicked1={firstClicked} clicked2={{ canvasX, canvasY, mathX, mathY }} />])
      setActivePoints([])
    }
  }

  const [cursorCoord, setCursorCoord] = useState(null);
  function handleMouseMove(event) {
    const coordinates = getPointerCoordinates(event);
    if (coordinates.mathY < 0) {
      setCursorCoord(null);
      return;
    }

    setCursorCoord({ ...coordinates });
  }

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onClick={handleOnClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setCursorCoord(null)}
    >
      <Layer>
        <Axes />
        {toolbarState.showCursorCoord && cursorCoord && 
          <Text
            x={cursorCoord.canvasX}
            y={cursorCoord.canvasY}
            text={`(${cursorCoord.mathX}, ${cursorCoord.mathY})`}
            fill={CURSOR_COORD_COLOR}
            fontSize={CURSOR_FONT_SIZE}
            offsetY={CURSOR_FONT_SIZE * 1.1}
            offsetX={-5}
          />
        }
      </Layer>

      <Layer>
        {activePoints.map(({ canvasX, canvasY }, idx) => (
          <Point key={idx} clickedX={canvasX} clickedY={canvasY} color={CLICKED_POINT_COLOR} />
        ))}
        {...shapes}
      </Layer>
    </Stage>
  );
}
