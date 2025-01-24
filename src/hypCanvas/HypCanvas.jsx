import { Layer, Stage, Text } from "react-konva";

import Axes from "./shapes/Axes";
import { CURSOR_COORD_COLOR, CURSOR_FONT_SIZE } from "../util/constants";

export default function HypCanvas({
  toolbarState,
  mouseCoords,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  // canvasIsDragging,
  originX,
  getMathCoordinates,
  zoomScale,
  children
}) {
  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {/* AXES LAYER */}
      <Layer>
        <Axes 
          originX={originX}
          getMathCoordinates={getMathCoordinates}
          toolbarState={toolbarState}
          zoomScale={zoomScale}
        />
      </Layer>

      {/* CURSOR LAYER */}
      <Layer>
        {/* {
          toolbarState.showMouseCoords && mouseCoords && !canvasIsDragging && 
            <Text
              x={mouseCoords.canvasX}
              y={mouseCoords.canvasY}
              offsetX={-5}
              offsetY={CURSOR_FONT_SIZE * 1.1}
              text={`(${mouseCoords.mathX}, ${mouseCoords.mathY})`}
              fill={CURSOR_COORD_COLOR}
              fontSize={CURSOR_FONT_SIZE}
            />
        } */}
        {
          toolbarState.showMouseCoords && mouseCoords && 
            <Text
              x={mouseCoords.canvasX}
              y={mouseCoords.canvasY}
              offsetX={-5}
              offsetY={CURSOR_FONT_SIZE * 1.1}
              text={`(${mouseCoords.mathX}, ${mouseCoords.mathY})`}
              fill={CURSOR_COORD_COLOR}
              fontSize={CURSOR_FONT_SIZE}
            />
        }
      </Layer>

      {/* SHAPES LAYER */}
      <Layer>{ children }</Layer>
    </Stage>
  );
}